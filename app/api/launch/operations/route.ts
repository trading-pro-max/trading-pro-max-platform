import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import { getDiagnosticsHealthSnapshot } from "@/lib/server/diagnostics/health";
import { getOpsProductionHardeningSnapshot } from "@/lib/server/ops";
import {
  activateClosedBetaForAuthenticatedSession,
  buildLaunchReadinessGateSnapshot,
  getLaunchOperationsSnapshotForAuthenticatedSession,
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

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(getSessionTokenFromRequest(request), getRequestContext(request));
}

type LaunchOperationsMutationBody = {
  action?: "activate_closed_beta";
  note?: string | null;
};

const LAUNCH_OPERATIONS_RATE_LIMIT = {
  maxRequests: 24,
  windowMs: 60 * 1000,
};

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson({ ok: false, authenticated: false }, 401);
  }

  const health = await getDiagnosticsHealthSnapshot();
  const gate = buildLaunchReadinessGateSnapshot(health);
  const hardening = await getOpsProductionHardeningSnapshot();
  const snapshot = await getLaunchOperationsSnapshotForAuthenticatedSession({
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
    buildRateLimitKey(["launch_operations", session.session.id]),
    LAUNCH_OPERATIONS_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Launch operations rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<LaunchOperationsMutationBody>(request, {
    maxBytes: 16 * 1024,
  });
  if (!bodyResult.ok) return bodyResult.response;

  if (bodyResult.body.action !== "activate_closed_beta") {
    return noStoreJson(
      { ok: false, error: "Unsupported launch operations action." },
      400
    );
  }

  const health = await getDiagnosticsHealthSnapshot();
  const gate = buildLaunchReadinessGateSnapshot(health);
  const activation = await activateClosedBetaForAuthenticatedSession({
    session,
    gate,
    note: bodyResult.body.note,
  });

  if (!activation.ok) {
    return noStoreJson(
      {
        ok: false,
        authenticated: true,
        action: bodyResult.body.action,
        reason: activation.reason,
        snapshot: activation.snapshot,
      },
      409
    );
  }

  const hardening = await getOpsProductionHardeningSnapshot();
  const snapshot = await getLaunchOperationsSnapshotForAuthenticatedSession({
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
  });
}
