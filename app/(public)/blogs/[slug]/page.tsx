import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Avatar, Badge, Container, SectionHeader } from "@/components/ui";
import { ArticleArt, BlogCard } from "@/components/blogs/blog-card";
import { Markdown } from "@/components/blogs/markdown";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/data";
import { formatDate, readingTime } from "@/lib/utils";
export const revalidate = 60;
export function generateStaticParams() {
  return [];
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug((await params).slug);
  return blog
    ? {
        title: blog.title,
        description: blog.excerpt,
        openGraph: {
          type: "article",
          title: blog.title,
          description: blog.excerpt,
          publishedTime: blog.createdAt,
          modifiedTime: blog.updatedAt,
          authors: [blog.author.name],
        },
      }
    : { title: "Story not found" };
}
export default async function BlogPage({ params }: Props) {
  const blog = await getBlogBySlug((await params).slug);
  if (!blog) notFound();
  const related = await getRelatedBlogs(blog.tags, blog.id);
  return (
    <Container className="page-shell">
      <div className="article-header">
        <Link className="back-link" href="/blogs">
          <ArrowLeft size={14} />
          Back to the journal
        </Link>
        <div className="tags">
          {blog.tags.map((tag) => (
            <Link key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}>
              <Badge>{tag}</Badge>
            </Link>
          ))}
        </div>
        <h1>{blog.title}</h1>
        <p className="article-deck">{blog.excerpt}</p>
        <div className="article-byline">
          <Avatar name={blog.author.name} image={blog.author.image} size="md" />
          <div>
            <strong>{blog.author.name}</strong>
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
          </div>
          <span className="reading">
            <Clock size={14} />
            {readingTime(blog.content)} min read
          </span>
        </div>
      </div>
      <div className="article-banner">
        <ArticleArt title={blog.title} tags={blog.tags} />
      </div>
      <article>
        <Markdown content={blog.content} />
      </article>
      <div className="author-box">
        <Avatar name={blog.author.name} image={blog.author.image} size="md" />
        <div>
          <p className="eyebrow">Words by</p>
          <h3>{blog.author.name}</h3>
          <p>
            {blog.author.bio || "A curious mind in the TechTalks community."}
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <section className="section">
          <SectionHeader
            label="Keep the curiosity going"
            title="A little more food for thought."
          />
          <div className="articles-grid">
            {related.map((item) => (
              <BlogCard blog={item} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
