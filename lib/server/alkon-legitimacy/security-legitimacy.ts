import { createLegitimacyReview } from "./dimensions";
import type {
  AlkonLegitimacyRequest,
  AlkonSecurityLegitimacyResult,
} from "./types";

export function reviewSecurityLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonSecurityLegitimacyResult {
  const text = `${request.title} ${request.description}`;
  const rawSecret = request.requiresSecrets || /raw secret|show secret|api key|token|password|cvv|private key/i.test(text);
  const weakensAuth = /disable auth|bypass auth|weaken security|skip step-up/i.test(text);
  const sensitive =
    request.actionCategory === "security_setting_change" ||
    request.actionCategory === "secrets_access" ||
    request.actionCategory === "device_authority_change" ||
    request.actionCategory === "emergency_lockdown";
  const outcome = rawSecret || weakensAuth
    ? "black_holed"
    : sensitive
      ? "founder_approval_required"
      : "pass";
  const review = createLegitimacyReview(
    request,
    "security_legitimacy",
    outcome,
    outcome === "black_holed"
      ? "Raw secret access, production secrets, or auth weakening is forbidden."
      : sensitive
        ? "Sensitive authority/security changes require trusted device and step-up readiness."
        : "No secret exposure or auth weakening is requested.",
    {
      evidenceNeeded: ["trusted device readiness", "step-up confirmation readiness", "audit ledger readiness"],
      requiredReview: sensitive || outcome !== "pass" ? ["Security Sovereignty review"] : [],
      safeAlternative: "Show secret status only; never raw values. Keep authority changes as readiness reports.",
      memoryLesson: "Authority cannot be used to expose secrets or weaken the immune system.",
    }
  );

  return {
    ...review,
    trustedDeviceRequired: sensitive,
    stepUpRequired: sensitive,
    passkeyReadinessRequired: sensitive,
    presenceReadinessRequired: sensitive,
    emergencyLockdownRecommended:
      request.actionCategory === "emergency_lockdown" || outcome === "black_holed",
  };
}
