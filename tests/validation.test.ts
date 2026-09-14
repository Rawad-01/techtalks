import test from "node:test";
import assert from "node:assert/strict";
import {
  blogSchema,
  blogUpdateSchema,
  communitySchema,
  objectIdSchema,
  profileSchema,
} from "../lib/validations";
import { safeRedirect, slugify } from "../lib/utils";
const validBlog = {
  title: "A useful technical story",
  slug: "a-useful-technical-story",
  excerpt: "A clear introduction to a useful lesson.",
  content:
    "A worthwhile paragraph about a technical problem and the lesson that came from investigating it. ".repeat(
      3,
    ),
  tags: ["React", "react", "typescript"],
  published: true,
};
test("blog input normalizes and deduplicates topics", () => {
  assert.deepEqual(blogSchema.parse(validBlog).tags, ["react", "typescript"]);
});
test("blog rejects reserved slugs, short content, excess tags, and injected ownership", () => {
  for (const input of [
    { ...validBlog, slug: "new" },
    { ...validBlog, content: "Short" },
    { ...validBlog, tags: Array(6).fill("react") },
    { ...validBlog, author: "000000000000000000000001" },
    { ...validBlog, published: "false" },
  ])
    assert.equal(blogSchema.safeParse(input).success, false);
});
test("patching a title doesn't publish an existing draft", () => {
  assert.deepEqual(blogUpdateSchema.parse({ title: "An updated title" }), {
    title: "An updated title",
  });
  assert.equal(blogUpdateSchema.safeParse({}).success, false);
});
test("profile accepts optional links and rejects unsafe protocols or identity changes", () => {
  assert.equal(
    profileSchema.safeParse({
      name: "Maya Chen",
      githubUrl: "https://github.com/maya",
      portfolioUrl: "https://example.com",
    }).success,
    true,
  );
  for (const input of [
    { name: "Maya", portfolioUrl: "javascript:alert(1)" },
    { name: "Maya", githubUrl: "https://github.com.evil.example/maya" },
    { name: "Maya", email: "other@example.com" },
  ])
    assert.equal(profileSchema.safeParse(input).success, false);
});
test("community and database identifiers validate before queries", () => {
  assert.equal(
    communitySchema.safeParse({
      name: "React",
      slug: "react",
      description: "A welcoming space for people building with React.",
      tags: ["react"],
      category: "Frontend",
    }).success,
    true,
  );
  for (const id of ["not-an-id", "123456789012", "{ $ne: null }"])
    assert.equal(objectIdSchema.safeParse(id).success, false);
});
test("redirects stay local and don't loop through authentication", () => {
  for (const path of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/login",
    "/api/auth/signin",
    "/a\nb",
  ])
    assert.equal(safeRedirect(path), "/profile");
  assert.equal(
    safeRedirect("/communities/react?from=login"),
    "/communities/react?from=login",
  );
  assert.equal(slugify("A Better React API!"), "a-better-react-api");
});
