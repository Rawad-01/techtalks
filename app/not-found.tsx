import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";
export default function NotFoundPage() {
  return (
    <Container className="error-page">
      <span className="error-code">404_</span>
      <p className="eyebrow">A wrong turn, a new possibility</p>
      <h1>This page went exploring.</h1>
      <p>
        The story or community you&apos;re looking for may have moved, or
        hasn&apos;t been created yet. There&apos;s plenty more to discover.
      </p>
      <div className="hero-buttons">
        <ButtonLink href="/">
          <ArrowLeft size={15} />
          Back home
        </ButtonLink>
        <ButtonLink href="/blogs" variant="secondary">
          Find a good read
          <ArrowUpRight size={15} />
        </ButtonLink>
      </div>
    </Container>
  );
}
