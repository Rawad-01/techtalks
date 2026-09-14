import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Card } from "@/components/ui";
import type { CommunityDTO } from "@/lib/types";
export function CommunitySymbol({
  category,
  name,
  large = false,
}: {
  category: string;
  name: string;
  large?: boolean;
}) {
  const symbol = /react/i.test(name)
    ? "⚛"
    : /next/i.test(name)
      ? "N"
      : category === "Backend"
        ? "{ }"
        : category === "Design"
          ? "◇"
          : category === "AI & ML"
            ? "✳"
            : category === "Mobile"
              ? "▣"
              : "</>";
  return (
    <span
      className={`community-symbol ${large ? "large" : ""}`}
      aria-hidden="true"
    >
      {symbol}
    </span>
  );
}
export function CommunityCard({ community }: { community: CommunityDTO }) {
  return (
    <Card variant="interactive" className="community-card">
      <div className="community-card-top">
        <CommunitySymbol category={community.category} name={community.name} />
        <span className="community-category">{community.category}</span>
      </div>
      <h3>
        <Link href={`/communities/${community.slug}`}>{community.name}</Link>
      </h3>
      <p>
        {community.description.length > 135
          ? `${community.description.slice(0, 132)}…`
          : community.description}
      </p>
      <div className="community-card-bottom">
        <span className="member-count">
          <Users size={13} />
          {community.memberCount.toLocaleString("en-US")}{" "}
          {community.memberCount === 1 ? "member" : "members"}
        </span>
        <Link
          href={`/communities/${community.slug}`}
          aria-label={`Explore ${community.name}`}
        >
          Explore
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </Card>
  );
}
