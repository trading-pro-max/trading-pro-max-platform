import "server-only";
import { isAuthorizationBearerEnabled } from "@/lib/auth/cookies";
import { getOperatorKeyMode } from "@/lib/server/operator/access";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";
import { trustedProxyHeadersEnabled } from "./request";

export function getSecurityDiagnosticsProbe(): DiagnosticsProbe {
  const checkedAt = new Date().toISOString();
  const operatorKeyMode = getOperatorKeyMode();

  return {
    key: "security_guardrails",
    label: "Security guardrails",
    status: "ready",
    summary: "API security guardrails active",
    detail: [
      "Cookie session validation is enforced for authenticated routes.",
      `Authorization bearer sessions are ${
        isAuthorizationBearerEnabled() ? "explicitly enabled" : "disabled"
      }.`,
      `Operator review secret mode is ${operatorKeyMode}.`,
      `Trusted proxy headers are ${
        trustedProxyHeadersEnabled() ? "enabled" : "disabled"
      }.`,
      "JSON mutation inputs are bounded, same-origin guarded, and locally rate limited.",
    ].join(" "),
    checkedAt,
  };
}
