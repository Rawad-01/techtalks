import mongoose from "mongoose";
import { pathToFileURL } from "node:url";
import { connectDB } from "../lib/db";
import { User } from "../models/User";
import { Blog } from "../models/Blog";
import { Community } from "../models/Community";
import { blogSchema, communitySchema } from "../lib/validations";
import { seedBlogs, seedCommunities, seedUsers } from "./seed-data";
export async function seedDatabase() {
  await connectDB();
  await Promise.all([User.init(), Blog.init(), Community.init()]);
  const users = [];
  for (const user of seedUsers) {
    users.push(
      await User.findOneAndUpdate(
        { email: user.email },
        { $setOnInsert: user },
        { upsert: true, new: true, runValidators: true },
      ),
    );
  }
  for (const [index, item] of seedCommunities.entries()) {
    const { author, ...input } = item;
    const community = communitySchema.parse(input);
    await Community.updateOne(
      { slug: community.slug },
      {
        $setOnInsert: {
          ...community,
          createdBy: users[author]._id,
          members: users.slice(0, 2 + (index % 3)).map((user) => user._id),
        },
      },
      { upsert: true, runValidators: true },
    );
  }
  for (const [index, item] of seedBlogs.entries()) {
    const { author, ...input } = item;
    const blog = blogSchema.parse({ ...input, published: true });
    const date = new Date(Date.now() - (index + 1) * 86400000);
    await Blog.updateOne(
      { slug: blog.slug },
      {
        $setOnInsert: {
          ...blog,
          author: users[author]._id,
          createdAt: date,
          updatedAt: date,
        },
      },
      { upsert: true, runValidators: true, timestamps: false },
    );
  }
  console.log(
    `Seed ready: ${seedUsers.length} editorial users, ${seedBlogs.length} stories, ${seedCommunities.length} communities. Existing content was preserved.`,
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  seedDatabase()
    .then(() => mongoose.disconnect())
    .catch(async (error: unknown) => {
      console.error(
        "Seed failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
      await mongoose.disconnect();
      process.exitCode = 1;
    });
}
