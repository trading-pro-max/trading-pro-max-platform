import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_SESSION_COOKIE_NAME,
  getExpiredSessionCookieOptions,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";
import { logout } from "@/lib/auth/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRequestIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || null;

  return request.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
  await logout(getSessionTokenFromRequest(request), {
    userAgent: request.headers.get("user-agent"),
    ipAddress: getRequestIp(request),
  });

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );

  response.cookies.set(
    AUTH_SESSION_COOKIE_NAME,
    "",
    getExpiredSessionCookieOptions()
  );

  return response;
}
