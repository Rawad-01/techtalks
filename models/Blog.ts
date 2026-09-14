import {
  Schema,
  model,
  models,
  type Model,
  type InferSchemaType,
} from "mongoose";
const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true, maxlength: 320 },
    content: { type: String, required: true, maxlength: 100000 },
    tags: { type: [String], default: [] },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ tags: 1, published: 1 });
export type BlogRecord = InferSchemaType<typeof blogSchema>;
export const Blog =
  (models.Blog as Model<BlogRecord>) || model("Blog", blogSchema);
