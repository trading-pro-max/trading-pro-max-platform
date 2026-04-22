import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import {
  getWorkspacePreferenceSnapshotForAuthenticatedSession,
  upsertWorkspacePreferenceSnapshot,
} from "@/lib/server/preferences/state";
import type {
  PlatformPreferenceSnapshot,
  PreferencesRoutePayload,
} from "@/modules/shell/types/platform-state";
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

type PreferenceMutationBody = {
  preferences?: Partial<PlatformPreferenceSnapshot> | null;
};

const PREFERENCE_SYNC_RATE_LIMIT = {
  maxRequests: 120,
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

  const preferences = await getWorkspacePreferenceSnapshotForAuthenticatedSession(
    session
  );

  return noStoreJson(
    {
      ok: true,
      authenticated: true,
      preferences,
    } satisfies PreferencesRoutePayload
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
    buildRateLimitKey(["preferences", session.session.id]),
    PREFERENCE_SYNC_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Preference sync rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<PreferenceMutationBody>(request, {
    maxBytes: 16 * 1024,
  });
  if (!bodyResult.ok) return bodyResult.response;

  if (bodyResult.body.preferences === undefined) {
    return noStoreJson(
      { ok: false, error: "Unsupported preference payload." },
      400
    );
  }

  const result = await upsertWorkspacePreferenceSnapshot({
    userId: session.user.id,
    accountId: session.account.id,
    preferences: bodyResult.body.preferences,
  });

  return noStoreJson(
    {
      ok: true,
      authenticated: true,
      preferences: result.preferences,
      updatedAt: result.updatedAt,
    } satisfies PreferencesRoutePayload
  );
}
