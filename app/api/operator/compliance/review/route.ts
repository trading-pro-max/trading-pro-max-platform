import { NextRequest, NextResponse } from "next/server";
import { getSessionTokenFromRequest } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/service";
import {
  ComplianceTransitionError,
  applyOperatorReviewAction,
  getAccountComplianceSnapshot,
  isOperatorReviewAction,
} from "@/lib/server/compliance";
import { getOperatorAccess } from "@/lib/server/operator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OperatorReviewBody = {
  accountId?: unknown;
  action?: unknown;
  reason?: unknown;
  note?: unknown;
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

function noStoreJson(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readOperatorReviewBody(
  request: NextRequest
): Promise<OperatorReviewBody | null> {
  try {
    return (await request.json()) as OperatorReviewBody;
  } catch {
    return null;
  }
}

function getOptionalText(value: unknown) {
  return typeof value === "string" ? value : null;
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

  const accountId = request.nextUrl.searchParams.get("accountId")?.trim();
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

  const body = await readOperatorReviewBody(request);

  if (
    !body ||
    typeof body.accountId !== "string" ||
    typeof body.action !== "string" ||
    !isOperatorReviewAction(body.action)
  ) {
    return noStoreJson({ ok: false, error: "Unsupported operator action." }, 400);
  }

  try {
    const result = await applyOperatorReviewAction({
      accountId: body.accountId,
      operatorUserId: operatorAccess.operatorUserId,
      operatorLabel: operatorAccess.operatorLabel,
      action: body.action,
      reason: getOptionalText(body.reason),
      note: getOptionalText(body.note),
    });

    return noStoreJson({ ok: true, result });
  } catch (error) {
    return handleTransitionError(error);
  }
}
