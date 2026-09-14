import type { Metadata } from "next";
import { requirePageSession } from "@/lib/authorization";
import { Container, PageHeader, Card } from "@/components/ui";
import { BlogForm } from "@/components/blogs/blog-form";
export const metadata: Metadata = { title: "Write a story" };
export default async function NewBlogPage() {
  await requirePageSession("/blogs/new");
  return (
    <Container className="page-shell">
      <PageHeader
        eyebrow="Something worth sharing"
        title="Your story starts here."
        description="A useful lesson. A different perspective. An idea you can't shake. Put it into words."
      />
      <div className="editor-layout">
        <div className="editor-main">
          <BlogForm />
        </div>
        <aside>
          <Card className="sidebar-card">
            <p className="eyebrow">A note from us</p>
            <h2>Write like yourself.</h2>
            <p>
              The best stories sound like a conversation with someone who cares.
              Be specific, share what worked, and don&apos;t skip what
              didn&apos;t.
            </p>
            <p className="mt-4">
              Use Markdown for headings, lists, links, and code. Preview your
              story before publishing.
            </p>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
