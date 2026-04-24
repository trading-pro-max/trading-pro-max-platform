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
import {
  getBrokerConnectorSafetySnapshot,
  getBrokerIntegrationSnapshot,
} from "@/lib/server/connectors/broker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BROKER_ATTEMPT_RATE_LIMIT = {
  maxRequests: 16,
  windowMs: 60 * 1000,
};

type BrokerActivationAttemptBody = {
  action?: unknown;
  environment?: unknown;
  note?: unknown;
};

const BROKER_ATTEMPT_ACTIONS = new Set([
  "request_pilot_activation",
  "verify_configuration",
  "request_live_activation",
]);

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(getSessionTokenFromRequest(request), getRequestContext(request));
}

export async function GET() {
  const checkedAt = new Date().toISOString();
  const integration = getBrokerIntegrationSnapshot(checkedAt);
  const safety = getBrokerConnectorSafetySnapshot(checkedAt);

  return noStoreJson({
    ok: true,
    checkedAt,
    integration,
    safety,
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
    buildRateLimitKey(["broker_activation_attempt", session.session.id]),
    BROKER_ATTEMPT_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Broker activation attempt rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<BrokerActivationAttemptBody>(request, {
    maxBytes: 4096,
  });
  if (!bodyResult.ok) return bodyResult.response;

  const action = normalizeClientText(bodyResult.body.action, 64);
  const requestedEnvironment =
    normalizeClientText(bodyResult.body.environment, 32) ?? "sandbox";
  const environment =
    requestedEnvironment === "live" ? "live" : ("sandbox" as const);

  if (!action || !BROKER_ATTEMPT_ACTIONS.has(action)) {
    return noStoreJson(
      { ok: false, error: "Unsupported broker activation attempt." },
      400
    );
  }

  const checkedAt = new Date().toISOString();
  const integration = getBrokerIntegrationSnapshot(checkedAt);
  const safety = getBrokerConnectorSafetySnapshot(checkedAt);
  const liveRequest = action === "request_live_activation" || environment === "live";
  const blockedReasons = [
    ...integration.activationPolicy.blockedReasons,
    ...(liveRequest ? ["live_broker_activation_request_rejected"] : []),
    "no_live_order_route_enabled",
  ];
  const canRecordAsGuarded =
    !liveRequest &&
    integration.pilotReadiness.canEnterSandboxPilot &&
    action !== "request_live_activation";
  const audit = await recordControlledActivationAttempt({
    session,
    domain: "broker",
    action,
    environment,
    result: canRecordAsGuarded ? "recorded_guarded" : "recorded_blocked",
    note: normalizeClientText(bodyResult.body.note, 600),
    blockedReasons,
  });

  return noStoreJson({
    ok: true,
    authenticated: true,
    action,
    reason: "broker_activation_attempt_recorded",
    audit,
    activation: {
      result: audit.result,
      requestedEnvironment: environment,
      canEnterSandboxPilot: integration.pilotReadiness.canEnterSandboxPilot,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      safeFailureState: "no_order_route_enabled",
      blockedReasons,
    },
    integration,
    safety,
  });
}
