"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { CommunityCard } from "./community-card";
import { EmptyState } from "@/components/ui";
import type { CommunityDTO } from "@/lib/types";
export function CommunityExplorer({
  communities,
}: {
  communities: CommunityDTO[];
}) {
  const [category, setCategory] = useState("All communities");
  const [search, setSearch] = useState("");
  const categories = [
    "All communities",
    ...new Set(communities.map((community) => community.category)),
  ];
  const filtered = communities.filter(
    (community) =>
      (category === "All communities" || community.category === category) &&
      `${community.name} ${community.description} ${community.tags.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="filter-bar">
        <div className="filter-tabs" aria-label="Filter communities">
          {categories.map((item) => (
            <button
              className={`filter-tab ${category === item ? "active" : ""}`}
              aria-pressed={category === item}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={16} />
          <label htmlFor="community-search" className="sr-only">
            Search communities
          </label>
          <input
            id="community-search"
            placeholder="Find your people…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "COMMUNITY" : "COMMUNITIES"}{" "}
        TO CALL HOME
      </p>
      <div className="community-grid">
        {filtered.length ? (
          filtered.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))
        ) : (
          <EmptyState
            title={
              communities.length
                ? "Your people might be one search away."
                : "A space for something new."
            }
            description={
              communities.length
                ? "Try a broader search or a different category."
                : "No communities yet. Start a thoughtful space around something you love."
            }
            href={communities.length ? undefined : "/communities/new"}
            action="Start a community"
          />
        )}
      </div>
    </>
  );
}
