import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import {
  ComplianceTransitionError,
  applyOperatorReviewAction,
  getAccountComplianceSnapshot,
  isOperatorReviewAction,
} from "@/lib/server/compliance";
import { getOperatorAccess } from "@/lib/server/operator";
import {
  buildRateLimitKey,
  checkRateLimit,
  getRequestContext,
  noStoreJson,
  normalizeClientText,
  readJsonBody,
  rejectCrossOriginMutation,
} from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OperatorReviewBody = {
  accountId?: unknown;
  action?: unknown;
  reason?: unknown;
  note?: unknown;
};

const OPERATOR_REVIEW_RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 1000,
};

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(getSessionTokenFromRequest(request), getRequestContext(request));
}

function handleTransitionError(error: unknown) {
  if (error instanceof ComplianceTransitionError) {
    return noStoreJson(
      { ok: false, code: error.code, error: error.message },
      error.status
    );
  }

  throw error;
}

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson({ ok: false, authenticated: false }, 401);
  }

  const operatorAccess = getOperatorAccess(request, session);
  if (!operatorAccess.ok) {
    return noStoreJson(
      { ok: false, error: operatorAccess.error },
      operatorAccess.status
    );
  }

  const accountId = normalizeClientText(
    request.nextUrl.searchParams.get("accountId"),
    128
  );
  if (!accountId) {
    return noStoreJson({ ok: false, error: "accountId is required." }, 400);
  }

  const compliance = await getAccountComplianceSnapshot(accountId);

  if (!compliance) {
    return noStoreJson({ ok: false, error: "Account was not found." }, 404);
  }

  return noStoreJson({ ok: true, compliance });
}

export async function POST(request: NextRequest) {
  const originFailure = rejectCrossOriginMutation(request);
  if (originFailure) return originFailure;

  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson({ ok: false, authenticated: false }, 401);
  }

  const operatorAccess = getOperatorAccess(request, session);
  if (!operatorAccess.ok) {
    return noStoreJson(
      { ok: false, error: operatorAccess.error },
      operatorAccess.status
    );
  }

  const limit = checkRateLimit(
    buildRateLimitKey(["operator_review", session.session.id]),
    OPERATOR_REVIEW_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Operator review rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<OperatorReviewBody>(request, {
    maxBytes: 8192,
  });
  if (!bodyResult.ok) return bodyResult.response;

  const accountId = normalizeClientText(bodyResult.body.accountId, 128);
  const action = normalizeClientText(bodyResult.body.action, 64);

  if (
    !accountId ||
    !action ||
    !isOperatorReviewAction(action)
  ) {
    return noStoreJson({ ok: false, error: "Unsupported operator action." }, 400);
  }

  try {
    const result = await applyOperatorReviewAction({
      accountId,
      operatorUserId: operatorAccess.operatorUserId,
      operatorLabel: operatorAccess.operatorLabel,
      action,
      reason: normalizeClientText(bodyResult.body.reason, 1000),
      note: normalizeClientText(bodyResult.body.note, 1000),
    });

    return noStoreJson({ ok: true, result });
  } catch (error) {
    return handleTransitionError(error);
  }
}
