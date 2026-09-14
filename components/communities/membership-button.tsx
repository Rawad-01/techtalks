"use client";
import { useActionState } from "react";
import { Check, LoaderCircle, Plus } from "lucide-react";
import {
  joinCommunityAction,
  leaveCommunityAction,
} from "@/actions/community.actions";
import { Button, ButtonLink } from "@/components/ui";
import type { ActionState } from "@/lib/types";
export function MembershipButton({
  communityId,
  slug,
  joined,
  authenticated,
}: {
  communityId: string;
  slug: string;
  joined: boolean;
  authenticated: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async () =>
      joined
        ? leaveCommunityAction(communityId)
        : joinCommunityAction(communityId),
    {},
  );
  if (!authenticated)
    return (
      <ButtonLink
        href={`/login?callbackUrl=${encodeURIComponent(`/communities/${slug}`)}`}
      >
        <Plus size={15} />
        Log in to join
      </ButtonLink>
    );
  return (
    <div className="max-w-72">
      <form action={action}>
        <Button variant={joined ? "secondary" : "primary"} disabled={pending}>
          {pending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : joined ? (
            <Check size={16} />
          ) : (
            <Plus size={16} />
          )}
          {pending
            ? "Updating…"
            : joined
              ? "Joined · Leave community"
              : "Join community"}
        </Button>
      </form>
      {state.message && (
        <p
          className={`mt-3 text-xs ${state.success ? "text-muted" : "text-red-700"}`}
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
