import Link from "next/link";
import { Avatar, Badge, Card } from "@/components/ui";
import { formatDate, readingTime } from "@/lib/utils";
import type { BlogDTO } from "@/lib/types";
export function ArticleArt({ tags, title }: { tags: string[]; title: string }) {
  const tag = tags[0] || "ideas";
  const tone = /backend|node|database|api/.test(tag)
    ? "1"
    : /design|ux|mobile/.test(tag)
      ? "2"
      : "0";
  const symbol = /react/.test(tag)
    ? "use(ideas)"
    : /next/.test(tag)
      ? "what's next?"
      : /type/.test(tag)
        ? "type Ideas<T>"
        : /design|ux/.test(tag)
          ? "think → make"
          : /ai/.test(tag)
            ? "human + AI"
            : "{ build: true }";
  return (
    <div className="article-art" data-tone={tone} aria-hidden="true">
      <span className="article-art-label">TechTalks / {tag}</span>
      <span className="article-art-code">{symbol}</span>
      <span className="article-art-num">
        {String(title.length).padStart(3, "0")} — FIELD NOTES
      </span>
    </div>
  );
}
export function BlogMeta({ blog }: { blog: BlogDTO }) {
  return (
    <div className="blog-meta">
      <Avatar name={blog.author.name} image={blog.author.image} />
      <strong>{blog.author.name}</strong>
      <span className="meta-separator">·</span>
      <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
      <span className="meta-separator">·</span>
      <span>{readingTime(blog.content)} min</span>
    </div>
  );
}
export function BlogCard({
  blog,
  compact = false,
}: {
  blog: BlogDTO;
  compact?: boolean;
}) {
  const content = (
    <>
      <div className="tags">
        {blog.tags.slice(0, 3).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <h3>
        <Link className="blog-title-link" href={`/blogs/${blog.slug}`}>
          {blog.title}
        </Link>
      </h3>
      {!compact && <p className="blog-excerpt">{blog.excerpt}</p>}
      <BlogMeta blog={blog} />
    </>
  );
  return compact ? (
    <article className="compact-blog">{content}</article>
  ) : (
    <Card className="featured-blog">
      <Link href={`/blogs/${blog.slug}`} tabIndex={-1} aria-hidden="true">
        <ArticleArt tags={blog.tags} title={blog.title} />
      </Link>
      <article className="blog-card-body">{content}</article>
    </Card>
  );
}
