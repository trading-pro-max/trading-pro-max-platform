import { createLegitimacyReview } from "./dimensions";
import type {
  AlkonLegitimacyRequest,
  AlkonReversibilityLegitimacyResult,
  AlkonRollbackProfile,
} from "./types";

export function reviewReversibilityLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonReversibilityLegitimacyResult {
  const highRisk = ["high", "critical", "black_hole"].includes(request.riskHint ?? "low");
  const irreversibleCategory = [
    "production_activation",
    "billing_activation",
    "broker_feed_activation",
    "live_execution_activation",
    "real_money_activation",
    "social_publishing",
    "treasury_payment",
    "security_setting_change",
    "cleanup_removal",
  ].includes(request.actionCategory);
  const missingRollback = !request.hasRollback && (highRisk || irreversibleCategory);
  const outcome = missingRollback
    ? irreversibleCategory
      ? "blocked"
      : "founder_approval_required"
    : "pass";
  const rollbackProfile: AlkonRollbackProfile = missingRollback
    ? irreversibleCategory
      ? "irreversible_blocked"
      : "irreversible_review_required"
    : request.hasRollback
      ? "reversible_with_backup"
      : "fully_reversible";
  const review = createLegitimacyReview(
    request,
    "reversibility_legitimacy",
    outcome,
    outcome === "pass"
      ? "Rollback/reversibility is sufficient for this action."
      : "High-risk or irreversible action lacks rollback evidence.",
    {
      evidenceNeeded: ["rollback plan", "backup", "audit proof", "incident plan"],
      requiredReview: outcome === "pass" ? [] : ["Rollback review", "Founder review"],
      safeAlternative: "Create rollback plan and keep the action draft-only until undo path exists.",
      memoryLesson: "High-risk actions require rollback before legitimacy.",
    }
  );

  return {
    ...review,
    rollbackProfile,
    backupRequired: missingRollback,
    incidentPlanRequired: irreversibleCategory,
  };
}
