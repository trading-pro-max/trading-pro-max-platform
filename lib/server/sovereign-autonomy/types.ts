import "server-only";

export type FounderIdeaSource =
  | "founder_manual"
  | "visual_feedback"
  | "local_day"
  | "product_gap"
  | "assistant_note"
  | "validation_result";

export type SovereignAffectedWorld =
  | "public_user_world"
  | "private_founder_world"
  | "invisible_operating_layer";

export type FounderIdeaUrgency = "low" | "medium" | "high" | "critical";

export type FounderIdeaDesiredTiming =
  | "now"
  | "next"
  | "later"
  | "someday"
  | "blocked";

export type FounderIdeaInboxSurface =
  | "public_entry"
  | "trading_workspace"
  | "chart"
  | "execution"
  | "assistant"
  | "journal_coach"
  | "settings"
  | "diagnostics"
  | "plans"
  | "apps_platforms"
  | "academy"
  | "community"
  | "support"
  | "founder_command"
  | "security"
  | "secrets"
  | "world_interface"
  | "media"
  | "construction";

export type SovereignEventType =
  | "founder_idea_received"
  | "visual_gap_detected"
  | "logo_rejection_detected"
  | "chart_quality_low"
  | "public_user_confusion"
  | "public_navigation_gap"
  | "apps_platforms_gap"
  | "support_gap"
  | "market_readiness_gap"
  | "assistant_behavior_gap"
  | "journal_coach_gap"
  | "product_truth_conflict"
  | "internal_language_leak"
  | "public_private_boundary_risk"
  | "secrets_risk"
  | "security_risk"
  | "codex_task_needed"
  | "validation_failed"
  | "build_failed"
  | "screenshot_missing"
  | "local_day_report_needed"
  | "billing_requested"
  | "live_execution_requested"
  | "broker_feed_requested"
  | "real_money_requested"
  | "social_publish_requested"
  | "launch_requested"
  | "world_interface_request"
  | "safe_docs_update_needed"
  | "safe_test_update_needed"
  | "safe_copy_cleanup_needed";

export type SovereignEventStatus =
  | "observed"
  | "classified"
  | "routed"
  | "waiting_review"
  | "waiting_founder"
  | "draft_ready"
  | "permit_pending"
  | "permitted"
  | "blocked"
  | "result_pending"
  | "completed"
  | "archived";

export type SovereignRiskLevel = "low" | "medium" | "high" | "critical";

export type SovereignSeverity = "info" | "warning" | "error" | "critical";

export type SovereignReviewArea =
  | "product_truth"
  | "plan_entitlement"
  | "public_private_boundary"
  | "guardian"
  | "legal"
  | "trust_governor"
  | "security"
  | "secrets"
  | "visual_acceptance"
  | "founder"
  | "quality"
  | "product"
  | "engineering";

export type SovereignOwnerArea =
  | "Design Ministry"
  | "Product"
  | "Quality"
  | "Visual Identity"
  | "Brand"
  | "Assistant"
  | "Product Truth"
  | "UX"
  | "Integrations"
  | "Public User World"
  | "World Interface"
  | "Support"
  | "Guardian"
  | "Legal"
  | "Secrets Authority"
  | "Security"
  | "Public Security & Cyber Sovereignty"
  | "Codex Sovereign Construction State"
  | "Local Operations"
  | "Founder Command"
  | "Product Memory"
  | "Treasury";

export type RecommendedQueue =
  | "design_quality_review"
  | "brand_identity_review"
  | "assistant_truth_review"
  | "public_product_gap_review"
  | "world_interface_review"
  | "security_quarantine"
  | "blocked_activation_log"
  | "codex_construction_draft"
  | "local_day_queue"
  | "product_memory_queue";

export type EscalationTarget =
  | "none"
  | "founder_command"
  | "presidency"
  | "guardian"
  | "legal"
  | "security"
  | "secrets_authority";

export type AutonomyLevel =
  | "level_0_blocked"
  | "level_1_detect"
  | "level_2_draft"
  | "level_3_0_codex_ready_task_draft_only"
  | "level_3_1_approved_low_risk_codex_submission_readiness_only"
  | "level_4_future_low_risk_auto_fix"
  | "level_5_forbidden_for_now";

export type PolicyGateName =
  | "Product Truth Gate"
  | "Plan Entitlement Gate"
  | "Public/Private Boundary Gate"
  | "Guardian Gate"
  | "Legal Gate"
  | "Trust Governor Gate"
  | "Security Sovereignty Gate"
  | "Secrets Gate"
  | "Visual Acceptance Gate"
  | "Founder Approval Gate";

export type PolicyGateDecision =
  | "allowed"
  | "review_required"
  | "founder_approval_required"
  | "blocked"
  | "quarantined";

export type CodexWorkerLevel =
  | "observer"
  | "drafter"
  | "builder_low"
  | "builder_medium_review_required"
  | "restricted";

export type CodexSubmitMode =
  | "manual_only"
  | "cli_exec_ready"
  | "cloud_exec_ready"
  | "github_comment_ready";

