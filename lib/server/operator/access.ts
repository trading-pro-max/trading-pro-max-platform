import "server-only";
import { timingSafeEqual } from "node:crypto";
import type { AuthenticatedSession } from "../../auth/service";

export type OperatorAccessResult =
  | {
      ok: true;
      operatorUserId: string;
      operatorLabel: string;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

const LOCAL_OPERATOR_KEY = "local-operator-review-key";

function getExpectedOperatorKey() {
  if (process.env.TPM_OPERATOR_KEY) return process.env.TPM_OPERATOR_KEY;
  if (process.env.NODE_ENV !== "production") return LOCAL_OPERATOR_KEY;

  return null;
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function getOperatorAccess(
  request: Request,
  session: AuthenticatedSession
): OperatorAccessResult {
  if (session.user.role !== "operator") {
    return {
      ok: false,
      status: 403,
      error: "Operator review requires an operator account.",
    };
  }

  const expectedKey = getExpectedOperatorKey();

  if (!expectedKey) {
    return {
      ok: false,
      status: 503,
      error: "Operator review is not configured.",
    };
  }

  const providedKey = request.headers.get("x-tpm-operator-key")?.trim();

  if (!providedKey || !safeCompare(providedKey, expectedKey)) {
    return {
      ok: false,
      status: 403,
      error: "Operator review access denied.",
    };
  }

  return {
    ok: true,
    operatorUserId: session.user.id,
    operatorLabel:
      request.headers.get("x-tpm-operator-label")?.trim() ||
      session.user.email,
  };
}
