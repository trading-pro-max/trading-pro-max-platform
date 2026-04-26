import { createLegitimacyReview } from "./dimensions";
import type {
  AlkonFounderResponsibilityResult,
  AlkonLegitimacyRequest,
} from "./types";

export function reviewFounderResponsibility(
  request: AlkonLegitimacyRequest
): AlkonFounderResponsibilityResult {
  const sensitive = [
    "treasury_payment",
    "founder_reimbursement",
    "tax_reserve_adjustment",
    "budget_change",
    "ad_spend",
    "launch_gate_change",
    "production_activation",
    "billing_activation",
    "broker_feed_activation",
    "live_execution_activation",
    "real_money_activation",
    "security_setting_change",
    "secrets_access",
    "cleanup_removal",
    "legal_claim",
    "partnership_claim",
    "user_data_change",
    "device_authority_change",
    "emergency_lockdown",
  ].includes(request.actionCategory);
  const review = createLegitimacyReview(
    request,
    "founder_responsibility",
    sensitive ? "founder_approval_required" : "pass",
    sensitive
      ? "Action touches money, reputation, security, launch, legal status, user trust, data, or long-term direction."
      : "Action does not require final Founder decision beyond normal review.",
    {
      requiredReview: sensitive ? ["Founder final decision"] : [],
      safeAlternative: "Keep the action as draft/report-only until Ahmad explicitly approves.",
      memoryLesson: "Founder authority must carry explicit responsibility for sensitive decisions.",
    }
  );

  return {
    ...review,
    founderDecisionRequired: sensitive,
    decisionSummary: `${request.actionCategory} on ${request.affectedSurface}`,
    confirmationPhraseRequired: sensitive
      ? "I accept Founder responsibility for this reviewed action."
      : "No special confirmation required.",
    suggestedReasonPrompt:
      "Why does this deserve to exist now, and what Product Truth, safety, finance, legal, timing, reputation, and rollback evidence supports it?",
    auditNote: "Audit record is readiness-only and contains no secrets, card/bank data, or private sensitive values.",
  };
}
