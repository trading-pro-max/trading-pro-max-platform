import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import {
  acceptDisclosure,
  getAccountComplianceSnapshotForAuthenticatedSession,
  isAccountDisclosureKey,
} from "@/lib/server/compliance/state";
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

type ComplianceActionBody = {
  action?: unknown;
  key?: unknown;
  version?: unknown;
};

const COMPLIANCE_MUTATION_RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 1000,
};

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(getSessionTokenFromRequest(request), getRequestContext(request));
}

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson(
      { ok: false, authenticated: false },
      401
    );
  }

  const compliance = await getAccountComplianceSnapshotForAuthenticatedSession(
    session
  );

  return noStoreJson(
    { ok: true, compliance },
  );
}

export async function POST(request: NextRequest) {
  const originFailure = rejectCrossOriginMutation(request);
  if (originFailure) return originFailure;

  const session = await getAuthenticatedSession(request);

  if (!session) {
    return noStoreJson(
      { ok: false, authenticated: false },
      401
    );
  }

  const limit = checkRateLimit(
    buildRateLimitKey(["account_compliance", session.session.id]),
    COMPLIANCE_MUTATION_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Compliance action rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<ComplianceActionBody>(request, {
    maxBytes: 4096,
  });
  if (!bodyResult.ok) return bodyResult.response;

  const action = normalizeClientText(bodyResult.body.action, 64);
  const key = normalizeClientText(bodyResult.body.key, 64);
  const version = normalizeClientText(bodyResult.body.version, 64);

  if (
    action !== "accept_disclosure" ||
    !key ||
    !isAccountDisclosureKey(key) ||
    (bodyResult.body.version !== undefined && !version)
  ) {
    return noStoreJson(
      { ok: false, error: "Unsupported compliance action." },
      400
    );
  }

  await acceptDisclosure({
    accountId: session.account.id,
    acceptedByUserId: session.user.id,
    key,
    version: version ?? undefined,
  });

  const compliance = await getAccountComplianceSnapshotForAuthenticatedSession(
    session
  );

  return noStoreJson(
    { ok: true, compliance },
  );
}
