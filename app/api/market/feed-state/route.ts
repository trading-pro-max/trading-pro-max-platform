import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import { recordControlledActivationAttempt } from "@/lib/server/integrations";
import {
  buildRateLimitKey,
  checkRateLimit,
  getRequestContext,
  noStoreJson,
  normalizeClientText,
  readJsonBody,
  rejectCrossOriginMutation,
} from "@/lib/server/security";
import { getMarketFeedArchitectureSnapshot } from "@/lib/server/market-data/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FEED_ATTEMPT_RATE_LIMIT = {
  maxRequests: 20,
  windowMs: 60 * 1000,
};

type FeedActivationAttemptBody = {
  action?: unknown;
  mode?: unknown;
  note?: unknown;
};

const FEED_ATTEMPT_ACTIONS = new Set([
  "request_external_activation",
  "verify_configuration",
  "request_fallback_restore",
]);

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(getSessionTokenFromRequest(request), getRequestContext(request));
}

export async function GET() {
  const snapshot = getMarketFeedArchitectureSnapshot();

  return noStoreJson({
    ok: true,
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
    buildRateLimitKey(["feed_activation_attempt", session.session.id]),
    FEED_ATTEMPT_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Market feed activation attempt rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<FeedActivationAttemptBody>(request, {
    maxBytes: 4096,
  });
  if (!bodyResult.ok) return bodyResult.response;

  const action = normalizeClientText(bodyResult.body.action, 64);
  const requestedMode = normalizeClientText(bodyResult.body.mode, 32) ?? "external_live";

  if (!action || !FEED_ATTEMPT_ACTIONS.has(action)) {
    return noStoreJson(
      { ok: false, error: "Unsupported market feed activation attempt." },
      400
    );
  }

  const snapshot = getMarketFeedArchitectureSnapshot();
  const fallbackRestore = action === "request_fallback_restore" || requestedMode === "fallback";
  const blockedReasons = fallbackRestore
    ? ["fallback_adapter_already_authoritative"]
    : [
        ...snapshot.activationPolicy.blockedReasons,
        "external_feed_activation_request_recorded_guarded",
      ];
  const audit = await recordControlledActivationAttempt({
    session,
    domain: "market_feed",
    action,
    environment: fallbackRestore ? "fallback" : "live",
    result: fallbackRestore ? "fallback_authoritative" : "recorded_blocked",
    note: normalizeClientText(bodyResult.body.note, 600),
    blockedReasons,
  });

  return noStoreJson({
    ok: true,
    authenticated: true,
    action,
    reason: "market_feed_activation_attempt_recorded",
    audit,
    activation: {
      result: audit.result,
      requestedMode: fallbackRestore ? "fallback" : "external_live",
      servingAdapter: snapshot.fallbackDriver.key,
      externalFeedActive: false,
      liveExecution: "blocked",
      safeFailureState: "fallback_remains_authoritative",
      blockedReasons,
    },
    snapshot,
  });
}
