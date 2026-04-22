import { NextRequest, NextResponse } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import {
  acceptDisclosure,
  getAccountComplianceSnapshotForAuthenticatedSession,
  isAccountDisclosureKey,
} from "@/lib/server/compliance/state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ComplianceActionBody = {
  action?: unknown;
  key?: unknown;
  version?: unknown;
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

async function readComplianceActionBody(
  request: NextRequest
): Promise<ComplianceActionBody | null> {
  try {
    return (await request.json()) as ComplianceActionBody;
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

  const compliance = await getAccountComplianceSnapshotForAuthenticatedSession(
    session
  );

  return NextResponse.json(
    { ok: true, compliance },
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

  const body = await readComplianceActionBody(request);

  if (
    !body ||
    body.action !== "accept_disclosure" ||
    typeof body.key !== "string" ||
    !isAccountDisclosureKey(body.key) ||
    (body.version !== undefined && typeof body.version !== "string")
  ) {
    return NextResponse.json(
      { ok: false, error: "Unsupported compliance action." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  await acceptDisclosure({
    accountId: session.account.id,
    acceptedByUserId: session.user.id,
    key: body.key,
    version: body.version,
  });

  const compliance = await getAccountComplianceSnapshotForAuthenticatedSession(
    session
  );

  return NextResponse.json(
    { ok: true, compliance },
    { headers: { "Cache-Control": "no-store" } }
  );
}
