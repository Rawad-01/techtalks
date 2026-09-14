import { NextResponse, type NextRequest } from "next/server";
import { handlers, authConfigured } from "@/lib/auth";
export async function GET(request: NextRequest) {
  if (!authConfigured() && request.nextUrl.pathname.endsWith("/session"))
    return NextResponse.json(null, {
      headers: { "Cache-Control": "no-store" },
    });
  return handlers.GET(request);
}
export const POST = handlers.POST;
export const runtime = "nodejs";
