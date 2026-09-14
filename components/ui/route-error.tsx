"use client";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button, ButtonLink, Container } from "@/components/ui";
export function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="error-page">
      <span className="error-code" aria-hidden="true">{`{ … }`}</span>
      <p className="eyebrow">A little interruption</p>
      <h1>Let&apos;s give that another try.</h1>
      <p>
        We couldn&apos;t load this part of the community. A fresh start usually
        helps.
      </p>
      <div className="hero-buttons">
        <Button onClick={reset}>
          <RefreshCw size={15} />
          Try again
        </Button>
        <ButtonLink href="/" variant="secondary">
          <ArrowLeft size={15} />
          Back home
        </ButtonLink>
      </div>
    </Container>
  );
}