export type TribunalDecision =
  | "accepted"
  | "needs_fix"
  | "rejected"
  | "scope_violation"
  | "security_violation"
  | "product_truth_violation"
  | "public_boundary_violation"
  | "visual_review_required"
  | "founder_review_required"
  | "blocked";

export type MemoryLessonType =
  | "accepted_pattern"
  | "rejected_pattern"
  | "repeated_mistake"
  | "founder_preference"
  | "future_rule"
  | "blocked_category"
  | "sensitive_file"
  | "visual_issue"
  | "no_images_rule"
  | "logo_rejection_history"
  | "chart_annoyance_history"
  | "home_crowding_history";

export type FounderIdeaInput = {
  ideaId?: string;
  title: string;
  rawIdea: string;
  summary?: string;
  source?: FounderIdeaSource;
  affectedWorld?: SovereignAffectedWorld;
  affectedSurface?: string;
  suspectedCategory?: string;
  urgency?: FounderIdeaUrgency;
  founderIntent?: string;
  createdAt?: string;
};

export type FounderIdeaInboxInput = {
  title: string;
  rawIdea: string;
  affectedWorld: SovereignAffectedWorld;
  affectedSurface: FounderIdeaInboxSurface;
  urgency: FounderIdeaUrgency;
  founderIntent: string;
  desiredTiming: FounderIdeaDesiredTiming;
  notes?: string;
};

export type FounderIdea = {
  ideaId: string;
  title: string;
  rawIdea: string;
  summary: string;
  source: FounderIdeaSource;
  affectedWorld: SovereignAffectedWorld;
  affectedSurface: string;
  suspectedCategory: string;
  urgency: FounderIdeaUrgency;
  founderIntent: string;
  createdAt: string;
};

export type SovereignEvent = {
  eventId: string;
  type: SovereignEventType;
  title: string;
  summary: string;
  source: FounderIdeaSource | "system_snapshot" | "result_tribunal";
  affectedWorld: SovereignAffectedWorld;
  affectedSurface: string;
  affectedFiles: string[];
  riskLevel: SovereignRiskLevel;
  severity: SovereignSeverity;
  productTruthImpact: string;
  publicUserImpact: string;
  founderImpact: string;
  requiredReviews: SovereignReviewArea[];
  suggestedOwner: SovereignOwnerArea;
  suggestedNextAction: string;
  status: SovereignEventStatus;
  createdAt: string;
};

export type OwnerRoute = {
  ownerArea: SovereignOwnerArea;
  supportingAreas: SovereignOwnerArea[];
  requiredReviews: SovereignReviewArea[];
  founderVisible: boolean;
  publicVisible: boolean;
  recommendedQueue: RecommendedQueue;
  escalationTarget: EscalationTarget;
};

export type PolicyGateResult = {
  gate: PolicyGateName;
  decision: PolicyGateDecision;
  reason: string;
  requiredReviews: SovereignReviewArea[];
};

export type PolicyGateEvaluation = {
  checkedAt: string;
  eventId: string;
  overallDecision: PolicyGateDecision;
  autonomyLevel: AutonomyLevel;
  gates: PolicyGateResult[];
  hardBlocks: string[];
  allowedNow: AutonomyLevel[];
  forbiddenNow: string[];
};

export type TaskPassport = {
  taskId: string;
  eventId: string;
  title: string;
  mission: string;
  reason: string;
  category: SovereignEventType;
  riskLevel: SovereignRiskLevel;
  affectedWorld: SovereignAffectedWorld;
  affectedSurface: string;
  ownerArea: SovereignOwnerArea;
  workerLevel: CodexWorkerLevel;
  allowedFiles: string[];
  forbiddenFiles: string[];
  allowedSurfaces: string[];
  forbiddenSurfaces: string[];
  requiredReviews: SovereignReviewArea[];
  founderApprovalRequired: boolean;
  productTruthRequirements: string[];
  publicLanguageRules: string[];
  forbiddenScope: string[];
  validationCommands: string[];
  screenshotRequirements: string[];
  rollbackRule: string;
  finalReportFormat: string[];
  expectedCommitMessage: string;
  valid: boolean;
  invalidReasons: string[];
};

export type CodexLicense = {
  licenseId: string;
  taskId: string;
  workerLevel: CodexWorkerLevel;
  permitted: boolean;
  permitState:
    | "observer_permitted"
    | "drafter_permitted"
    | "builder_low_permitted"
    | "review_required"
    | "restricted"
    | "blocked";
  allowedActions: string[];
  blockedActions: string[];
  expiresWhen: "task_closed_or_scope_changes";
  noSecrets: true;
  noWebAppExecution: true;
};

export type CodexDraft = {
  draftId: string;
  taskId: string;
  mode: CodexSubmitMode;
  codexReadyPrompt: string;
  manualCopyPasteCommand: string;
  githubCommentText: string;
  codexExecCommandText: string;
  codexCloudExecCommandText: string;
  executableFromWebApp: false;
  externalSubmissionActive: false;
  secretsIncluded: false;
  includesForbiddenScope: boolean;
  includesValidation: boolean;
};

