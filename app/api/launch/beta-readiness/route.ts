import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";
import { getOpsProductionHardeningSnapshot } from "@/lib/server/ops";
import {
  buildLaunchReadinessGateSnapshot,
  getClosedBetaPreparationSnapshotForAuthenticatedSession,
} from "@/lib/server/launch";
import { getRequestContext, noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(
    getSessionTokenFromRequest(request),
    getRequestContext(request)
  );
}

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson({ ok: false, authenticated: false }, 401);
  }

  const health = await getDiagnosticsHealthSnapshot();
  const gate = buildLaunchReadinessGateSnapshot(health);
  const hardening = await getOpsProductionHardeningSnapshot();
  const snapshot = await getClosedBetaPreparationSnapshotForAuthenticatedSession({
    session,
    gate,
    hardening,
  });

  return noStoreJson({
    ok: true,
    authenticated: true,
    snapshot,
  });
}
