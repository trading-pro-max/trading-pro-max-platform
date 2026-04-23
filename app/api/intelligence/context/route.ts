import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import { getIntelligenceBackendContext } from "@/lib/server/intelligence";
import { getRequestContext, noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await validateSession(
    getSessionTokenFromRequest(request),
    getRequestContext(request)
  );

  const snapshot = await getIntelligenceBackendContext({
    symbol: request.nextUrl.searchParams.get("symbol"),
    timeframe: request.nextUrl.searchParams.get("timeframe"),
    session,
  });

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
