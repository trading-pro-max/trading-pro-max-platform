import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import type { AlertWorkflowRule } from "@/lib/server/workflows";
import {
  getAlertWorkflowSnapshot,
  upsertAlertWorkflowSnapshot,
} from "@/lib/server/workflows";
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

type WorkflowMutationBody = {
  rules?: AlertWorkflowRule[] | null;
};

const ALERT_WORKFLOW_RATE_LIMIT = {
  maxRequests: 60,
  windowMs: 60 * 1000,
};

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(getSessionTokenFromRequest(request), getRequestContext(request));
}

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson({ ok: false, authenticated: false }, 401);
  }

  const snapshot = await getAlertWorkflowSnapshot(session.account.id);

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
    buildRateLimitKey(["alerts_workflow", session.session.id]),
    ALERT_WORKFLOW_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Alerts workflow rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<WorkflowMutationBody>(request, {
    maxBytes: 32 * 1024,
  });
  if (!bodyResult.ok) return bodyResult.response;

  if (bodyResult.body.rules === undefined) {
    return noStoreJson({ ok: false, error: "Unsupported workflow payload." }, 400);
  }

  const snapshot = await upsertAlertWorkflowSnapshot({
    userId: session.user.id,
    accountId: session.account.id,
    rules: bodyResult.body.rules,
  });

  return noStoreJson({
    ok: true,
    authenticated: true,
    snapshot,
  });
}
