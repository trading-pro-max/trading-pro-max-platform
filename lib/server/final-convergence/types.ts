import "server-only";

export type FinalConvergenceLayerType =
  | "public_user_layer"
  | "private_founder_layer"
  | "invisible_operating_layer"
  | "security_layer"
  | "product_truth_layer"
  | "automation_layer"
  | "memory_layer"
  | "environment_layer"
  | "assistant_layer"
  | "market_layer"
  | "launch_readiness_layer";

export type FinalConvergenceWorld =
  | "public_earth_world"
  | "private_alkon_world"
  | "invisible_operating_layer";

export type FinalConvergenceRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type FinalConvergenceStatus =
  | "not_ready"
  | "partial"
  | "planned"
  | "ready_with_notes"
  | "locally_ready"
  | "blocked";

export type LayerUpgradeDecision =
  | "auto_document_only"
  | "draft_codex_task"
  | "review_required"
  | "founder_approval_required"
  | "blocked"
  | "future";

export type AutomationLevel =
  | "level_0_blocked"
  | "level_1_detect"
  | "level_2_draft"
  | "level_3_0_codex_ready_task_draft_only"
  | "level_3_1_docs_tests_submission_readiness_only"
  | "level_4_future_low_risk_auto_fix_disabled"
  | "level_5_forbidden_uncontrolled_autopilot";

export type FinalConvergenceLayer = {
  layerId: string;
  type: FinalConvergenceLayerType;
  name: string;
  purpose: string;
  world: FinalConvergenceWorld;
  owner: string;
  dependencies: string[];
  outputs: string[];
  riskLevel: FinalConvergenceRiskLevel;
  publicVisible: boolean;
  founderVisible: true;
  validationRequired: string[];
  memoryRule: string;
  nextPossibleLayers: string[];
  blockedEscalations: string[];
  convergenceStatus: FinalConvergenceStatus;
};

export type LayerGrowthProposal = {
  proposalId: string;
  title: string;
  sourceLayerId: string;
  targetLayerId: string;
  purpose: string;
  decision: LayerUpgradeDecision;
  riskLevel: FinalConvergenceRiskLevel;
  owner: string;
  validationRequired: string[];
  memoryRule: string;
  founderReviewRequired: boolean;
  blockedReason: string | null;
  safeNextAction: string;
  taskDraft: {
    taskPassportRequired: true;
    codexPromptDraftAllowed: boolean;
    noExecution: true;
    noSecrets: true;
  };
};

export type LayerGrowthEngineSnapshot = {
  status: "ready";
  inspectedLayers: number;
  weakLayers: string[];
  missingDependencies: Array<{
    layerId: string;
    dependency: string;
    action: LayerUpgradeDecision;
  }>;
  repeatedGaps: string[];
  proposals: LayerGrowthProposal[];
  blockedEscalations: string[];
  storedLessons: string[];
};

export type ConvergenceScoreArea =
  | "public_world_completeness"
  | "workspace_readiness"
  | "assistant_readiness"
  | "alkon_readiness"
  | "environment_readiness"
  | "codex_governance_readiness"
  | "memory_readiness"
  | "security_secrets_readiness"
  | "public_private_separation"
  | "launch_readiness"
  | "code_cleanliness_readiness"
  | "visual_acceptance_readiness";

export type ConvergenceScoreItem = {
  area: ConvergenceScoreArea;
  score: number;
  status: FinalConvergenceStatus;
  evidence: string;
  nextSafeAction: string;
};

export type ConvergenceScoreSnapshot = {
  score: number;
  status: FinalConvergenceStatus;
  items: ConvergenceScoreItem[];
  blockers: string[];
  nextSafeActions: string[];
  founderReviewNeeded: string[];
};

export type AutomationGovernorSnapshot = {
  status: "ready";
  allowedLevels: AutomationLevel[];
  disabledLevels: AutomationLevel[];
  currentMaximumLevel: "level_3_1_docs_tests_submission_readiness_only";
  currentAllowed: Array<{
    level: AutomationLevel;
    allowed: boolean;
    boundary: string;
  }>;
  requiresFounderApproval: string[];
  blockedActions: string[];
  truth: {
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noSecrets: true;
    noRealWorldActivation: true;
    noPublicLaunch: true;
    noBillingLiveBrokerSocial: true;
    level4DisabledNow: true;
    level5Forbidden: true;
  };
};

export type FinalConvergenceSnapshot = {
  checkedAt: string;
  mode: "tpm_final_convergence_governed_layer_growth";
  status: FinalConvergenceStatus;
  founderOnly: true;
  publicExposure: false;
  layerRegistryStatus: "ready";
  convergenceScore: ConvergenceScoreSnapshot;
  layerGrowth: LayerGrowthEngineSnapshot;
  automationGovernor: AutomationGovernorSnapshot;
  layers: FinalConvergenceLayer[];
  blockedEscalations: string[];
  nextSafeActions: string[];
  localDayReadiness: {
    status: string;
    readyToStart: boolean;
    nextAction: string;
  };
  realityAuditReadiness: {
    status: "needed";
    cleanupExecutionActive: false;
    route: "prepare_audit_then_safe_cleanup";
  };
  cleanupReadiness: {
    status: "planned";
    executionActive: false;
    nextAction: string;
  };
  founderReviewNeeds: string[];
  publicPrivateBoundaryStatus: "preserved";
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedBillingLaunchInactive: true;
    productionSecretsUntouched: true;
    noUncontrolledAutomation: true;
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noSecretsExposed: true;
    noPublicAlkonOrConvergenceLeak: true;
    noImagesOrRasterAssets: true;
    overall: "preserved";
  };
};
