import "server-only";

import { resolvePlanetEventOwnership } from "./ownership";
import type {
  PlanetConstructionEvent,
  PlanetConstructionEventStatus,
  PlanetConstructionEventType,
  PlanetConstructionRiskLevel,
  PlanetConstructionSeverity,
} from "./types";

export const planetConstructionEventTypes: PlanetConstructionEventType[] = [
  "visual_gap_detected",
  "ux_confusion_detected",
  "chart_quality_low",
  "companion_context_missing",
  "assistant_response_risk",
  "plan_copy_conflict",
  "product_truth_conflict",
  "legal_claim_risk",
  "guardian_blocked_action",
  "ministry_report_due",
  "founder_approval_required",
  "codex_task_needed",
  "validation_failed",
  "build_failed",
  "lint_failed",
  "regression_failed",
  "screenshot_missing",
  "public_language_leak_detected",
  "internal_term_leak_detected",
  "billing_activation_requested",
  "live_execution_requested",
  "real_money_requested",
  "broker_feed_activation_requested",
  "social_publish_requested",
  "partnership_claim_requested",
  "vip_claim_requested",
  "islamic_certification_claim_requested",
  "safe_docs_update_needed",
  "safe_ui_polish_needed",
  "task_completed",
  "task_rejected",
  "task_blocked",
];

export const planetConstructionEventStatuses: PlanetConstructionEventStatus[] = [
  "observed",
  "classified",
  "routed",
  "waiting_review",
  "waiting_founder",
  "ready_for_draft",
  "drafted",
  "blocked",
  "completed",
  "archived",
];

export const constructionForbiddenScope = [
  "production secrets",
  "live execution",
  "real-money routing",
  "broker/feed activation",
  "billing activation",
  "public launch",
  "social publishing",
  "fake users/revenue/metrics",
  "fake Pro/VIP/Institutional activation",
  "fake Islamic/Sharia certification",
  "guaranteed profit or win-rate claims",
];

function eventStatusForRisk(
  riskLevel: PlanetConstructionRiskLevel
): PlanetConstructionEventStatus {
  if (riskLevel === "critical") return "blocked";
  if (riskLevel === "high") return "waiting_founder";
  if (riskLevel === "medium") return "waiting_review";
  return "ready_for_draft";
}

function severityForRisk(
  riskLevel: PlanetConstructionRiskLevel
): PlanetConstructionSeverity {
  if (riskLevel === "critical") return "critical";
  if (riskLevel === "high") return "error";
  if (riskLevel === "medium") return "warning";
  return "info";
}

export function createPlanetConstructionEvent(input: {
  type: PlanetConstructionEventType;
  source: string;
  affectedArea: string;
  affectedFiles?: string[];
  riskLevel: PlanetConstructionRiskLevel;
  userFacingImpact: string;
  founderImpact: string;
  planImpact: string;
  productTruthImpact: string;
  suggestedNextAction: string;
  createdAt?: string;
}): PlanetConstructionEvent {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const ownership = resolvePlanetEventOwnership(input.type);

  return {
    eventId: `evt_${input.type}_${createdAt.replace(/\D/g, "").slice(0, 14)}`,
    type: input.type,
    source: input.source,
    affectedArea: input.affectedArea,
    affectedFiles: input.affectedFiles ?? [],
    userFacingImpact: input.userFacingImpact,
    founderImpact: input.founderImpact,
    planImpact: input.planImpact,
    productTruthImpact: input.productTruthImpact,
    riskLevel: input.riskLevel,
    severity: severityForRisk(input.riskLevel),
    ...ownership,
    suggestedNextAction: input.suggestedNextAction,
    forbiddenScope: constructionForbiddenScope,
    createdAt,
    status: eventStatusForRisk(input.riskLevel),
  };
}
