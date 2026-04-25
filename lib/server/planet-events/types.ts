import "server-only";

export type PlanetConstructionEventType =
  | "visual_gap_detected"
  | "ux_confusion_detected"
  | "chart_quality_low"
  | "companion_context_missing"
  | "assistant_response_risk"
  | "plan_copy_conflict"
  | "product_truth_conflict"
  | "legal_claim_risk"
  | "guardian_blocked_action"
  | "ministry_report_due"
  | "founder_approval_required"
  | "codex_task_needed"
  | "validation_failed"
  | "build_failed"
  | "lint_failed"
  | "regression_failed"
  | "screenshot_missing"
  | "public_language_leak_detected"
  | "internal_term_leak_detected"
  | "billing_activation_requested"
  | "live_execution_requested"
  | "real_money_requested"
  | "broker_feed_activation_requested"
  | "social_publish_requested"
  | "partnership_claim_requested"
  | "vip_claim_requested"
  | "islamic_certification_claim_requested"
  | "safe_docs_update_needed"
  | "safe_ui_polish_needed"
  | "task_completed"
  | "task_rejected"
  | "task_blocked";

export type PlanetConstructionEventStatus =
  | "observed"
  | "classified"
  | "routed"
  | "waiting_review"
  | "waiting_founder"
  | "ready_for_draft"
  | "drafted"
  | "blocked"
  | "completed"
  | "archived";

export type PlanetConstructionRiskLevel = "low" | "medium" | "high" | "critical";

export type PlanetConstructionSeverity = "info" | "warning" | "error" | "critical";

export type PlanetConstructionReview =
  | "product_truth"
  | "guardian"
  | "legal"
  | "quality"
  | "visual_acceptance"
  | "engineering"
  | "treasury"
  | "security"
  | "founder";

export type PlanetEventOwnership = {
  ownerMinistry: string;
  supportingMinistries: string[];
  requiredReviews: PlanetConstructionReview[];
  escalationTarget: "none" | "founder_command" | "guardian" | "legal" | "security";
  founderVisible: boolean;
  userVisible: boolean;
};

export type PlanetConstructionEvent = PlanetEventOwnership & {
  eventId: string;
  type: PlanetConstructionEventType;
  source: string;
  affectedArea: string;
  affectedFiles: string[];
  userFacingImpact: string;
  founderImpact: string;
  planImpact: string;
  productTruthImpact: string;
  riskLevel: PlanetConstructionRiskLevel;
  severity: PlanetConstructionSeverity;
  suggestedNextAction: string;
  forbiddenScope: string[];
  createdAt: string;
  status: PlanetConstructionEventStatus;
};

export type PlanetConstructionEventInput = {
  type?: PlanetConstructionEventType;
  source?: string;
  title: string;
  description?: string;
  affectedArea?: string;
  affectedFiles?: string[];
};

export type PlanetEventsReadinessSnapshot = {
  checkedAt: string;
  mode: "planet_event_system_readiness";
  eventTypes: PlanetConstructionEventType[];
  statuses: PlanetConstructionEventStatus[];
  sampleEvents: PlanetConstructionEvent[];
  truth: {
    externalExecution: "not_enabled";
    productionActions: "blocked";
    fakeMetrics: "not_allowed";
    secrets: "not_allowed";
  };
};
