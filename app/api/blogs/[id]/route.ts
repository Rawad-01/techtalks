import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Blog } from "@/models/Blog";
import { User } from "@/models/User";
import { objectIdSchema } from "@/lib/validations";
import { serializeBlog, type PopulatedAuthor } from "@/lib/serializers";
import { deleteBlog, updateBlog } from "@/lib/services";
import { AppError } from "@/lib/errors";
import { requireUserId } from "@/lib/authorization";
import { apiError, assertSameOrigin, jsonData, readJson } from "@/lib/api";
import { revalidateBlogs } from "@/lib/revalidation";
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const id = objectIdSchema.parse((await params).id);
    await connectDB();
    // Register the referenced model before population in an isolated route bundle.
    void User;
    const blog = await Blog.findById(id)
      .populate<{ author: PopulatedAuthor }>("author", "name image bio")
      .lean();
    if (!blog)
      throw new AppError(404, "NOT_FOUND", "That story could not be found.");
    if (!blog.published) {
      const session = await getSession();
      if (!session?.user || String(blog.author?._id) !== session.user.id)
        throw new AppError(404, "NOT_FOUND", "That story could not be found.");
    }
    return jsonData(serializeBlog(blog));
  } catch (error) {
    return apiError(error);
  }
}
export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const userId = await requireUserId();
    assertSameOrigin(request);
    const { blog, previousSlug } = await updateBlog(
      userId,
      (await params).id,
      await readJson(request),
    );
    revalidateBlogs(previousSlug, blog.slug);
    return jsonData({
      id: blog.id,
      slug: blog.slug,
      published: blog.published,
    });
  } catch (error) {
    return apiError(error);
  }
}
export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const userId = await requireUserId();
    assertSameOrigin(request);
    const slug = await deleteBlog(userId, (await params).id);
    revalidateBlogs(slug);
    return jsonData({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
