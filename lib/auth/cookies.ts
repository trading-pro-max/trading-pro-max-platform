import "server-only";
import type { NextRequest } from "next/server";

export const AUTH_SESSION_COOKIE_NAME = "tpm_session";

const BEARER_PREFIX = "Bearer ";

export function getSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export function getExpiredSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };
}

export function readBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) return null;

  const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();
  return token || null;
}

export function getSessionTokenFromRequest(request: NextRequest) {
  return (
    readBearerToken(request.headers.get("authorization")) ??
    request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value ??
    null
  );
}
