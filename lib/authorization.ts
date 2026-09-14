import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./auth";
import { AppError } from "./errors";
export async function requireUserId() {
  const session = await getSession();
  if (!session?.user?.id)
    throw new AppError(401, "UNAUTHENTICATED", "Please log in to continue.");
  return session.user.id;
}
export async function requirePageSession(path: string) {
  const session = await getSession();
  if (!session?.user?.id)
    redirect(`/login?callbackUrl=${encodeURIComponent(path)}`);
  return session;
}
