import { NextRequest, NextResponse } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { getCurrentUserSession } from "@/lib/auth/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRequestIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || null;

  return request.headers.get("x-real-ip");
}

export async function GET(request: NextRequest) {
  const currentSession = await getCurrentUserSession(
    getSessionTokenFromRequest(request),
    {
      userAgent: request.headers.get("user-agent"),
      ipAddress: getRequestIp(request),
    }
  );

  if (!currentSession) {
    return NextResponse.json(
      { ok: false, authenticated: false },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      authenticated: true,
      user: currentSession.user,
      account: currentSession.account,
      session: {
        id: currentSession.session.id,
        expiresAt: currentSession.session.expiresAt,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
