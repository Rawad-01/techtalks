import { getProfile } from "@/lib/data";
import { requireUserId } from "@/lib/authorization";
import { apiError, jsonData } from "@/lib/api";
import { AppError } from "@/lib/errors";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const profile = await getProfile(await requireUserId());
    if (!profile)
      throw new AppError(404, "NOT_FOUND", "Your profile could not be found.");
    return jsonData(profile);
  } catch (error) {
    return apiError(error);
  }
}
