import "server-only";
import type { NextRequest } from "next/server";
import { isSessionTokenShape } from "./session-token";

export const AUTH_SESSION_COOKIE_NAME = "tpm_session";

const BEARER_PREFIX = "Bearer ";
const AUTHORIZATION_BEARER_ENABLED = "true";

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

export function isAuthorizationBearerEnabled() {
  return process.env.TPM_ALLOW_AUTHORIZATION_BEARER === AUTHORIZATION_BEARER_ENABLED;
}

export function getSessionTokenFromRequest(request: NextRequest) {
  const cookieToken = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value?.trim();
  if (isSessionTokenShape(cookieToken)) return cookieToken;

  if (!isAuthorizationBearerEnabled()) return null;

  const bearerToken = readBearerToken(request.headers.get("authorization"));
  return isSessionTokenShape(bearerToken) ? bearerToken : null;
}
