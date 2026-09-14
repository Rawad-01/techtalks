"use server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/authorization";
import { updateProfile } from "@/lib/services";
import { actionError } from "@/lib/errors";
import { revalidateBlogs, revalidateCommunities } from "@/lib/revalidation";
import type { ActionState } from "@/lib/types";
export async function updateProfileAction(
  formData: FormData,
): Promise<ActionState> {
  try {
    await updateProfile(await requireUserId(), {
      name: formData.get("name"),
      bio: formData.get("bio"),
      githubUrl: formData.get("githubUrl"),
      portfolioUrl: formData.get("portfolioUrl"),
    });
    revalidateBlogs();
    revalidateCommunities();
    revalidatePath("/(public)/communities/[slug]", "page");
    return { success: true, message: "Your profile is up to date." };
  } catch (error) {
    return actionError(error);
  }
}
