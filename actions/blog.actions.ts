"use server";
import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/authorization";
import { createBlog, updateBlog, deleteBlog } from "@/lib/services";
import { actionError } from "@/lib/errors";
import { blogFormInput } from "@/lib/validations";
import { revalidateBlogs } from "@/lib/revalidation";
import type { ActionState } from "@/lib/types";
export async function createBlogAction(
  formData: FormData,
): Promise<ActionState> {
  let destination: string;
  try {
    const userId = await requireUserId();
    const blog = await createBlog(userId, blogFormInput(formData));
    revalidateBlogs(blog.slug);
    destination = blog.published ? `/blogs/${blog.slug}` : "/profile";
  } catch (error) {
    return actionError(error);
  }
  redirect(destination);
}
export async function updateBlogAction(
  id: string,
  formData: FormData,
): Promise<ActionState> {
  let destination: string;
  try {
    const userId = await requireUserId();
    const { blog, previousSlug } = await updateBlog(
      userId,
      id,
      blogFormInput(formData),
    );
    revalidateBlogs(previousSlug, blog.slug);
    destination = blog.published ? `/blogs/${blog.slug}` : "/profile";
  } catch (error) {
    return actionError(error);
  }
  redirect(destination);
}
export async function deleteBlogAction(id: string): Promise<ActionState> {
  try {
    const slug = await deleteBlog(await requireUserId(), id);
    revalidateBlogs(slug);
    return { success: true, message: "Story deleted." };
  } catch (error) {
    return actionError(error);
  }
}
