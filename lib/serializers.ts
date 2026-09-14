import type { Types } from "mongoose";
import type { Author, BlogDTO, CommunityDTO, ProfileDTO } from "./types";
import type { UserRecord } from "@/models/User";
import type { BlogRecord } from "@/models/Blog";
import type { CommunityRecord } from "@/models/Community";
type WithId<T> = T & { _id: Types.ObjectId };
export type PopulatedAuthor = Pick<
  WithId<UserRecord>,
  "_id" | "name" | "image" | "bio"
>;
export function serializeAuthor(author: PopulatedAuthor | null): Author {
  return author
    ? {
        id: String(author._id),
        name: author.name,
        image: author.image || "",
        bio: author.bio || "",
      }
    : { id: "", name: "Community member", image: "" };
}
export function serializeBlog(
  blog: Omit<WithId<BlogRecord>, "author"> & { author: PopulatedAuthor | null },
): BlogDTO {
  return {
    id: String(blog._id),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    tags: blog.tags,
    author: serializeAuthor(blog.author),
    published: blog.published,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };
}
export function serializeCommunity(
  community: Omit<WithId<CommunityRecord>, "createdBy"> & {
    createdBy: PopulatedAuthor | null;
  },
): CommunityDTO {
  return {
    id: String(community._id),
    name: community.name,
    slug: community.slug,
    description: community.description,
    category: community.category,
    tags: community.tags,
    memberCount: community.members.length,
    createdBy: serializeAuthor(community.createdBy),
    createdAt: community.createdAt.toISOString(),
  };
}
export function serializeProfile(user: WithId<UserRecord>): ProfileDTO {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    image: user.image,
    bio: user.bio,
    provider: user.provider,
    githubUrl: user.githubUrl,
    portfolioUrl: user.portfolioUrl,
    createdAt: user.createdAt.toISOString(),
  };
}
