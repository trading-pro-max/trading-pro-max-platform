import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { getCurrentUserSession } from "@/lib/auth/service";
import { getRequestContext, noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const currentSession = await getCurrentUserSession(
    getSessionTokenFromRequest(request),
    getRequestContext(request)
  );

  if (!currentSession) {
    return noStoreJson(
      { ok: false, authenticated: false },
      401
    );
  }

  return noStoreJson(
    {
      ok: true,
      authenticated: true,
      user: currentSession.user,
      account: currentSession.account,
      session: {
        id: currentSession.session.id,
        expiresAt: currentSession.session.expiresAt,
      },
    }
  );
}
