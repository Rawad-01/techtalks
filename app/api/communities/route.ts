import type { NextRequest } from "next/server";
import { getCommunities } from "@/lib/data";
import { createCommunity } from "@/lib/services";
import { requireUserId } from "@/lib/authorization";
import { apiError, assertSameOrigin, jsonData, readJson } from "@/lib/api";
import { revalidateCommunities } from "@/lib/revalidation";
export async function GET() {
  try {
    return jsonData(await getCommunities());
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    assertSameOrigin(request);
    const community = await createCommunity(userId, await readJson(request));
    revalidateCommunities(community.slug);
    return jsonData({ id: community.id, slug: community.slug }, 201);
  } catch (error) {
    return apiError(error);
  }
}
