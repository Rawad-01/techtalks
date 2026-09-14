import type { NextRequest } from "next/server";
import { changeMembership } from "@/lib/services";
import { requireUserId } from "@/lib/authorization";
import { apiError, assertSameOrigin, jsonData } from "@/lib/api";
import { revalidateCommunities } from "@/lib/revalidation";
type Context = { params: Promise<{ id: string }> };
async function change(request: NextRequest, context: Context, join: boolean) {
  try {
    const userId = await requireUserId();
    assertSameOrigin(request);
    const result = await changeMembership(
      userId,
      (await context.params).id,
      join,
    );
    revalidateCommunities(result.slug);
    return jsonData(result);
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: NextRequest, context: Context) {
  return change(request, context, true);
}
export async function DELETE(request: NextRequest, context: Context) {
  return change(request, context, false);
}
