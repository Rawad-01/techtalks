import {
  Schema,
  model,
  models,
  type Model,
  type InferSchemaType,
} from "mongoose";
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: { type: String, default: "" },
    provider: {
      type: String,
      enum: ["google", "github", "seed"],
      required: true,
    },
    oauthId: { type: String, unique: true, sparse: true },
    bio: { type: String, default: "", maxlength: 500 },
    githubUrl: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
  },
  { timestamps: true },
);
export type UserRecord = InferSchemaType<typeof userSchema>;
export const User =
  (models.User as Model<UserRecord>) || model("User", userSchema);
