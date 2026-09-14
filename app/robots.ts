import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/profile",
        "/login",
        "/api/",
        "/blogs/new",
        "/communities/new",
        "/blogs/*/edit",
      ],
    },
  };
}
