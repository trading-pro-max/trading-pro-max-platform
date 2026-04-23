import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import {
  createLaunchFeedbackForAuthenticatedSession,
  getLaunchFeedbackSnapshotForAuthenticatedSession,
  isLaunchFeedbackMutationInput,
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

const FEEDBACK_RATE_LIMIT = {
  maxRequests: 36,
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

  const snapshot = await getLaunchFeedbackSnapshotForAuthenticatedSession(session);

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
    buildRateLimitKey(["launch_feedback", session.session.id]),
    FEEDBACK_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Launch feedback rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<{
    category?: string;
    severity?: string;
    summary?: string;
    detail?: string | null;
  }>(request, {
    maxBytes: 32 * 1024,
  });

  if (!bodyResult.ok) return bodyResult.response;

  if (!isLaunchFeedbackMutationInput(bodyResult.body)) {
    return noStoreJson(
      {
        ok: false,
        error:
          "Invalid launch feedback payload. category, severity, and summary are required.",
      },
      400
    );
  }

  const snapshot = await createLaunchFeedbackForAuthenticatedSession({
    session,
    feedback: {
      category: bodyResult.body.category,
      severity: bodyResult.body.severity,
      summary: bodyResult.body.summary,
      detail: bodyResult.body.detail,
    },
  });

  return noStoreJson({
    ok: true,
    authenticated: true,
    snapshot,
  });
}
