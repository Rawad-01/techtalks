import "server-only";
import { cache } from "react";
import { connectDB, isDatabaseConfigured } from "./db";
import { Blog } from "@/models/Blog";
import { Community } from "@/models/Community";
import { User } from "@/models/User";
import {
  serializeBlog,
  serializeCommunity,
  serializeProfile,
  serializeAuthor,
  type PopulatedAuthor,
} from "./serializers";
import { objectIdSchema } from "./validations";

const authorFields = "name image bio";
export const getBlogs = cache(async (limit = 100) => {
  if (!isDatabaseConfigured()) return [];
  await connectDB();
  const blogs = await Blog.find({ published: true })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .populate<{ author: PopulatedAuthor }>("author", authorFields)
    .lean();
  return blogs.map(serializeBlog);
});
export const getBlogBySlug = cache(async (slug: string) => {
  if (!isDatabaseConfigured()) return null;
  await connectDB();
  const blog = await Blog.findOne({ slug, published: true })
    .populate<{ author: PopulatedAuthor }>("author", authorFields)
    .lean();
  return blog ? serializeBlog(blog) : null;
});
export async function getRelatedBlogs(tags: string[], excludeId?: string) {
  if (!isDatabaseConfigured() || !tags.length) return [];
  await connectDB();
  const blogs = await Blog.find({
    published: true,
    tags: { $in: tags },
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate<{ author: PopulatedAuthor }>("author", authorFields)
    .lean();
  return blogs.map(serializeBlog);
}
export const getCommunities = cache(async (limit = 100) => {
  if (!isDatabaseConfigured()) return [];
  await connectDB();
  const communities = await Community.find()
    .sort({ createdAt: 1, _id: 1 })
    .limit(limit)
    .populate<{ createdBy: PopulatedAuthor }>("createdBy", authorFields)
    .lean();
  return communities.map(serializeCommunity);
});
export const getCommunityBySlug = cache(async (slug: string) => {
  if (!isDatabaseConfigured()) return null;
  await connectDB();
  const community = await Community.findOne({ slug })
    .populate<{ createdBy: PopulatedAuthor }>("createdBy", authorFields)
    .lean();
  return community ? serializeCommunity(community) : null;
});
export async function getCommunityMembers(id: string) {
  objectIdSchema.parse(id);
  await connectDB();
  const community = await Community.findById(id)
    .select("members")
    .populate<{ members: PopulatedAuthor[] }>({
      path: "members",
      select: authorFields,
      options: { limit: 8 },
    })
    .lean();
  return community?.members.map(serializeAuthor) || [];
}
export async function isMember(communityId: string, userId: string) {
  await connectDB();
  return Boolean(await Community.exists({ _id: communityId, members: userId }));
}
export async function getProfile(userId: string) {
  objectIdSchema.parse(userId);
  await connectDB();
  const [user, blogs, communities] = await Promise.all([
    User.findById(userId).lean(),
    Blog.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate<{ author: PopulatedAuthor }>("author", authorFields)
      .lean(),
    Community.find({ members: userId })
      .populate<{ createdBy: PopulatedAuthor }>("createdBy", authorFields)
      .lean(),
  ]);
  return user
    ? {
        user: serializeProfile(user),
        blogs: blogs.map(serializeBlog),
        communities: communities.map(serializeCommunity),
      }
    : null;
}
export async function getOwnedBlog(id: string, userId: string) {
  if (!objectIdSchema.safeParse(id).success) return null;
  await connectDB();
  const blog = await Blog.findOne({ _id: id, author: userId })
    .populate<{ author: PopulatedAuthor }>("author", authorFields)
    .lean();
  return blog ? serializeBlog(blog) : null;
}
