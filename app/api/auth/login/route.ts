import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_SESSION_COOKIE_NAME,
  getExpiredSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/auth/cookies";
import { login } from "@/lib/auth/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

function getRequestIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || null;

  return request.headers.get("x-real-ip");
}

async function readLoginBody(request: NextRequest): Promise<LoginBody | null> {
  try {
    return (await request.json()) as LoginBody;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = await readLoginBody(request);

  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    body.email.trim().length === 0 ||
    body.password.length === 0
  ) {
    return NextResponse.json(
      { ok: false, error: "Email and password are required." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const result = await login({
    email: body.email,
    password: body.password,
    userAgent: request.headers.get("user-agent"),
    ipAddress: getRequestIp(request),
  });

  if (!result.ok) {
    const response = NextResponse.json(
      { ok: false, error: "Invalid credentials." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
    response.cookies.set(
      AUTH_SESSION_COOKIE_NAME,
      "",
      getExpiredSessionCookieOptions()
    );

    return response;
  }

  const response = NextResponse.json(
    {
      ok: true,
      user: result.user,
      account: result.account,
      session: {
        id: result.session.id,
        expiresAt: result.session.expiresAt,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );

  response.cookies.set(
    AUTH_SESSION_COOKIE_NAME,
    result.sessionToken,
    getSessionCookieOptions(result.session.expiresAt)
  );

  return response;
}
