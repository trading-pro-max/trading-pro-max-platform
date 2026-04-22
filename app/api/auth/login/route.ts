import { NextRequest } from "next/server";
import {
  AUTH_SESSION_COOKIE_NAME,
  getExpiredSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/auth/cookies";
import { login } from "@/lib/auth/service";
import {
  buildRateLimitKey,
  checkRateLimit,
  getRequestContext,
  getRequestRateLimitIdentity,
  noStoreJson,
  readJsonBody,
  rejectCrossOriginMutation,
} from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

const LOGIN_RATE_LIMIT = {
  maxRequests: 8,
  windowMs: 5 * 60 * 1000,
};
const LOGIN_SOURCE_RATE_LIMIT = {
  maxRequests: 40,
  windowMs: 5 * 60 * 1000,
};

function normalizeLoginEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function POST(request: NextRequest) {
  const originFailure = rejectCrossOriginMutation(request);
  if (originFailure) return originFailure;

  const bodyResult = await readJsonBody<LoginBody>(request, { maxBytes: 2048 });
  if (!bodyResult.ok) return bodyResult.response;

  const email = normalizeLoginEmail(bodyResult.body.email);
  const password =
    typeof bodyResult.body.password === "string" ? bodyResult.body.password : "";

  const requestIdentity = getRequestRateLimitIdentity(request);
  const sourceLimit = checkRateLimit(
    buildRateLimitKey(["login_source", requestIdentity]),
    LOGIN_SOURCE_RATE_LIMIT
  );
  const limit = checkRateLimit(
    buildRateLimitKey([
      "login",
      requestIdentity,
      email || "missing_email",
    ]),
    LOGIN_RATE_LIMIT
  );

  if (!sourceLimit.allowed || !limit.allowed) {
    const retryAfterSeconds = Math.max(
      sourceLimit.retryAfterSeconds,
      limit.retryAfterSeconds
    );

    return noStoreJson(
      { ok: false, error: "Too many login attempts. Try again later." },
      429,
      { "Retry-After": String(retryAfterSeconds) }
    );
  }

  if (
    email.length === 0 ||
    email.length > 254 ||
    !email.includes("@") ||
    password.length === 0 ||
    password.length > 512
  ) {
    return noStoreJson(
      { ok: false, error: "Email and password are required." },
      400
    );
  }

  const result = await login({
    email,
    password,
    ...getRequestContext(request),
  });

  if (!result.ok) {
    const response = noStoreJson(
      { ok: false, error: "Invalid credentials." },
      401
    );
    response.cookies.set(
      AUTH_SESSION_COOKIE_NAME,
      "",
      getExpiredSessionCookieOptions()
    );

    return response;
  }

  const response = noStoreJson(
    {
      ok: true,
      user: result.user,
      account: result.account,
      session: {
        id: result.session.id,
        expiresAt: result.session.expiresAt,
      },
    },
  );

  response.cookies.set(
    AUTH_SESSION_COOKIE_NAME,
    result.sessionToken,
    getSessionCookieOptions(result.session.expiresAt)
  );

  return response;
}
