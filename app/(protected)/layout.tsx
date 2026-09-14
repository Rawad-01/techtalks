import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
