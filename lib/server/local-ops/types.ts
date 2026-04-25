import "server-only";

export type LocalOperationMode = "local_closed_universe";

export type LocalDayCycleStageId =
  | "wake_start"
  | "build_check"
  | "runtime_start"
  | "public_entry_review"
  | "free_demo_journey_review"
  | "workstation_review"
  | "chart_review"
  | "execution_paper_review"
  | "tpm_assistant_review"
  | "why_blocked_review"
  | "journal_coach_review"
  | "settings_review"
  | "diagnostics_review"
  | "product_truth_review"
  | "visual_acceptance_review"
  | "founder_decision"
  | "build_task_creation"
  | "validation"
  | "git_clean_push_check"
  | "end_of_day_report"
  | "sleep_archive";

export type LocalDayCycleStage = {
  id: LocalDayCycleStageId;
  order: number;
  name: string;
  purpose: string;
  checks: string[];
  passCriteria: string[];
  failCriteria: string[];
  output: string;
  nextAction: string;
};

export type LocalReadinessState =
  | "not_started"
  | "day_one_candidate"
  | "local_day_passed"
  | "repeated_local_days"
  | "internal_beta_candidate"
  | "staging_discussion_candidate"
  | "launch_readiness_discussion_candidate"
  | "blocked";

export type LocalReadinessThreshold = {
  successfulLocalDays: number;
  state: LocalReadinessState;
  meaning: string;
  automaticLaunch: false;
  founderApprovalRequired: true;
};

export type LocalDigitalTwinProfileId =
  | "guest_visitor"
  | "free_demo_user"
  | "pro_interested_user"
  | "vip_interested_user"
  | "institutional_future_evaluator"
  | "arabic_rtl_user"
  | "light_theme_user"
  | "blocked_state_confused_user"
  | "founder_reviewer";

export type LocalDigitalTwinProfile = {
  id: LocalDigitalTwinProfileId;
  label: string;
  journey: string[];
  visibleSurfaces: string[];
  expectedConfusionPoints: string[];
  passCriteria: string[];
  failureSignals: string[];
  safeNextActions: string[];
  testPersonaOnly: true;
};

export type FounderAcceptanceState =
  | "accepted"
  | "needs_polish"
  | "confusing"
  | "too_much"
  | "missing"
  | "blocked_by_design"
  | "future";

export type FounderAcceptanceCategory =
  | "public_entry"
  | "workstation"
  | "chart"
  | "execution"
  | "assistant"
  | "journal_coach"
  | "settings"
  | "diagnostics"
  | "plan_clarity"
  | "visual_identity"
  | "local_operation";

export type FounderAcceptanceRecord = {
  category: FounderAcceptanceCategory;
  state: FounderAcceptanceState;
  note: string;
  safeNextAction: string;
};

export type LocalOperationsReport = {
  checkedAt: string;
  mode: "local_operations_report";
  date: string;
  localDayNumber: number;
  readinessState: LocalReadinessState;
  completedStages: LocalDayCycleStageId[];
  failedStages: LocalDayCycleStageId[];
  visualAcceptance: "not_started" | "needs_human_acceptance" | "accepted";
  productTruthStatus: "local_truth_visible" | "blocked_truth_required";
  assistantStatus: "ready_for_local_review";
  journalCoachStatus: "ready_for_local_review";
  diagnosticsStatus: "ready_for_local_review";
  gitStatus: "not_evaluated_by_snapshot" | "clean" | "dirty";
  validationStatus: "not_run_for_today" | "passed" | "failed";
  blockers: string[];
  nextActions: string[];
  founderDecisionNeeded: boolean;
  launchForbiddenReminder: string;
  truth: {
    localOnly: true;
    paperSafe: true;
    productionAction: "blocked";
    launchAction: "blocked";
    billingAction: "blocked";
    brokerFeedAction: "blocked";
    realMoneyAction: "blocked";
    socialPublishingAction: "blocked";
    fakeUsersMetricsRevenue: "not_allowed";
  };
};

export type LocalDayOneReadinessStatus =
  | "pass"
  | "partial"
  | "blocker"
  | "planned"
  | "blocked_by_design"
  | "needs_ahmad_review";

export type LocalDayOneGateStatus =
  | "local_operations_ready"
  | "local_operations_partially_ready"
  | "not_ready"
  | "global_launch_not_evaluated";

export type LocalDayOneReadinessCategoryId =
  | "runtime_readiness"
  | "public_entry_readiness"
  | "trading_workstation_readiness"
  | "chart_readiness"
  | "paper_execution_readiness"
  | "tpm_assistant_readiness"
  | "why_blocked_readiness"
  | "journal_coach_readiness"
  | "settings_readiness"
  | "diagnostics_readiness"
  | "plan_language_readiness"
  | "product_truth_readiness"
  | "founder_command_privacy_readiness"
  | "local_operations_protocol_readiness"
  | "product_memory_readiness"
  | "visual_acceptance_readiness"
  | "security_safety_readiness"
  | "git_validation_readiness";

export type LocalDayOneReadinessCategory = {
  id: LocalDayOneReadinessCategoryId;
  label: string;
  status: LocalDayOneReadinessStatus;
  reason: string;
  evidence: string[];
  nextAction: string;
  blocker: string | null;
  humanAcceptanceNeeded: boolean;
};

export type LocalDayOneReadinessSummary = {
  total: number;
  pass: number;
  partial: number;
  blocker: number;
  planned: number;
  blockedByDesign: number;
  needsAhmadReview: number;
};

export type LocalDayOneReadinessSnapshot = {
  checkedAt: string;
  mode: "local_day_one_acceptance_gate";
  operationMode: "closed_local_product_review";
  gateStatus: LocalDayOneGateStatus;
  readyToStartLocalDayOne: boolean;
  ahmadHumanReviewRequired: true;
  globalLaunchEvaluation: "not_evaluated";
  categories: LocalDayOneReadinessCategory[];
  summary: LocalDayOneReadinessSummary;
  commands: string[];
  routes: string[];
  reviewChecklist: string[];
  endOfDayChecklist: string[];
  blockers: string[];
  launchForbiddenReminder: string;
  truth: {
    localOnly: true;
    paperSafe: true;
    productionActive: false;
    billingActive: false;
    brokerFeedActive: false;
    liveExecutionActive: false;
    realMoneyActive: false;
    publicLaunchActive: false;
    socialPublishingActive: false;
    fakeUsersRevenueMetrics: false;
    globalLaunchReadinessClaimed: false;
  };
};

export type LocalOperationsFinalReportSnapshot = {
  checkedAt: string;
  mode: "local_operations_final_report";
  readinessState: LocalDayOneGateStatus;
  canStartLocalDayOne: boolean;
  ahmadHumanVisualReviewRequired: true;
  complete: string[];
  partial: string[];
  planned: string[];
  blockedByDesign: string[];
  excludedFromLocalOperations: string[];
  mustWaitForRealActivation: string[];
  ahmadMustReviewVisually: string[];
  blockers: string[];
  nextSafeActions: string[];
  launchForbiddenReminder: string;
  truth: LocalDayOneReadinessSnapshot["truth"];
};
