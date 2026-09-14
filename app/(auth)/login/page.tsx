import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { Container } from "@/components/ui";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { getSession, providerAvailability } from "@/lib/auth";
import { safeRedirect } from "@/lib/utils";
export const metadata: Metadata = {
  title: "Welcome to your community",
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";
const errors: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email already has an account. Please use the provider you originally signed in with.",
  AccessDenied:
    "Sign-in wasn't completed. Please use an account with a verified email address.",
  Configuration: "Sign-in is temporarily unavailable. Please try again later.",
};
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeRedirect(params.callbackUrl);
  if ((await getSession())?.user) redirect(callbackUrl);
  return (
    <Container className="login-layout">
      <section className="login-story">
        <Link className="back-link" href="/">
          <ArrowLeft size={14} />
          Back to the community
        </Link>
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          You&apos;re in good company
        </p>
        <h1>
          A little curiosity.
          <br />A whole world
          <br />
          of <em>possibility.</em>
        </h1>
        <p>
          Your next idea, your next collaborator, your next &ldquo;aha!&rdquo;
          moment. It all starts with a conversation.
        </p>
        <div className="login-note">
          <MessageSquareText size={27} strokeWidth={1.4} />
          <span>
            A community built around what you know,
            <br />
            and everything you have yet to discover.
          </span>
        </div>
      </section>
      <section className="login-card">
        <p className="eyebrow">HELLO, DEVELOPER_</p>
        <h2>Make yourself at home.</h2>
        <p>Sign in to share your stories and find your people.</p>
        {params.error && (
          <p className="notice notice-error" role="alert">
            {errors[params.error] ||
              "Something interrupted sign-in. Please try again."}
          </p>
        )}
        <OAuthButtons
          providers={providerAvailability()}
          callbackUrl={callbackUrl}
        />
        <p className="login-privacy">
          A new account is created on your first sign-in. We use your name,
          email, and avatar to set up your profile. Your email stays private.
        </p>
        <Link className="text-link mt-5" href="/blogs">
          Just looking around? Explore the journal →
        </Link>
      </section>
    </Container>
  );
}
