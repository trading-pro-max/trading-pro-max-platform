import { NextRequest } from "next/server";
import {
  AUTH_SESSION_COOKIE_NAME,
  getExpiredSessionCookieOptions,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";
import { logout } from "@/lib/auth/service";
import {
  getRequestContext,
  noStoreJson,
  rejectCrossOriginMutation,
} from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const originFailure = rejectCrossOriginMutation(request);
  if (originFailure) return originFailure;

  await logout(getSessionTokenFromRequest(request), getRequestContext(request));

  const response = noStoreJson({ ok: true });

  response.cookies.set(
    AUTH_SESSION_COOKIE_NAME,
    "",
    getExpiredSessionCookieOptions()
  );

  return response;
}
