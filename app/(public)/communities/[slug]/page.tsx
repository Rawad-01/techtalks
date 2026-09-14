import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import {
  Avatar,
  Badge,
  Card,
  Container,
  EmptyState,
  SectionHeader,
} from "@/components/ui";
import { CommunitySymbol } from "@/components/communities/community-card";
import { MembershipButton } from "@/components/communities/membership-button";
import { BlogCard } from "@/components/blogs/blog-card";
import {
  getCommunityBySlug,
  getCommunityMembers,
  getRelatedBlogs,
  isMember,
} from "@/lib/data";
import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const community = await getCommunityBySlug((await params).slug);
  return community
    ? {
        title: community.name,
        description: community.description.slice(0, 160),
      }
    : { title: "Community not found" };
}
export default async function CommunityPage({ params }: Props) {
  const community = await getCommunityBySlug((await params).slug);
  if (!community) notFound();
  const session = await getSession();
  const [blogs, members, joined] = await Promise.all([
    getRelatedBlogs(community.tags),
    getCommunityMembers(community.id),
    session?.user ? isMember(community.id, session.user.id) : false,
  ]);
  return (
    <Container className="page-shell">
      <Link className="back-link" href="/communities">
        <ArrowLeft size={14} />
        All communities
      </Link>
      <header className="hub-banner">
        <div className="hub-identity">
          <CommunitySymbol
            category={community.category}
            name={community.name}
            large
          />
          <div>
            <p className="eyebrow">{community.category} community</p>
            <h1>{community.name}</h1>
            <span className="member-count">
              <Users size={14} />
              {community.memberCount}{" "}
              {community.memberCount === 1 ? "curious mind" : "curious minds"}
            </span>
          </div>
        </div>
        <MembershipButton
          communityId={community.id}
          slug={community.slug}
          joined={joined}
          authenticated={Boolean(session?.user)}
        />
      </header>
      <div className="hub-layout">
        <div>
          <section className="hub-about">
            <h2>A space for shared curiosity.</h2>
            <p>{community.description}</p>
          </section>
          <section>
            <SectionHeader
              label="From the community journal"
              title="Ideas to get you thinking."
            />
            {blogs.length ? (
              <div className="blog-list">
                {blogs.map((blog) => (
                  <BlogCard blog={blog} key={blog.id} compact />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Every conversation starts somewhere."
                description="Share your perspective on this topic. A story with a matching community tag will appear here."
                href="/blogs/new"
                action="Write a story"
              />
            )}
          </section>
        </div>
        <aside>
          <Card className="sidebar-card">
            <h2>In good company</h2>
            <span className="member-count">
              <Users size={15} />
              {community.memberCount} members
            </span>
            <p>A place to ask questions, exchange ideas, and learn together.</p>
            <div className="member-stack">
              {members.map((member) => (
                <Avatar
                  key={member.id}
                  name={member.name}
                  image={member.image}
                  size="md"
                />
              ))}
            </div>
            <div className="tags">
              {community.tags.map((tag) => (
                <Link key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}>
                  <Badge>{tag}</Badge>
                </Link>
              ))}
            </div>
          </Card>
          <Card className="sidebar-card">
            <h2>A few shared values</h2>
            <ul className="community-guidelines">
              <li>Be kind. We&apos;re all learning.</li>
              <li>Give context, share your sources.</li>
              <li>Welcome different perspectives.</li>
              <li>Make space for the next person.</li>
            </ul>
          </Card>
          <Card className="sidebar-card">
            <p className="eyebrow">Started by</p>
            <div className="flex items-center gap-3">
              <Avatar
                name={community.createdBy.name}
                image={community.createdBy.image}
              />
              <span className="text-sm">{community.createdBy.name}</span>
            </div>
            <p className="mt-4">
              Growing together since {formatDate(community.createdAt)}.
            </p>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
