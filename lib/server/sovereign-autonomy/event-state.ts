import "server-only";

import type {
  FounderIdeaSource,
  SovereignAffectedWorld,
  SovereignEvent,
  SovereignEventStatus,
  SovereignEventType,
  SovereignReviewArea,
  SovereignRiskLevel,
  SovereignSeverity,
} from "./types";

export const sovereignEventTypes: SovereignEventType[] = [
  "founder_idea_received",
  "visual_gap_detected",
  "logo_rejection_detected",
  "chart_quality_low",
  "public_user_confusion",
  "public_navigation_gap",
  "apps_platforms_gap",
  "support_gap",
  "market_readiness_gap",
  "assistant_behavior_gap",
  "journal_coach_gap",
  "product_truth_conflict",
  "internal_language_leak",
  "public_private_boundary_risk",
  "secrets_risk",
  "security_risk",
  "codex_task_needed",
  "validation_failed",
  "build_failed",
  "screenshot_missing",
  "local_day_report_needed",
  "billing_requested",
  "live_execution_requested",
  "broker_feed_requested",
  "real_money_requested",
  "social_publish_requested",
  "launch_requested",
  "world_interface_request",
  "safe_docs_update_needed",
  "safe_test_update_needed",
  "safe_copy_cleanup_needed",
];

export const sovereignEventStatuses: SovereignEventStatus[] = [
  "observed",
  "classified",
  "routed",
  "waiting_review",
  "waiting_founder",
  "draft_ready",
  "permit_pending",
  "permitted",
  "blocked",
  "result_pending",
  "completed",
  "archived",
];

export const blockedSovereignCategories = new Set<SovereignEventType>([
  "billing_requested",
  "live_execution_requested",
  "broker_feed_requested",
  "real_money_requested",
  "social_publish_requested",
  "launch_requested",
  "secrets_risk",
  "security_risk",
  "product_truth_conflict",
  "internal_language_leak",
  "public_private_boundary_risk",
]);

export const sovereignForbiddenScope = [
  "production secrets",
  "live execution",
  "real money",
  "billing activation",
  "broker/feed activation",
  "public launch",
  "social publishing",
  "fake users/revenue/metrics",
  "fake Pro/VIP/Institutional activation",
  "fake Swiss legal/company status",
  "fake Islamic/Sharia certification",
  "guaranteed profit or win-rate claims",
  "external offensive actions",
  "uncontrolled execution",
];

function severityForRisk(riskLevel: SovereignRiskLevel): SovereignSeverity {
  if (riskLevel === "critical") return "critical";
  if (riskLevel === "high") return "error";
  if (riskLevel === "medium") return "warning";
  return "info";
}

export function eventStatusForRisk(
  type: SovereignEventType,
  riskLevel: SovereignRiskLevel
): SovereignEventStatus {
  if (blockedSovereignCategories.has(type) || riskLevel === "critical") {
    return "blocked";
  }

  if (riskLevel === "high") return "waiting_founder";
  if (riskLevel === "medium") return "waiting_review";

  return "draft_ready";
}

export function createSovereignEvent(input: {
  type: SovereignEventType;
  title: string;
  summary: string;
  source: FounderIdeaSource | "system_snapshot" | "result_tribunal";
  affectedWorld: SovereignAffectedWorld;
  affectedSurface: string;
  affectedFiles?: string[];
  riskLevel: SovereignRiskLevel;
  productTruthImpact: string;
  publicUserImpact: string;
  founderImpact: string;
  requiredReviews: SovereignReviewArea[];
  suggestedOwner: SovereignEvent["suggestedOwner"];
  suggestedNextAction: string;
  createdAt?: string;
}): SovereignEvent {
  const createdAt = input.createdAt ?? new Date().toISOString();

  return {
    eventId: `evt_${input.type}_${createdAt.replace(/\D/g, "").slice(0, 14)}`,
    type: input.type,
    title: input.title,
    summary: input.summary,
    source: input.source,
    affectedWorld: input.affectedWorld,
    affectedSurface: input.affectedSurface,
    affectedFiles: input.affectedFiles ?? [],
    riskLevel: input.riskLevel,
    severity: severityForRisk(input.riskLevel),
    productTruthImpact: input.productTruthImpact,
    publicUserImpact: input.publicUserImpact,
    founderImpact: input.founderImpact,
    requiredReviews: input.requiredReviews,
    suggestedOwner: input.suggestedOwner,
    suggestedNextAction: input.suggestedNextAction,
    status: eventStatusForRisk(input.type, input.riskLevel),
    createdAt,
  };
}
