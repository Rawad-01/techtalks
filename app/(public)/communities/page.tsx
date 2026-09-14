import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { ButtonLink, Container, PageHeader } from "@/components/ui";
import { CommunityExplorer } from "@/components/communities/community-explorer";
import { getCommunities } from "@/lib/data";
export const revalidate = 60;
export const metadata: Metadata = {
  title: "Find your people",
  description:
    "Explore developer communities around frontend, backend, design, artificial intelligence, and more.",
};
export default async function CommunitiesPage() {
  const communities = await getCommunities();
  return (
    <Container className="page-shell">
      <PageHeader
        eyebrow="Good company. Great possibilities."
        title="Find your kind of people."
        description="Big ideas start in small circles. Find a community that shares your interests, challenges your thinking, and cheers you on."
      >
        <ButtonLink href="/communities/new" variant="secondary">
          <Plus size={16} />
          Start a community
        </ButtonLink>
      </PageHeader>
      <CommunityExplorer communities={communities} />
    </Container>
  );
}
