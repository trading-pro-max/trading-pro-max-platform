import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";
import { getOpsProductionHardeningSnapshot } from "@/lib/server/ops";
import {
  activatePublicLaunchGateForAuthenticatedSession,
  buildLaunchReadinessGateSnapshot,
  getLaunchOperationsSnapshotForAuthenticatedSession,
  getPublicGoLiveSnapshotForAuthenticatedSession,
} from "@/lib/server/launch";
import {
  buildRateLimitKey,
  checkRateLimit,
  getRequestContext,
  noStoreJson,
  readJsonBody,
  rejectCrossOriginMutation,
} from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PublicGoLiveMutationBody = {
  action?: "activate_public_launch_gate";
  note?: string | null;
};

const PUBLIC_GO_LIVE_RATE_LIMIT = {
  maxRequests: 16,
  windowMs: 60 * 1000,
};

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
  const snapshot = await getPublicGoLiveSnapshotForAuthenticatedSession({
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

export async function POST(request: NextRequest) {
  const originFailure = rejectCrossOriginMutation(request);
  if (originFailure) return originFailure;

  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson({ ok: false, authenticated: false }, 401);
  }

  const limit = checkRateLimit(
    buildRateLimitKey(["launch_public_go_live", session.session.id]),
    PUBLIC_GO_LIVE_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Public go-live rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<PublicGoLiveMutationBody>(request, {
    maxBytes: 16 * 1024,
  });
  if (!bodyResult.ok) return bodyResult.response;

  if (bodyResult.body.action !== "activate_public_launch_gate") {
    return noStoreJson(
      { ok: false, error: "Unsupported public go-live action." },
      400
    );
  }

  const health = await getDiagnosticsHealthSnapshot();
  const gate = buildLaunchReadinessGateSnapshot(health);
  const hardening = await getOpsProductionHardeningSnapshot();
  const launchOperations = await getLaunchOperationsSnapshotForAuthenticatedSession({
    session,
    gate,
    hardening,
  });
  const activation = await activatePublicLaunchGateForAuthenticatedSession({
    session,
    gate,
    publicLaunchChecklistPassed: launchOperations.publicLaunch.checklist.failedCount === 0,
    note: bodyResult.body.note,
  });

  if (!activation.ok) {
    return noStoreJson(
      {
        ok: false,
        authenticated: true,
        action: bodyResult.body.action,
        reason: activation.reason,
        lifecycle: activation.snapshot,
        snapshot: launchOperations.publicLaunch,
      },
      409
    );
  }

  const snapshot = await getPublicGoLiveSnapshotForAuthenticatedSession({
    session,
    gate,
    hardening,
  });
  const launchSnapshot = await getLaunchOperationsSnapshotForAuthenticatedSession({
    session,
    gate,
    hardening,
  });

  return noStoreJson({
    ok: true,
    authenticated: true,
    action: bodyResult.body.action,
    reason: activation.reason,
    lifecycle: activation.snapshot,
    snapshot,
    launchOperations: launchSnapshot,
  });
}
