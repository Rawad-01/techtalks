"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Github, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui";
export function OAuthButtons({
  providers,
  callbackUrl,
}: {
  providers: { google: boolean; github: boolean };
  callbackUrl: string;
}) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  async function login(provider: "google" | "github") {
    setPending(provider);
    setError("");
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setError("We couldn't connect. Please try again.");
      setPending(null);
    }
  }
  return (
    <>
      <div className="oauth-buttons">
        <Button
          variant="secondary"
          disabled={!providers.google || Boolean(pending)}
          onClick={() => login("google")}
        >
          {pending === "google" ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285f4"
                d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.87h5.38a4.61 4.61 0 0 1-2 3.03v2.52h3.24c1.89-1.74 2.98-4.31 2.98-7.37Z"
              />
              <path
                fill="#34a853"
                d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.6A10 10 0 0 0 12 22Z"
              />
              <path
                fill="#fbbc05"
                d="M6.4 13.91a6 6 0 0 1 0-3.82v-2.6H3.06a10 10 0 0 0 0 9.02l3.34-2.6Z"
              />
              <path
                fill="#ea4335"
                d="M12 5.96c1.47 0 2.79.5 3.83 1.52L18.7 4.6A9.61 9.61 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.34 2.6A6.02 6.02 0 0 1 12 5.96Z"
              />
            </svg>
          )}
          Continue with Google
        </Button>
        <Button
          variant="secondary"
          disabled={!providers.github || Boolean(pending)}
          onClick={() => login("github")}
        >
          {pending === "github" ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Github size={19} />
          )}
          Continue with GitHub
        </Button>
      </div>
      {(!providers.google || !providers.github) && (
        <p className="notice">
          {!providers.google && !providers.github
            ? "Sign-in is being set up. You can explore all published stories and communities in the meantime."
            : "One sign-in option is still being set up. Use the available provider to continue."}
        </p>
      )}
      {error && (
        <p role="alert" className="notice notice-error">
          {error}
        </p>
      )}
    </>
  );
}
