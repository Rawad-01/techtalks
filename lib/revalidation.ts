import "server-only";
import { revalidatePath } from "next/cache";
export function revalidateBlogs(...slugs: string[]) {
  for (const slug of new Set(slugs)) revalidatePath(`/blogs/${slug}`);
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/(public)/blogs/[slug]", "page");
  revalidatePath("/(public)/communities/[slug]", "page");
  revalidatePath("/profile");
}
export function revalidateCommunities(slug?: string) {
  revalidatePath("/");
  revalidatePath("/communities");
  if (slug) revalidatePath(`/communities/${slug}`);
  revalidatePath("/profile");
}
