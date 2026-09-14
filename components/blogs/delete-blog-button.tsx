"use client";
import { useActionState, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteBlogAction } from "@/actions/blog.actions";
import { Button } from "@/components/ui";
import type { ActionState } from "@/lib/types";
export function DeleteBlogButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async () => deleteBlogAction(id),
    {},
  );
  return (
    <div>
      {confirm ? (
        <form action={action} className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Delete permanently?</span>
          <Button variant="destructive" disabled={pending}>
            {pending ? "Deleting…" : "Yes, delete"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setConfirm(false)}
            disabled={pending}
          >
            Keep story
          </Button>
        </form>
      ) : (
        <Button variant="ghost" onClick={() => setConfirm(true)}>
          <Trash2 size={13} />
          Delete
        </Button>
      )}
      {state.message && !state.success && (
        <p className="field-error" role="alert">
          {state.message}
        </p>
      )}
    </div>
  );
}
