"use client";
import { useActionState, useState } from "react";
import { ArrowUpRight, Eye, LoaderCircle, PenLine } from "lucide-react";
import { createBlogAction, updateBlogAction } from "@/actions/blog.actions";
import { Button, ButtonLink, Card, FormField } from "@/components/ui";
import { Markdown } from "./markdown";
import { slugify } from "@/lib/utils";
import type { ActionState, BlogDTO } from "@/lib/types";
export function BlogForm({ blog }: { blog?: BlogDTO }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (_previous, formData) =>
      blog ? updateBlogAction(blog.id, formData) : createBlogAction(formData),
    {},
  );
  const [title, setTitle] = useState(blog?.title || "");
  const [slug, setSlug] = useState(blog?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(blog));
  const [content, setContent] = useState(blog?.content || "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "");
  const [tags, setTags] = useState(blog?.tags.join(", ") || "");
  const [preview, setPreview] = useState(false);
  const [published, setPublished] = useState(blog?.published ?? true);
  const errorProps = (name: string) => ({
    "aria-invalid": Boolean(state.errors?.[name]),
    "aria-describedby": `${name}-hint${state.errors?.[name] ? ` ${name}-error` : ""}`,
  });
  return (
    <form action={action}>
      <Card className="form-card">
        <div className="editor-toolbar">
          <Button
            type="button"
            variant={preview ? "ghost" : "secondary"}
            aria-pressed={!preview}
            onClick={() => setPreview(false)}
          >
            <PenLine size={14} />
            Write
          </Button>
          <Button
            type="button"
            variant={preview ? "secondary" : "ghost"}
            aria-pressed={preview}
            onClick={() => setPreview(true)}
          >
            <Eye size={14} />
            Preview
          </Button>
        </div>
        <div className="form-grid">
          <FormField
            label="Story title"
            name="title"
            hint="A clear title gives a good idea somewhere to land."
            errors={state.errors?.title}
          >
            <input
              id="title"
              name="title"
              required
              maxLength={160}
              value={title}
              placeholder="What have you been thinking about?"
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              {...errorProps("title")}
            />
          </FormField>
          <FormField
            label="Story URL"
            name="slug"
            hint="Lowercase letters, numbers, and hyphens. Make it memorable."
            errors={state.errors?.slug}
          >
            <input
              id="slug"
              name="slug"
              required
              value={slug}
              placeholder="your-story-starts-here"
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              {...errorProps("slug")}
            />
          </FormField>
          <FormField
            label="A short introduction"
            name="excerpt"
            hint="20–320 characters. Give readers a reason to lean in."
            errors={state.errors?.excerpt}
          >
            <textarea
              id="excerpt"
              name="excerpt"
              required
              maxLength={320}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="The question, discovery, or lesson behind your story…"
              {...errorProps("excerpt")}
            />
          </FormField>
          <FormField
            label="Your story"
            name="content"
            hint="Markdown supported: ## headings, **bold**, links, lists, and fenced code blocks. Minimum 100 characters."
            errors={state.errors?.content}
          >
            <textarea
              id="content"
              name="content"
              required={!preview}
              hidden={preview}
              className="editor-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={
                "Start with something worth sharing.\n\n## What I learned\n\nYour story goes here…"
              }
              {...errorProps("content")}
            />
            {preview && (
              <div className="editor-preview">
                {content ? (
                  <Markdown content={content} />
                ) : (
                  <p className="text-sm text-muted">
                    Your story preview will appear here.
                  </p>
                )}
              </div>
            )}
          </FormField>
          <FormField
            label="Topics"
            name="tags"
            hint="Up to 5 tags, separated by commas. Example: react, typescript, frontend"
            errors={state.errors?.tags}
          >
            <input
              id="tags"
              name="tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="react, typescript, frontend"
              {...errorProps("tags")}
            />
          </FormField>
          <label className="checkbox-field">
            <input
              type="checkbox"
              name="published"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            <span>
              Publish to the community
              <span className="field-hint block">
                Uncheck to keep this story as a private draft.
              </span>
            </span>
          </label>
          {state.message && (
            <p className="notice notice-error" role="alert">
              {state.message}
            </p>
          )}
          <div className="form-actions">
            <ButtonLink href="/profile" variant="ghost">
              Cancel
            </ButtonLink>
            <Button disabled={pending}>
              {pending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <ArrowUpRight size={16} />
              )}
              {pending
                ? "Saving your story…"
                : published
                  ? blog
                    ? "Save & publish"
                    : "Publish story"
                  : "Save draft"}
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
