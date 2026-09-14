"use server";
import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/authorization";
import { changeMembership, createCommunity } from "@/lib/services";
import { actionError } from "@/lib/errors";
import { revalidateCommunities } from "@/lib/revalidation";
import type { ActionState } from "@/lib/types";
async function membershipAction(
  communityId: string,
  join: boolean,
): Promise<ActionState> {
  try {
    const community = await changeMembership(
      await requireUserId(),
      communityId,
      join,
    );
    revalidateCommunities(community.slug);
    return {
      success: true,
      message: join
        ? "You're in. Welcome to the community!"
        : "You've left this community. You're welcome back anytime.",
    };
  } catch (error) {
    return actionError(error);
  }
}
export async function joinCommunityAction(communityId: string) {
  return membershipAction(communityId, true);
}
export async function leaveCommunityAction(communityId: string) {
  return membershipAction(communityId, false);
}
export async function createCommunityAction(
  formData: FormData,
): Promise<ActionState> {
  let slug: string;
  try {
    const community = await createCommunity(await requireUserId(), {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      category: formData.get("category"),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    slug = community.slug;
    revalidateCommunities(slug);
  } catch (error) {
    return actionError(error);
  }
  redirect(`/communities/${slug}`);
}
