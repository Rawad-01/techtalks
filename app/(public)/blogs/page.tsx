import type { Metadata } from "next";
import { Suspense } from "react";
import { PenLine } from "lucide-react";
import {
  ButtonLink,
  Container,
  LoadingSkeleton,
  PageHeader,
} from "@/components/ui";
import { BlogExplorer } from "@/components/blogs/blog-explorer";
import { getBlogs } from "@/lib/data";
export const revalidate = 60;
export const metadata: Metadata = {
  title: "Stories for curious developers",
  description:
    "Thoughtful tutorials, fresh perspectives, and lessons from developers who build.",
};
export default async function BlogsPage() {
  const blogs = await getBlogs();
  return (
    <Container className="page-shell">
      <PageHeader
        eyebrow="The community journal"
        title="Stay curious. Keep building."
        description="Fresh perspectives, practical guides, and a few things we learned the hard way. Written by developers, for developers."
      >
        <ButtonLink href="/blogs/new">
          <PenLine size={16} />
          Write a story
        </ButtonLink>
      </PageHeader>
      <Suspense fallback={<LoadingSkeleton />}>
        <BlogExplorer blogs={blogs} />
      </Suspense>
    </Container>
  );
}
