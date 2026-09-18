export function cn(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
export function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
export function safeRedirect(value: unknown, fallback = "/profile") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\r\n]/.test(value)
  )
    return fallback;
  try {
    const url = new URL(value, "https://techtalks.invalid");
    return url.origin === "https://techtalks.invalid" &&
      !url.pathname.startsWith("/login") &&
      !url.pathname.startsWith("/api/auth")
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}

export function resolveAuthRedirect(url: string, baseUrl: string) {
  // This is an internal sign-in failure destination, not a user callback URL.
  if (url === "/login?error=OAuthAccountNotLinked") return `${baseUrl}${url}`;
  if (url.startsWith("/")) return `${baseUrl}${safeRedirect(url)}`;
  try {
    if (new URL(url).origin === baseUrl) return url;
  } catch {
    /* Fall back to the profile. */
  }
  return `${baseUrl}/profile`;
}
