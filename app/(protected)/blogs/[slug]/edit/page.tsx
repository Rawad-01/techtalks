import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePageSession } from "@/lib/authorization";
import { getOwnedBlog } from "@/lib/data";
import { Container, PageHeader } from "@/components/ui";
import { BlogForm } from "@/components/blogs/blog-form";
export const metadata: Metadata = { title: "Edit your story" };
export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  const session = await requirePageSession(`/blogs/${id}/edit`);
  const blog = await getOwnedBlog(id, session.user.id);
  if (!blog) notFound();
  return (
    <Container className="page-shell max-w-4xl">
      <PageHeader
        eyebrow="Great stories keep growing"
        title="A fresh perspective."
        description="Refine your words, update your discoveries, and keep the conversation going."
      />
      <BlogForm blog={blog} />
    </Container>
  );
}