export type FounderIdeaInboxPreview = {
  checkedAt: string;
  mode: "founder_idea_inbox_preview";
  input: FounderIdeaInboxInput;
  idea: FounderIdea;
  event: SovereignEvent;
  ownerRoute: OwnerRoute;
  policyEvaluation: PolicyGateEvaluation;
  taskPassportPreview: TaskPassport;
  permitPreview: CodexLicense;
  codexDraftPreview: CodexDraft | null;
  constructionQueueReadiness: {
    recommendedQueue: RecommendedQueue;
    status:
      | "draft_ready"
      | "waiting_review"
      | "waiting_founder"
      | "blocked";
    externalExecutionActive: false;
    autoSubmitActive: false;
    shellExecutionActive: false;
  };
  blockedReason: string | null;
  nextSafeAction: string;
  truth: {
    previewOnly: true;
    persisted: false;
    storesSecrets: false;
    privateSensitiveDataStored: false;
    externalCalls: false;
    codexCalled: false;
    shellExecution: false;
    autoSubmit: false;
    productTruthPreserved: true;
  };
};

export type FounderIdeaInboxAlkonBridge = {
  universeName: "Alkon";
  arabicName: "الكون";
  orbitCommandLinked: true;
  constructionUniverseLinked: true;
  memoryUniverseLinked: true;
  resultTribunalLinked: true;
  publicVisible: false;
  executionActive: false;
  shellExecutionActive: false;
  codexCalledFromWebApp: false;
  nextAction: string;
};

export type FounderIdeaInboxReadiness = {
  checkedAt: string;
  mode: "founder_idea_inbox_readiness";
  status: "ready";
  access: {
    ownerOnly: true;
    publicNavigationVisible: false;
    userPlanExposure: false;
    readOnly: true;
    previewPostOnly: true;
    persistenceActive: false;
    approvalExecutionActive: false;
    secretsVisible: false;
  };
  allowedAffectedWorlds: SovereignAffectedWorld[];
  allowedSurfaces: FounderIdeaInboxSurface[];
  recentIdeaExamples: FounderIdeaInboxPreview[];
  pendingIdeaDrafts: FounderIdeaInboxPreview[];
  blockedIdeaExamples: FounderIdeaInboxPreview[];
  alkonBridge: FounderIdeaInboxAlkonBridge;
  nextSafeIdeaAction: string;
  truth: FounderIdeaInboxPreview["truth"];
};

export type CodexSubmitReadiness = {
  checkedAt: string;
  defaultMode: "manual_only";
  supportedModes: CodexSubmitMode[];
  readyModes: CodexSubmitMode[];
  notEnabled: string[];
  drafts: CodexDraft[];
  truth: {
    webAppShellExecution: false;
    callsCodexDirectly: false;
    sendsSecretsToCodex: false;
    externalRunnerApproved: false;
  };
};

export type ResultTribunalInput = {
  changedFiles: string[];
  validation: {
    tsc: boolean;
    eslint: boolean;
    build: boolean;
    prisma: boolean;
    regression: boolean;
    smoke: boolean;
    gitClean: boolean;
    pushed: boolean;
  };
  screenshots: string[];
  productTruthPreserved: boolean;
  noSecrets: boolean;
  noFakeActivation: boolean;
  publicPrivateSeparationPreserved: boolean;
};

export type ResultTribunalReport = {
  checkedAt: string;
  taskId: string;
  decision: TribunalDecision;
  checks: Array<{ key: string; pass: boolean; detail: string }>;
  nextSafeAction: string;
};

export type MemoryLesson = {
  lessonId: string;
  type: MemoryLessonType;
  title: string;
  summary: string;
  sourceEventId: string | null;
  createdAt: string;
  secretsStored: false;
  privateSensitiveDataStored: false;
};

export type SovereignAutonomyReadinessSnapshot = {
  checkedAt: string;
  mode: "sovereign_autonomy_operating_civilization";
  operatingMode: "local_readiness_only";
  autonomyLevelsAllowedNow: AutonomyLevel[];
  autonomyLevelsBlockedNow: AutonomyLevel[];
  coreLoop: string[];
  ideaIntakeReady: boolean;
  eventSystemReady: boolean;
  codexDraftingReady: boolean;
  founderCommandReady: boolean;
  blockedSystems: string[];
  nextSafeActions: string[];
  sampleFounderIdeas: FounderIdea[];
  sampleEvents: SovereignEvent[];
  ownerRoutes: OwnerRoute[];
  policyEvaluations: PolicyGateEvaluation[];
  taskPassports: TaskPassport[];
  codexLicenses: CodexLicense[];
  codexSubmitReadiness: CodexSubmitReadiness;
  tribunalReports: ResultTribunalReport[];
  memoryLessons: MemoryLesson[];
  truth: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    socialPublishingInactive: true;
    productionSecretsUntouched: true;
    noUncontrolledAutomation: true;
    noShellExecutionFromWebApp: true;
    noSecretsSentToCodex: true;
    publicInternalTerminologyLeakAllowed: false;
  };
};
