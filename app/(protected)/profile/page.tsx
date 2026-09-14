import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Github, Globe, PenLine } from "lucide-react";
import { requirePageSession } from "@/lib/authorization";
import { getProfile } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import {
  Avatar,
  Badge,
  ButtonLink,
  Card,
  Container,
  EmptyState,
  SectionHeader,
} from "@/components/ui";
import { CommunityCard } from "@/components/communities/community-card";
import { ProfileForm } from "@/components/profile/profile-form";
import { DeleteBlogButton } from "@/components/blogs/delete-blog-button";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your corner of TechTalks" };
export default async function ProfilePage() {
  const session = await requirePageSession("/profile");
  const profile = await getProfile(session.user.id);
  if (!profile) notFound();
  const { user, blogs, communities } = profile;
  return (
    <Container className="page-shell">
      <header className="profile-header">
        <Avatar name={user.name} image={user.image} size="lg" />
        <div>
          <p className="eyebrow">Your corner of the community</p>
          <h1>{user.name}</h1>
          <p>
            {user.bio ||
              "A curious mind, a work in progress, and a member of something good."}
          </p>
          <div className="article-tools">
            {user.githubUrl && (
              <a
                className="text-link"
                href={user.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={14} />
                GitHub
                <ArrowUpRight size={13} />
              </a>
            )}
            {user.portfolioUrl && (
              <a
                className="text-link"
                href={user.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={14} />
                Website
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
      </header>
      <div className="profile-stats">
        <div>
          <strong>{blogs.filter((blog) => blog.published).length}</strong>
          <span>PUBLISHED STORIES</span>
        </div>
        <div>
          <strong>{blogs.filter((blog) => !blog.published).length}</strong>
          <span>IDEAS IN PROGRESS</span>
        </div>
        <div>
          <strong>{communities.length}</strong>
          <span>COMMUNITIES</span>
        </div>
      </div>
      <div className="profile-layout">
        <div>
          <section className="profile-section">
            <SectionHeader
              title="Your words. Your perspective."
              href="/blogs/new"
              action="Write a story"
            />
            {blogs.length ? (
              blogs.map((blog) => (
                <article key={blog.id} className="profile-article">
                  <Badge>
                    {blog.published ? "Published" : "Private draft"}
                  </Badge>
                  <h3>
                    <Link
                      className="blog-title-link"
                      href={
                        blog.published
                          ? `/blogs/${blog.slug}`
                          : `/blogs/${blog.id}/edit`
                      }
                    >
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="profile-article-meta">
                    {formatDate(blog.createdAt)} ·{" "}
                    {blog.tags.join(", ") || "Your story"}
                  </p>
                  <div className="article-tools">
                    <ButtonLink
                      variant="secondary"
                      href={`/blogs/${blog.id}/edit`}
                    >
                      <PenLine size={13} />
                      Edit story
                    </ButtonLink>
                    <DeleteBlogButton id={blog.id} />
                  </div>
                </article>
              ))
            ) : (
              <EmptyState
                title="Your first story is waiting."
                description="You don't need to have all the answers. Share something you learned along the way."
                href="/blogs/new"
                action="Start writing"
              />
            )}
          </section>
          <section className="profile-section">
            <SectionHeader
              title="The places you belong."
              href="/communities"
              action="Explore"
            />
            <div className="community-grid">
              {communities.length ? (
                communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))
              ) : (
                <EmptyState
                  title="Find your people."
                  description="Join a community around something you love, or something you want to understand."
                  href="/communities"
                  action="Browse communities"
                />
              )}
            </div>
          </section>
          <section id="edit-profile" className="profile-section">
            <SectionHeader title="A little more you." />
            <ProfileForm user={user} />
          </section>
        </div>
        <aside>
          <Card className="sidebar-card">
            <h2>Behind the profile</h2>
            <dl className="profile-details">
              <div>
                <dt>Email · only visible to you</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Connected with</dt>
                <dd className="capitalize">{user.provider}</dd>
              </div>
              <div>
                <dt>Part of the community since</dt>
                <dd>{formatDate(user.createdAt)}</dd>
              </div>
            </dl>
            <a href="#edit-profile" className="text-link">
              Edit your profile
              <ArrowUpRight size={14} />
            </a>
          </Card>
          <Card className="sidebar-card">
            <p className="eyebrow">A gentle reminder</p>
            <h2>You have something to share.</h2>
            <p>
              The thing that seems obvious to you might be exactly what someone
              else needs to hear.
            </p>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
