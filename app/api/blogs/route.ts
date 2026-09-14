import type { NextRequest } from "next/server";
import { getBlogs } from "@/lib/data";
import { createBlog } from "@/lib/services";
import { requireUserId } from "@/lib/authorization";
import { apiError, assertSameOrigin, jsonData, readJson } from "@/lib/api";
import { revalidateBlogs } from "@/lib/revalidation";
export async function GET() {
  try {
    return jsonData(await getBlogs());
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    assertSameOrigin(request);
    const blog = await createBlog(userId, await readJson(request));
    revalidateBlogs(blog.slug);
    return jsonData(
      { id: blog.id, slug: blog.slug, published: blog.published },
      201,
    );
  } catch (error) {
    return apiError(error);
  }
}
