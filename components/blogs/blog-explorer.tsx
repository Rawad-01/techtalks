"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { BlogCard } from "./blog-card";
import { Button, EmptyState } from "@/components/ui";
import type { BlogDTO } from "@/lib/types";
export function BlogExplorer({ blogs }: { blogs: BlogDTO[] }) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string | null>(null);
  const tag = selected ?? searchParams.get("tag") ?? "all";
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(9);
  const tags = [...new Set(blogs.flatMap((blog) => blog.tags))].slice(0, 7);
  if (tag !== "all" && !tags.includes(tag)) tags.push(tag);
  const filtered = blogs.filter(
    (blog) =>
      (tag === "all" || blog.tags.includes(tag)) &&
      `${blog.title} ${blog.excerpt} ${blog.author.name} ${blog.tags.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const visible = filtered.slice(0, count);
  return (
    <>
      <div className="filter-bar">
        <div className="filter-tabs" aria-label="Filter by topic">
          {["all", ...tags].map((item) => (
            <button
              className={`filter-tab ${tag === item ? "active" : ""}`}
              key={item}
              aria-pressed={tag === item}
              onClick={() => {
                setSelected(item);
                setCount(9);
              }}
            >
              {item === "all" ? "All stories" : item}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={16} />
          <label className="sr-only" htmlFor="blog-search">
            Search stories
          </label>
          <input
            id="blog-search"
            placeholder="Search stories…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCount(9);
            }}
          />
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "STORY" : "STORIES"} TO
        EXPLORE
      </p>
      {!filtered.length ? (
        <EmptyState
          title={
            blogs.length
              ? "No stories match your search."
              : "No blogs published yet."
          }
          description={
            blogs.length
              ? "Try another topic or a different search. Your next good read is out there."
              : "Every community starts with a first story. Share something you've learned."
          }
          href={blogs.length ? undefined : "/blogs/new"}
          action="Write the first story"
        />
      ) : (
        <>
          <div className="editorial-grid">
            <BlogCard blog={visible[0]} />
            <div className="blog-list">
              {visible.slice(1, 4).map((blog) => (
                <BlogCard key={blog.id} blog={blog} compact />
              ))}
            </div>
          </div>
          {visible.length > 4 && (
            <div className="articles-grid">
              {visible.slice(4).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
          {count < filtered.length && (
            <div className="mt-8 text-center">
              <Button variant="secondary" onClick={() => setCount(count + 6)}>
                Load more stories
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
