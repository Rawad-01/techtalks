import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { AppError, describeError } from "./errors";
export function apiError(error: unknown) {
  const { status, ...detail } = describeError(error);
  return NextResponse.json(
    { error: detail },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
export function jsonData(data: unknown, status = 200) {
  return NextResponse.json(
    { data },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowed = new URL(
    process.env.NEXTAUTH_URL || process.env.AUTH_URL || request.url,
  ).origin;
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    (origin && origin !== allowed)
  )
    throw new AppError(403, "INVALID_ORIGIN", "This request is not allowed.");
}
export async function readJson(request: NextRequest) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    throw new AppError(
      400,
      "INVALID_CONTENT_TYPE",
      "Send a JSON request body.",
    );
  const maxBytes = 150000;
  if (Number(request.headers.get("content-length")) > maxBytes)
    throw new AppError(400, "PAYLOAD_TOO_LARGE", "This request is too large.");
  const reader = request.body?.getReader();
  if (!reader)
    throw new AppError(400, "INVALID_JSON", "Send a valid JSON request body.");
  let size = 0;
  let content = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new AppError(
          400,
          "PAYLOAD_TOO_LARGE",
          "This request is too large.",
        );
      }
      content += decoder.decode(value, { stream: true });
    }
    content += decoder.decode();
    return JSON.parse(content) as unknown;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(400, "INVALID_JSON", "Send a valid JSON request body.");
  } finally {
    reader.releaseLock();
  }
}
