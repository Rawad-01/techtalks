import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { resolveAuthRedirect } from "@/lib/utils";

export const authConfigured = () =>
  Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET);
export const providerAvailability = () => ({
  google: Boolean(
    authConfigured() &&
    process.env.MONGODB_URI &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET,
  ),
  github: Boolean(
    authConfigured() &&
    process.env.MONGODB_URI &&
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET,
  ),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  // Honor the configured canonical origin for the documented legacy URL alias.
  trustHost:
    Boolean(process.env.NEXTAUTH_URL || process.env.AUTH_URL) || undefined,
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !user.email || !user.name) return false;
      if (account.provider === "google" && profile?.email_verified !== true)
        return false;
      await connectDB();
      await User.init();
      const oauthId = `${account.provider}:${account.providerAccountId}`;
      const existing = await User.findOne({ oauthId });
      if (existing) {
        user.id = existing.id;
        return true;
      }
      // Provider identities are authoritative. Never link accounts just because emails match.
      if (await User.exists({ email: user.email.toLowerCase() }))
        return "/login?error=OAuthAccountNotLinked";
      try {
        const saved = await User.findOneAndUpdate(
          { oauthId },
          {
            $setOnInsert: {
              oauthId,
              name: user.name.slice(0, 80),
              email: user.email.toLowerCase(),
              image: user.image || "",
              provider: account.provider,
            },
          },
          { upsert: true, new: true, runValidators: true },
        );
        user.id = saved.id;
        return true;
      } catch (error) {
        if (
          typeof error === "object" &&
          error &&
          "code" in error &&
          error.code === 11000
        )
          return "/login?error=OAuthAccountNotLinked";
        throw error;
      }
    },
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (!token.userId) return { ...session, user: undefined };
      await connectDB();
      const user = await User.findById(token.userId)
        .select("name email image")
        .lean();
      if (!user) return { ...session, user: undefined };
      session.user.id = String(user._id);
      session.user.name = user.name;
      session.user.email = user.email;
      session.user.image = user.image;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return resolveAuthRedirect(url, baseUrl);
    },
  },
  logger: {
    error() {
      console.error(
        "Authentication failed. Check provider and database configuration.",
      );
    },
  },
});

export async function getSession() {
  return authConfigured() ? auth() : null;
}
