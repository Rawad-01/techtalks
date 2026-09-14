import { z } from "zod";
export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid identifier.");
export const slugSchema = z
  .string()
  .trim()
  .min(3, "Use at least 3 characters.")
  .max(180)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens.",
  )
  .refine(
    (slug) => !["new", "edit", "api"].includes(slug),
    "This slug is reserved.",
  );
const tagsSchema = z
  .array(
    z
      .string()
      .trim()
      .toLowerCase()
      .min(1)
      .max(25)
      .regex(
        /^[a-z0-9][a-z0-9.+#-]*$/,
        "Tags can contain letters, numbers, dots, hyphens, +, or #.",
      ),
  )
  .max(5, "Use up to 5 tags.")
  .transform((tags) => [...new Set(tags)]);
export const blogSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Your title needs at least 5 characters.")
      .max(160, "Keep your title under 160 characters."),
    slug: slugSchema,
    excerpt: z
      .string()
      .trim()
      .min(20, "Add a summary of at least 20 characters.")
      .max(320, "Keep your summary under 320 characters."),
    content: z
      .string()
      .trim()
      .min(100, "Write at least 100 characters before saving.")
      .max(100000, "Your article is too long."),
    tags: tagsSchema,
    published: z.boolean().default(false),
  })
  .strict();
export const blogUpdateSchema = blogSchema
  .extend({ published: z.boolean() })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Include at least one field to update.",
  );
const optionalUrl = z
  .union([
    z.literal(""),
    z
      .url({
        protocol: /^https?$/,
        error: "Use a complete http:// or https:// URL.",
      })
      .max(300),
  ])
  .optional()
  .default("");
export const profileSchema = z
  .object({
    name: z.string().trim().min(2, "Use at least 2 characters.").max(80),
    bio: z
      .string()
      .trim()
      .max(500, "Keep your bio under 500 characters.")
      .optional()
      .default(""),
    githubUrl: optionalUrl.refine(
      (url) => !url || new URL(url).hostname === "github.com",
      "Use a github.com profile URL.",
    ),
    portfolioUrl: optionalUrl,
  })
  .strict();
export const categories = [
  "Frontend",
  "Backend",
  "Design",
  "AI & ML",
  "Mobile",
  "General",
] as const;
export const communitySchema = z
  .object({
    name: z.string().trim().min(3, "Use at least 3 characters.").max(80),
    slug: slugSchema,
    description: z
      .string()
      .trim()
      .min(30, "Tell the community's story in at least 30 characters.")
      .max(3000),
    category: z.enum(categories),
    tags: tagsSchema,
  })
  .strict();
export function blogFormInput(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    published: formData.get("published") === "on",
  };
}
