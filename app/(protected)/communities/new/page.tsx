import type { Metadata } from "next";
import { requirePageSession } from "@/lib/authorization";
import { Container, PageHeader, Card } from "@/components/ui";
import { CommunityForm } from "@/components/communities/community-form";
export const metadata: Metadata = { title: "Start a community" };
export default async function NewCommunityPage() {
  await requirePageSession("/communities/new");
  return (
    <Container className="page-shell">
      <PageHeader
        eyebrow="Make room for your people"
        title="Small circles. Big ideas."
        description="Start a welcoming space for a shared interest. You bring the curiosity; your community brings the possibilities."
      />
      <div className="editor-layout">
        <CommunityForm />
        <aside>
          <Card className="sidebar-card">
            <h2>A good place to begin</h2>
            <p>
              Give your community a clear purpose, choose the topics you&apos;ll
              explore, and welcome people of every experience level.
            </p>
            <p className="mt-4">
              You&apos;ll become the first member. Stories that share your topic
              tags will appear in the community journal.
            </p>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
