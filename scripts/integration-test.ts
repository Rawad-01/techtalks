import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { chromium, expect } from "@playwright/test";
import { encode } from "next-auth/jwt";
import { seedDatabase } from "./seed";
import { Blog } from "../models/Blog";
import { Community } from "../models/Community";
import { User } from "../models/User";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  changeMembership,
} from "../lib/services";

const artifacts = path.resolve(".artifacts");
const port = 3210;
const base = `http://localhost:${port}`;
const secret = randomBytes(32).toString("hex");
let server: ChildProcess | undefined;
let mongo: MongoMemoryServer | undefined;
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
let logs = "";
const checks: string[] = [];
function passed(message: string) {
  checks.push(message);
  console.log(`PASS ${message}`);
}
const storyInput = {
  title: "Testing the full publishing workflow",
  slug: "testing-the-full-publishing-workflow",
  excerpt: "A complete story used to verify the real publishing workflow.",
  content:
    "A practical discussion of a technical problem, including the lessons we learned and the decisions that helped us move forward. ".repeat(
      5,
    ),
  tags: ["react"],
  published: true,
};
async function waitForServer() {
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    if (server?.exitCode !== null)
      throw new Error("Next.js exited before becoming ready.");
    try {
      if ((await fetch(`${base}/api/communities`)).ok) return;
    } catch {
      /* Process is starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Next.js startup timed out.");
}
async function run() {
  await mkdir(artifacts, { recursive: true });
  mongo = await MongoMemoryServer.create({
    instance: { dbName: "techtalks-integration" },
  });
  process.env.MONGODB_URI = mongo.getUri();
  await seedDatabase();
  await seedDatabase();
  assert.equal(await Blog.countDocuments(), 7);
  assert.equal(await Community.countDocuments(), 6);
  assert.equal(await User.countDocuments(), 4);
  passed("Seed is repeatable and preserves existing records");
  const author = await User.create({
    name: "Test Developer",
    email: "author@integration.example",
    provider: "github",
    oauthId: "github:integration-author",
  });
  const other = await User.create({
    name: "Another Developer",
    email: "other@integration.example",
    provider: "google",
    oauthId: "google:integration-other",
  });
  const community = await Community.findOne({ slug: "react" }).orFail();
  await Promise.all(
    Array.from({ length: 8 }, () =>
      changeMembership(author.id, community.id, true),
    ),
  );
  let stored = await Community.findById(community.id).orFail();
  assert.equal(
    stored.members.filter((id) => String(id) === author.id).length,
    1,
  );
  await Promise.all(
    Array.from({ length: 5 }, () =>
      changeMembership(author.id, community.id, false),
    ),
  );
  stored = await Community.findById(community.id).orFail();
  assert.equal(
    stored.members.filter((id) => String(id) === author.id).length,
    0,
  );
  passed("Concurrent join/leave operations preserve unique membership");
  const owned = await createBlog(author.id, storyInput);
  await assert.rejects(
    () => updateBlog(other.id, owned.id, { title: "An unauthorized edit" }),
    { status: 403 },
  );
  await assert.rejects(() => deleteBlog(other.id, owned.id), { status: 403 });
  await assert.rejects(() => createBlog(author.id, storyInput), {
    code: 11000,
  });
  await deleteBlog(author.id, owned.id);
  passed("Ownership checks and unique slugs are enforced in MongoDB mutations");

  server = spawn(
    process.execPath,
    [
      path.resolve("node_modules/next/dist/bin/next"),
      "start",
      "-p",
      String(port),
    ],
    {
      cwd: process.cwd(),
      windowsHide: true,
      env: {
        ...process.env,
        NEXTAUTH_SECRET: secret,
        NEXTAUTH_URL: base,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout?.on("data", (chunk: Buffer) => {
    logs += chunk.toString();
  });
  server.stderr?.on("data", (chunk: Buffer) => {
    logs += chunk.toString();
  });
  await waitForServer();
  const token = await encode({
    token: { userId: author.id, name: author.name, email: author.email },
    secret,
    salt: "authjs.session-token",
    maxAge: 3600,
  });
  const cookie = `authjs.session-token=${token}`;
  const authenticatedHeaders = {
    Cookie: cookie,
    Origin: base,
    "Content-Type": "application/json",
  };
  // Seeded content is external to the initial build; exercise a real membership
  // mutation to invalidate the communities ISR snapshot before browser checks.
  for (const method of ["POST", "DELETE"]) {
    const response = await fetch(
      `${base}/api/communities/${community.id}/join`,
      {
        method,
        headers: authenticatedHeaders,
      },
    );
    assert.equal(response.status, 200);
  }
  for (const [route, method] of [
    ["/api/blogs", "POST"],
    [`/api/blogs/${community.id}`, "PATCH"],
    [`/api/blogs/${community.id}`, "DELETE"],
    ["/api/communities", "POST"],
    [`/api/communities/${community.id}/join`, "POST"],
    [`/api/communities/${community.id}/join`, "DELETE"],
    ["/api/me", "GET"],
  ]) {
    const response = await fetch(`${base}${route}`, { method });
    assert.equal(response.status, 401, `${method} ${route}`);
    assert.equal((await response.json()).error.code, "UNAUTHENTICATED");
  }
  passed(
    "Every protected API endpoint rejects unauthenticated requests with 401",
  );
  const invalid = await fetch(`${base}/api/blogs`, {
    method: "POST",
    headers: authenticatedHeaders,
    body: JSON.stringify({ ...storyInput, title: "x" }),
  });
  assert.equal(invalid.status, 400);
  const created = await fetch(`${base}/api/blogs`, {
    method: "POST",
    headers: authenticatedHeaders,
    body: JSON.stringify({ ...storyInput, published: false }),
  });
  assert.equal(created.status, 201, await created.clone().text());
  const { data: draft } = await created.json();
  assert.equal((await fetch(`${base}/api/blogs/${draft.id}`)).status, 404);
  assert.equal(
    (
      await fetch(`${base}/api/blogs/${draft.id}`, {
        headers: { Cookie: cookie },
      })
    ).status,
    200,
  );
  const publicFeed = await (await fetch(`${base}/api/blogs`)).json();
  assert.equal(
    publicFeed.data.some((item: { id: string }) => item.id === draft.id),
    false,
  );
  assert.equal(
    JSON.stringify(publicFeed).includes("@seed.techtalks.example"),
    false,
  );
  const wrongOrigin = await fetch(`${base}/api/blogs/${draft.id}`, {
    method: "PATCH",
    headers: {
      ...authenticatedHeaders,
      Origin: "https://another-origin.example",
    },
    body: JSON.stringify({ title: "A changed title" }),
  });
  assert.equal(wrongOrigin.status, 403);
  const otherToken = await encode({
    token: { userId: other.id },
    secret,
    salt: "authjs.session-token",
    maxAge: 3600,
  });
  const unauthorized = await fetch(`${base}/api/blogs/${draft.id}`, {
    method: "PATCH",
    headers: {
      ...authenticatedHeaders,
      Cookie: `authjs.session-token=${otherToken}`,
    },
    body: JSON.stringify({ title: "A changed title" }),
  });
  assert.equal(unauthorized.status, 403);
  assert.equal((await fetch(`${base}/api/blogs/not-an-id`)).status, 400);
  assert.equal(
    (
      await fetch(`${base}/api/blogs/${draft.id}`, {
        method: "DELETE",
        headers: authenticatedHeaders,
      })
    ).status,
    200,
  );
  // Invalidating mutations above ensure the production ISR pages pick up this test database.
  passed(
    "HTTP validation, draft privacy, private-field filtering, origin checks, and author permissions",
  );

  browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(base);
  await expect(
    page.getByRole("heading", { name: "Join a community of developers." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "The best React component is the one you don't notice",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue with Google" }),
  ).toHaveCount(0);
  await page.screenshot({
    path: path.join(artifacts, "home-desktop.png"),
    fullPage: true,
  });
  await page.goto(`${base}/blogs`);
  await expect(
    page.getByRole("heading", { name: "Stay curious. Keep building." }),
  ).toBeVisible();
  await page.getByLabel("Search stories").fill("TypeScript patterns");
  await expect(
    page.getByRole("heading", {
      name: "TypeScript patterns I keep coming back to",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "The best React component is the one you don't notice",
    }),
  ).toHaveCount(0);
  await page.getByLabel("Search stories").fill("");
  await page.screenshot({
    path: path.join(artifacts, "blogs-desktop.png"),
    fullPage: true,
  });
  await page
    .getByRole("heading", {
      name: "The best React component is the one you don't notice",
    })
    .getByRole("link")
    .click();
  await expect(
    page.getByRole("heading", { name: "Start with the next person" }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(artifacts, "article-desktop.png"),
    fullPage: true,
  });
  await page.goto(`${base}/communities`);
  await expect(
    page.getByRole("heading", { name: "Next.js Collective" }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(artifacts, "communities-desktop.png"),
    fullPage: true,
  });
  await page.goto(`${base}/communities/react`);
  await expect(
    page.getByRole("link", { name: "Log in to join" }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(artifacts, "community-desktop.png"),
    fullPage: true,
  });
  await page.goto(`${base}/profile`);
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  await expect(
    page.getByRole("button", { name: "Continue with Google" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue with GitHub" }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(artifacts, "login-desktop.png"),
    fullPage: true,
  });
  passed(
    "Public page navigation, article reading, search, login routing, and no automatic login UI",
  );

  // Test-only signed Auth.js JWT exercises the actual session verifier without adding a login bypass to the application.
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.goto(`${base}/profile`);
  await expect(
    page.getByRole("heading", { name: "Test Developer", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Your name").fill("Updated Developer");
  await page
    .getByLabel("A little about you")
    .fill("Building useful things and writing down what I learn.");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your profile is up to date.",
  );
  assert.equal(
    (await User.findById(author.id).orFail()).name,
    "Updated Developer",
  );
  await page.goto(`${base}/blogs/new`);
  await page
    .getByLabel("Story title", { exact: true })
    .fill("A story published through the editor");
  await page.getByLabel("A short introduction").fill(storyInput.excerpt);
  await page.getByLabel("Your story", { exact: true }).fill(storyInput.content);
  await page.getByLabel("Topics", { exact: true }).fill("react, typescript");
  await page
    .getByLabel("Story URL")
    .fill("the-best-react-component-is-the-one-you-dont-notice");
  await page
    .getByRole("button", { name: "Publish story", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "This slug is already in use" }),
  ).toBeVisible();
  await expect(page.getByLabel("A short introduction")).toHaveValue(
    storyInput.excerpt,
  );
  await expect(page.getByLabel("Topics", { exact: true })).toHaveValue(
    "react, typescript",
  );
  await page
    .getByLabel("Story URL")
    .fill("a-story-published-through-the-editor");
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await page.screenshot({
    path: path.join(artifacts, "editor-desktop.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Publish story", exact: true })
    .click();
  await expect(page).toHaveURL(
    /\/blogs\/a-story-published-through-the-editor$/,
  );
  const published = await Blog.findOne({
    slug: "a-story-published-through-the-editor",
  }).orFail();
  assert.equal(String(published.author), author.id);
  assert.equal(published.published, true);
  await page.goto(`${base}/communities/react`);
  await page
    .getByRole("button", { name: "Join community", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Joined · Leave community" }),
  ).toBeVisible();
  assert.equal(
    Boolean(await Community.exists({ _id: community.id, members: author.id })),
    true,
  );
  await page.goto(`${base}/profile`);
  await expect(
    page.getByRole("heading", { name: "Updated Developer", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(artifacts, "profile-desktop.png"),
    fullPage: true,
  });
  await page.goto(`${base}/communities/react`);
  await page.getByRole("button", { name: "Joined · Leave community" }).click();
  await expect(
    page.getByRole("button", { name: "Join community", exact: true }),
  ).toBeVisible();
  assert.equal(
    Boolean(await Community.exists({ _id: community.id, members: author.id })),
    false,
  );
  await page.goto(`${base}/communities/new`);
  await page.getByLabel("Community name").fill("Test Builders Circle");
  await page
    .getByLabel("What brings you together?")
    .fill(
      "A thoughtful space to test the complete community creation workflow.",
    );
  await page.getByLabel("Related topics").fill("react, c++, c#");
  await page.getByRole("button", { name: "Create community" }).click();
  await expect(page).toHaveURL(/\/communities\/test-builders-circle$/);
  assert.equal(
    Boolean(
      await Community.exists({
        slug: "test-builders-circle",
        createdBy: author.id,
        members: author.id,
      }),
    ),
    true,
  );
  await page.getByRole("link", { name: "c++", exact: true }).click();
  await expect(page).toHaveURL(`${base}/blogs?tag=c%2B%2B`);
  await expect(
    page.getByRole("button", { name: "c++", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto(`${base}/communities/test-builders-circle`);
  await page.getByRole("link", { name: "c#", exact: true }).click();
  await expect(page).toHaveURL(`${base}/blogs?tag=c%23`);
  passed(
    "Profile editing, Markdown preview, article publishing, community creation, join and leave persist through Server Actions",
  );

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
  ]) {
    await page.setViewportSize(viewport);
    for (const [route, label] of [
      ["/", "home"],
      ["/blogs", "blogs"],
      ["/blogs/the-best-react-component-is-the-one-you-dont-notice", "article"],
      ["/communities", "communities"],
      ["/communities/react", "community"],
      ["/profile", "profile"],
      ["/blogs/new", "editor"],
    ]) {
      await page.goto(`${base}${route}`);
      await page.locator("main h1").waitFor();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      await page.screenshot({
        path: path.join(artifacts, `${label}-${viewport.width}.png`),
        fullPage: true,
      });
      if (overflow)
        console.log(
          await page.evaluate(() =>
            [...document.querySelectorAll("main *")]
              .filter(
                (element) =>
                  element.getBoundingClientRect().right > window.innerWidth + 1,
              )
              .slice(0, 15)
              .map((element) => ({
                element: element.tagName,
                className: element.className,
                width: element.getBoundingClientRect().width,
                right: element.getBoundingClientRect().right,
              })),
          ),
        );
      assert.equal(
        overflow,
        false,
        `${route} overflows at ${viewport.width}px`,
      );
    }
    if (viewport.width < 760) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" }),
      ).toBeVisible();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "Communities", exact: true })
        .click();
      await expect(page).toHaveURL(`${base}/communities`);
    }
  }
  await page.goto(`${base}/blogs/${published.id}/edit`);
  await page
    .getByLabel("Story title", { exact: true })
    .fill("An updated story from the editor");
  await page
    .getByRole("checkbox", { name: /Publish to the community/ })
    .uncheck();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page).toHaveURL(`${base}/profile`);
  assert.equal((await Blog.findById(published.id).orFail()).published, false);
  assert.equal(
    (await Blog.findById(published.id).orFail()).title,
    "An updated story from the editor",
  );
  assert.equal((await fetch(`${base}/api/blogs/${published.id}`)).status, 404);
  await page.goto(`${base}/blogs/${published.id}/edit`);
  await expect(page.getByLabel("Story title", { exact: true })).toHaveValue(
    "An updated story from the editor",
  );
  await page
    .getByRole("checkbox", { name: /Publish to the community/ })
    .check();
  await page
    .getByRole("button", { name: "Save & publish", exact: true })
    .click();
  await expect(page).toHaveURL(
    /\/blogs\/a-story-published-through-the-editor$/,
  );
  await expect(
    page.getByRole("heading", {
      name: "An updated story from the editor",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto(`${base}/profile`);
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("button", { name: "Yes, delete", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your first story is waiting." }),
  ).toBeVisible();
  assert.equal(await Blog.exists({ _id: published.id }), null);
  passed(
    "Article edits, private drafts, republishing, and confirmed deletion persist through Server Actions",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(base + "/");
  await expect(
    page.getByRole("link", { name: "Login", exact: true }),
  ).toBeVisible();
  assert.equal((await context.request.get(`${base}/api/me`)).status(), 401);
  await page.goto(`${base}/profile`);
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  passed(
    "Sign out clears the session and protects the profile and private API again",
  );
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${base}/login`);
  await page.screenshot({
    path: path.join(artifacts, "login-tablet.png"),
    fullPage: true,
  });
  for (const route of [
    "/blogs/missing-story",
    "/communities/missing-community",
    "/missing-page",
  ]) {
    const response = await page.goto(`${base}${route}`);
    // Next.js sends 200 when loading UI has already started streaming, then
    // adds noindex for notFound(). Unmatched, non-streamed routes return 404.
    assert.ok([200, 404].includes(response?.status() || 0));
    await expect(
      page.getByRole("heading", { name: "This page went exploring." }),
    ).toBeVisible();
    assert.equal(
      await page
        .locator('meta[name="robots"]')
        .evaluateAll((elements) =>
          elements.some((element) =>
            element.getAttribute("content")?.includes("noindex"),
          ),
        ),
      true,
    );
    if (route === "/missing-page") assert.equal(response?.status(), 404);
  }
  assert.deepEqual(pageErrors, []);
  passed(
    "Mobile/tablet layouts, menu interaction, 404 states with noindex, and no browser runtime errors",
  );
  await writeFile(
    path.join(artifacts, "verification.json"),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        checks,
        oauth:
          "External provider round trips require real credentials; browser tests use test-only signed Auth.js session cookies.",
      },
      null,
      2,
    ),
  );
  console.log(
    `\n${checks.length} integration groups passed. Screenshots are in .artifacts/.`,
  );
}
run()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) {
      server.kill();
      await new Promise((resolve) => {
        if (server?.exitCode !== null) resolve(undefined);
        else {
          server?.once("exit", resolve);
          setTimeout(resolve, 5000);
        }
      });
    }
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
    await writeFile(path.join(artifacts, "integration-server.log"), logs);
  });
