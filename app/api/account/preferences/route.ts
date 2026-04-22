import { NextRequest, NextResponse } from "next/server";
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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PreferenceMutationBody = {
  preferences?: Partial<PlatformPreferenceSnapshot> | null;
};

function getRequestIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || null;

  return request.headers.get("x-real-ip");
}

async function getAuthenticatedSession(request: NextRequest) {
  return validateSession(getSessionTokenFromRequest(request), {
    userAgent: request.headers.get("user-agent"),
    ipAddress: getRequestIp(request),
  });
}

async function readMutationBody(request: NextRequest) {
  try {
    return (await request.json()) as PreferenceMutationBody;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedSession(request);

  if (!session) {
    return NextResponse.json(
      { ok: false, authenticated: false },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const preferences = await getWorkspacePreferenceSnapshotForAuthenticatedSession(
    session
  );

  return NextResponse.json(
    {
      ok: true,
      authenticated: true,
      preferences,
    } satisfies PreferencesRoutePayload,
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: NextRequest) {
  const session = await getAuthenticatedSession(request);

  if (!session) {
    return NextResponse.json(
      { ok: false, authenticated: false },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const body = await readMutationBody(request);

  if (!body || body.preferences === undefined) {
    return NextResponse.json(
      { ok: false, error: "Unsupported preference payload." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const result = await upsertWorkspacePreferenceSnapshot({
    userId: session.user.id,
    accountId: session.account.id,
    preferences: body.preferences,
  });

  return NextResponse.json(
    {
      ok: true,
      authenticated: true,
      preferences: result.preferences,
      updatedAt: result.updatedAt,
    } satisfies PreferencesRoutePayload,
    { headers: { "Cache-Control": "no-store" } }
  );
}
