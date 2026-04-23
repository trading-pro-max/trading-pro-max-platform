import { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import type { WorkspaceDepthState } from "@/modules/shell/types/platform-state";
import {
  getWorkspaceDepthStateSnapshot,
  upsertWorkspaceDepthState,
} from "@/lib/server/workspace";
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

type WorkspaceDepthMutationBody = {
  workspaceDepth?: Partial<WorkspaceDepthState> | null;
};

const WORKSPACE_DEPTH_RATE_LIMIT = {
  maxRequests: 90,
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

  const snapshot = await getWorkspaceDepthStateSnapshot(session.account.id);

  return noStoreJson({
    ok: true,
    authenticated: true,
    workspaceDepth: snapshot.workspaceDepth,
    source: snapshot.source,
    updatedAt: snapshot.updatedAt,
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
    buildRateLimitKey(["workspace_depth", session.session.id]),
    WORKSPACE_DEPTH_RATE_LIMIT
  );

  if (!limit.allowed) {
    return noStoreJson(
      { ok: false, error: "Workspace depth sync rate limit exceeded." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const bodyResult = await readJsonBody<WorkspaceDepthMutationBody>(request, {
    maxBytes: 16 * 1024,
  });
  if (!bodyResult.ok) return bodyResult.response;

  if (bodyResult.body.workspaceDepth === undefined) {
    return noStoreJson(
      { ok: false, error: "Unsupported workspace depth payload." },
      400
    );
  }

  const snapshot = await upsertWorkspaceDepthState({
    userId: session.user.id,
    accountId: session.account.id,
    workspaceDepth: bodyResult.body.workspaceDepth,
  });

  return noStoreJson({
    ok: true,
    authenticated: true,
    workspaceDepth: snapshot.workspaceDepth,
    source: snapshot.source,
    updatedAt: snapshot.updatedAt,
  });
}
