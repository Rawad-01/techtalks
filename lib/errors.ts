import { z } from "zod";
import type { ActionState } from "./types";
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export function describeError(error: unknown): {
  status: number;
  code: string;
  message: string;
  fields?: Record<string, string[] | undefined>;
} {
  if (error instanceof z.ZodError)
    return {
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Please check the highlighted fields.",
      fields: z.flattenError(error).fieldErrors,
    };
  if (error instanceof AppError)
    return { status: error.status, code: error.code, message: error.message };
  if (
    typeof error === "object" &&
    error &&
    "code" in error &&
    error.code === 11000
  )
    return {
      status: 409,
      code: "CONFLICT",
      message: "This slug is already in use. Please choose another.",
      fields: { slug: ["This slug is already in use."] },
    };
  console.error(
    "A server operation failed.",
    error instanceof Error ? error.name : "Unknown error",
  );
  return {
    status: 500,
    code: "INTERNAL_ERROR",
    message: "We couldn't complete that request. Please try again shortly.",
  };
}
export function actionError(error: unknown): ActionState {
  const result = describeError(error);
  return { success: false, message: result.message, errors: result.fields };
}
