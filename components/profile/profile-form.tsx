"use client";
import { useActionState, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { updateProfileAction } from "@/actions/profile.actions";
import { Button, Card, FormField } from "@/components/ui";
import type { ActionState, ProfileDTO } from "@/lib/types";
export function ProfileForm({ user }: { user: ProfileDTO }) {
  const [values, setValues] = useState({
    name: user.name,
    bio: user.bio,
    githubUrl: user.githubUrl,
    portfolioUrl: user.portfolioUrl,
  });
  const field = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setValues({ ...values, [key]: event.target.value }),
  });
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (_previous, formData) => updateProfileAction(formData),
    {},
  );
  const props = (name: string) => ({
    "aria-invalid": Boolean(state.errors?.[name]),
    "aria-describedby": state.errors?.[name] ? `${name}-error` : undefined,
  });
  return (
    <Card className="form-card">
      <form action={action} className="form-grid">
        <FormField label="Your name" name="name" errors={state.errors?.name}>
          <input
            name="name"
            id="name"
            required
            autoComplete="name"
            {...field("name")}
            maxLength={80}
            {...props("name")}
          />
        </FormField>
        <FormField
          label="A little about you"
          name="bio"
          errors={state.errors?.bio}
          hint="What do you build? What are you curious about? Up to 500 characters."
        >
          <textarea
            name="bio"
            id="bio"
            {...field("bio")}
            maxLength={500}
            placeholder="Developer, perpetual learner, and…"
            {...props("bio")}
          />
        </FormField>
        <div className="form-row">
          <FormField
            label="GitHub profile"
            name="githubUrl"
            errors={state.errors?.githubUrl}
          >
            <input
              name="githubUrl"
              id="githubUrl"
              type="url"
              placeholder="https://github.com/you"
              {...field("githubUrl")}
              {...props("githubUrl")}
            />
          </FormField>
          <FormField
            label="Portfolio or website"
            name="portfolioUrl"
            errors={state.errors?.portfolioUrl}
          >
            <input
              name="portfolioUrl"
              id="portfolioUrl"
              type="url"
              placeholder="https://your-website.com"
              {...field("portfolioUrl")}
              {...props("portfolioUrl")}
            />
          </FormField>
        </div>
        {state.message && (
          <p
            className={`notice ${state.success ? "notice-success" : "notice-error"}`}
            role={state.success ? "status" : "alert"}
          >
            {state.message}
          </p>
        )}
        <div className="form-actions">
          <span className="field-hint">Your email is always private.</span>
          <Button disabled={pending}>
            {pending ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
