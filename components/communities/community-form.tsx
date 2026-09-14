"use client";
import { useActionState, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { createCommunityAction } from "@/actions/community.actions";
import { Button, ButtonLink, Card, FormField } from "@/components/ui";
import { categories } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ActionState } from "@/lib/types";
export function CommunityForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (_previous, data) => createCommunityAction(data),
    {},
  );
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const props = (name: string) => ({
    "aria-invalid": Boolean(state.errors?.[name]),
    "aria-describedby": state.errors?.[name] ? `${name}-error` : undefined,
  });
  return (
    <Card className="form-card">
      <form action={action} className="form-grid">
        <FormField
          label="Community name"
          name="name"
          errors={state.errors?.name}
        >
          <input
            name="name"
            id="name"
            required
            maxLength={80}
            value={name}
            placeholder="A name your people will recognize"
            onChange={(event) => {
              setName(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            {...props("name")}
          />
        </FormField>
        <FormField
          label="Community URL"
          name="slug"
          errors={state.errors?.slug}
        >
          <input
            name="slug"
            id="slug"
            required
            value={slug}
            placeholder="your-community"
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            {...props("slug")}
          />
        </FormField>
        <FormField
          label="What brings you together?"
          name="description"
          errors={state.errors?.description}
          hint="At least 30 characters. Tell people what this space is for and who it's for."
        >
          <textarea
            name="description"
            id="description"
            required
            maxLength={3000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="A space for developers who…"
            {...props("description")}
          />
        </FormField>
        <FormField
          label="Category"
          name="category"
          errors={state.errors?.category}
        >
          <select
            name="category"
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            {...props("category")}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Related topics"
          name="tags"
          errors={state.errors?.tags}
          hint="Up to 5 comma-separated tags. Stories with these tags appear in your community."
        >
          <input
            name="tags"
            id="tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="react, frontend, typescript"
            {...props("tags")}
          />
        </FormField>
        {state.message && (
          <p role="alert" className="notice notice-error">
            {state.message}
          </p>
        )}
        <div className="form-actions">
          <ButtonLink href="/communities" variant="ghost">
            Cancel
          </ButtonLink>
          <Button disabled={pending}>
            {pending ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <ArrowUpRight size={16} />
            )}
            {pending ? "Creating…" : "Create community"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
