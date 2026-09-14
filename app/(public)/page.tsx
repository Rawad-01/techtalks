import { Container, EmptyState, SectionHeader } from "@/components/ui";
import { Hero, Benefits, ClosingCTA } from "@/components/home/home-sections";
import { BlogCard } from "@/components/blogs/blog-card";
import { CommunityCard } from "@/components/communities/community-card";
import { getBlogs, getCommunities } from "@/lib/data";
export const revalidate = 60;
export default async function HomePage() {
  const [blogs, communities] = await Promise.all([
    getBlogs(4),
    getCommunities(3),
  ]);
  return (
    <Container>
      <Hero />
      <section className="section">
        <SectionHeader
          label="Fresh from the community"
          title="Ideas worth your time."
          href="/blogs"
          action="All stories"
        />
        {blogs.length ? (
          <div className="editorial-grid">
            <BlogCard blog={blogs[0]} />
            <div className="blog-list">
              {blogs.slice(1).map((blog) => (
                <BlogCard key={blog.id} blog={blog} compact />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No blogs published yet."
            description="A good idea deserves to be shared. Make yours the first story in our community."
            href="/blogs/new"
            action="Write a story"
          />
        )}
      </section>
      <section className="section community-section">
        <SectionHeader
          label="Find your people"
          title="Different interests. Shared curiosity."
          href="/communities"
          action="All communities"
        />
        <div className="community-grid">
          {communities.length ? (
            communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))
          ) : (
            <EmptyState
              title="Your next community starts here."
              description="Create a space for the technologies, ideas, and questions that bring you together."
              href="/communities/new"
              action="Start a community"
            />
          )}
        </div>
      </section>
      <Benefits />
      <ClosingCTA />
    </Container>
  );
}
