import { connectDB } from "./db";
import { Blog } from "@/models/Blog";
import { Community } from "@/models/Community";
import { User } from "@/models/User";
import {
  blogSchema,
  blogUpdateSchema,
  communitySchema,
  objectIdSchema,
  profileSchema,
} from "./validations";
import { AppError } from "./errors";

async function validateActor(userId: string) {
  if (!objectIdSchema.safeParse(userId).success)
    throw new AppError(401, "UNAUTHENTICATED", "Please log in to continue.");
  await connectDB();
  if (!(await User.exists({ _id: userId })))
    throw new AppError(
      401,
      "UNAUTHENTICATED",
      "Your session is no longer valid. Please log in again.",
    );
}
export async function createBlog(userId: string, input: unknown) {
  await validateActor(userId);
  const data = blogSchema.parse(input);
  await Blog.init();
  return Blog.create({ ...data, author: userId });
}
export async function updateBlog(userId: string, id: string, input: unknown) {
  await validateActor(userId);
  objectIdSchema.parse(id);
  const data = blogUpdateSchema.parse(input);
  const blog = await Blog.findById(id).select("author slug");
  if (!blog)
    throw new AppError(404, "NOT_FOUND", "That story could not be found.");
  if (String(blog.author) !== userId)
    throw new AppError(
      403,
      "FORBIDDEN",
      "Only the author can edit this story.",
    );
  const updated = await Blog.findOneAndUpdate(
    { _id: id, author: userId },
    { $set: data },
    { new: true, runValidators: true },
  );
  if (!updated)
    throw new AppError(404, "NOT_FOUND", "That story could not be found.");
  return { blog: updated, previousSlug: blog.slug };
}
export async function deleteBlog(userId: string, id: string) {
  await validateActor(userId);
  objectIdSchema.parse(id);
  const blog = await Blog.findById(id).select("author slug");
  if (!blog)
    throw new AppError(404, "NOT_FOUND", "That story could not be found.");
  if (String(blog.author) !== userId)
    throw new AppError(
      403,
      "FORBIDDEN",
      "Only the author can delete this story.",
    );
  await Blog.deleteOne({ _id: id, author: userId });
  return blog.slug;
}
export async function createCommunity(userId: string, input: unknown) {
  await validateActor(userId);
  const data = communitySchema.parse(input);
  await Community.init();
  return Community.create({ ...data, createdBy: userId, members: [userId] });
}
export async function changeMembership(
  userId: string,
  id: string,
  join: boolean,
) {
  await validateActor(userId);
  objectIdSchema.parse(id);
  // Atomic set operations make repeated requests safe and prevent duplicate memberships.
  const community = await Community.findByIdAndUpdate(
    id,
    join ? { $addToSet: { members: userId } } : { $pull: { members: userId } },
    { new: true, runValidators: true },
  );
  if (!community)
    throw new AppError(404, "NOT_FOUND", "That community could not be found.");
  return {
    id: community.id,
    slug: community.slug,
    joined: join,
    memberCount: community.members.length,
  };
}
export async function updateProfile(userId: string, input: unknown) {
  await validateActor(userId);
  const data = profileSchema.parse(input);
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true },
  );
  if (!user)
    throw new AppError(404, "NOT_FOUND", "Your profile could not be found.");
  return user;
}
