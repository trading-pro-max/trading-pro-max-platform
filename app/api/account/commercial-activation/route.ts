import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import {
  getCommercialActivationSnapshotForAuthenticatedSession,
  isCommercialActivationMutationInput,
  upsertCommercialActivationRequestForAuthenticatedSession,
} from "@/lib/server/commercial";
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

const COMMERCIAL_ACTIVATION_RATE_LIMIT = {
  maxRequests: 30,
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

  const snapshot = await getCommercialActivationSnapshotForAuthenticatedSession(session);

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
    buildRateLimitKey(["commercial_activation", session.session.id]),
    COMMERCIAL_ACTIVATION_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Commercial activation rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<{
    requestedPlan?: string;
    note?: string | null;
  }>(request, {
    maxBytes: 16 * 1024,
  });
  if (!bodyResult.ok) return bodyResult.response;

  if (!isCommercialActivationMutationInput(bodyResult.body)) {
    return noStoreJson(
      {
        ok: false,
        error:
          "Invalid commercial activation payload. requestedPlan must be team_review or enterprise_guarded.",
      },
      400
    );
  }

  const snapshot = await upsertCommercialActivationRequestForAuthenticatedSession({
    session,
    requestedPlan: bodyResult.body.requestedPlan,
    note: bodyResult.body.note,
  });

  return noStoreJson({
    ok: true,
    authenticated: true,
    snapshot,
  });
}
