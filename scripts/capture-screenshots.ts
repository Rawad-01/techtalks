import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";

// Capture real rendered pages. This script never creates users or session cookies.
const base = new URL(process.argv[2] || "http://localhost:3000").origin;
const captureProfile = process.argv.includes("--profile");
const directory = path.resolve("docs/screenshots");

async function run() {
  await mkdir(directory, { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: !captureProfile,
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.name));

    if (captureProfile) {
      console.log(
        "In the Chrome window, sign in with your own account. Capture waits up to five minutes for /profile.",
      );
      await page.goto(`${base}/login?callbackUrl=%2Fprofile`);
      await page.waitForURL(`${base}/profile`, { timeout: 300000 });
      await expect(page.locator("main h1")).toBeVisible();
      const me = await context.request.get(`${base}/api/me`);
      assert.equal(me.status(), 200, "A real signed-in session is required.");
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: path.join(directory, "profile.png"),
        fullPage: true,
        animations: "disabled",
        // The profile's private email is deliberately masked in a public portfolio image.
        mask: [page.locator(".profile-details > div").first()],
        maskColor: "#efedf8",
      });
      console.log(
        "Saved docs/screenshots/profile.png from your real session; private email masked.",
      );
    } else {
      const blogsResponse = await context.request.get(`${base}/api/blogs`);
      const communitiesResponse = await context.request.get(
        `${base}/api/communities`,
      );
      assert.equal(blogsResponse.status(), 200);
      assert.equal(communitiesResponse.status(), 200);
      const blogs = (await blogsResponse.json()).data as {
        slug: string;
        title: string;
        content: string;
      }[];
      const communities = (await communitiesResponse.json()).data as {
        slug: string;
        name: string;
      }[];
      assert.ok(
        blogs.length && communities.length,
        "Seed the database before capturing the public demo.",
      );
      // Show a real article with Markdown sections so the capture demonstrates the reader.
      const article =
        blogs.find((blog) => /^## /m.test(blog.content)) || blogs[0];
      const captures = [
        {
          route: "/",
          file: "home",
          heading: "Join a community of developers.",
        },
        { route: "/login", file: "login", heading: "Make yourself at home." },
        {
          route: "/blogs",
          file: "blogs",
          heading: "Stay curious. Keep building.",
        },
        {
          route: `/blogs/${article.slug}`,
          file: "blog-details",
          heading: article.title,
        },
        {
          route: "/communities",
          file: "communities",
          heading: "Find your kind of people.",
        },
        {
          route: `/communities/${communities[0].slug}`,
          file: "community-details",
          heading: communities[0].name,
        },
      ];
      for (const capture of captures) {
        const response = await page.goto(`${base}${capture.route}`);
        assert.equal(
          response?.status(),
          200,
          `${capture.route} must load successfully.`,
        );
        await expect(
          page.getByRole("heading", { name: capture.heading, exact: true }),
        ).toBeVisible();
        await expect(
          page.getByRole("link", { name: "Login", exact: true }),
        ).toBeVisible();
        if (capture.file === "login") {
          await expect(
            page.getByRole("button", { name: "Continue with Google" }),
          ).toBeEnabled();
          await expect(
            page.getByRole("button", { name: "Continue with GitHub" }),
          ).toBeEnabled();
        }
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.images].map((image) =>
              image.decode().catch(() => undefined),
            ),
          );
        });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          ),
          false,
        );
        await page.screenshot({
          path: path.join(directory, `${capture.file}.png`),
          fullPage: true,
          animations: "disabled",
        });
        console.log(`Saved docs/screenshots/${capture.file}.png`);
      }
    }
    assert.deepEqual(
      errors,
      [],
      "Screenshots must not contain a browser runtime failure.",
    );
  } finally {
    await browser.close();
  }
}
run().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Screenshot capture failed.",
  );
  process.exitCode = 1;
});
