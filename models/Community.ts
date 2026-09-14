import {
  Schema,
  model,
  models,
  type Model,
  type InferSchemaType,
} from "mongoose";
const communitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 3000 },
    category: { type: String, required: true, default: "General" },
    tags: { type: [String], default: [] },
    members: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);
communitySchema.index({ members: 1 });
export type CommunityRecord = InferSchemaType<typeof communitySchema>;
export const Community =
  (models.Community as Model<CommunityRecord>) ||
  model("Community", communitySchema);
