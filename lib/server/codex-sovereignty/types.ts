import "server-only";

export type CodexTaskCategory =
  | "docs_update"
  | "test_update"
  | "copy_cleanup"
  | "lint_cleanup"
  | "type_cleanup"
  | "visual_polish"
  | "css_polish"
  | "public_ui"
  | "logo_identity"
  | "assistant_behavior"
  | "journal_coach"
  | "diagnostics"
  | "settings"
  | "founder_command"
  | "security"
  | "secrets"
  | "world_interface"
  | "media_readiness"
  | "academy_community"
  | "billing_blocked"
  | "broker_feed_blocked"
  | "live_execution_blocked"
  | "launch_blocked";

export type CodexTaskRiskLevel = "low" | "medium" | "high" | "critical";

export type CodexWorkerLevel =
  | "observer"
  | "drafter"
  | "builder_low"
  | "builder_medium_review_required"
  | "restricted";

export type CodexTaskConstitutionDecision =
  | "block"
  | "founder_approval_required"
  | "review_required"
  | "auto_draft_allowed";

export type CodexTaskParliamentOutcome =
  | "approve_for_draft"
  | "merge_with_existing_task"
  | "delay"
  | "reject"
  | "block"
  | "founder_approval_required"
  | "review_required";

export type CodexExecutionPermitDecision =
  | "permit_denied"
  | "permit_draft_only"
  | "permit_auto_submit_low_risk"
  | "permit_founder_review"
  | "permit_blocked";

export type CodexSubmitMode =
  | "manual_only"
  | "cli_exec_ready"
  | "cloud_exec_ready"
  | "github_comment_ready";

export type CodexAutoSubmitStatus =
  | "not_allowed"
  | "draft_ready"
  | "eligible_low_risk"
  | "waiting_founder"
  | "blocked"
  | "external_runner_required"
  | "result_pending"
  | "result_received";

export type CodexResultTribunalOutcome =
  | "accepted"
  | "needs_fix"
  | "rejected"
  | "scope_violation"
  | "security_violation"
  | "product_truth_violation"
  | "visual_review_required"
  | "founder_review_required"
  | "blocked";

export type CodexReviewArea =
  | "Founder"
  | "Product Truth"
  | "Guardian"
  | "Legal"
  | "Security"
  | "Quality"
  | "Design"
  | "Secrets Authority"
  | "World Interface"
  | "Public Language";

export type CodexConstructionRequest = {
  requestId: string;
  title: string;
  reason: string;
  category: CodexTaskCategory;
  affectedSurface: string;
  userImpact: string;
  founderImpact: string;
  riskLevel: CodexTaskRiskLevel;
  duplicationCheck: "new" | "duplicate" | "merge_candidate";
  timing: "now" | "next" | "later" | "blocked";
  affectedFiles?: string[];
};

export type CodexTaskConstitutionRule = {
  ruleId: string;
  categories: CodexTaskCategory[];
  triggers: string[];
  description: string;
  severity: CodexTaskRiskLevel;
  decision: CodexTaskConstitutionDecision;
  reason: string;
  safeAlternative: string;
};

export type CodexTaskConstitution = {
  checkedAt: string;
  status: "active";
  coreLaw: "Codex is a licensed construction worker, not a ruler.";
  allowedWorkerLevelsNow: CodexWorkerLevel[];
  blockedWorkerLevelsNow: CodexWorkerLevel[];
  rules: CodexTaskConstitutionRule[];
  alwaysBlocked: string[];
  founderApprovalAlwaysRequired: string[];
  autoDraftAllowed: string[];
  truth: {
    codexCanRuleProject: false;
    canBypassFounderApproval: false;
    canBypassGuardianLegalSecurityProductTruth: false;
    canTouchSecrets: false;
    canActivateRealWorldSystems: false;
  };
};

export type CodexTaskParliamentDecision = {
  requestId: string;
  taskTitle: string;
  category: CodexTaskCategory;
  decision: CodexTaskParliamentOutcome;
  constitutionDecision: CodexTaskConstitutionDecision;
  reason: string;
  ownerArea: string;
  priority: "low" | "medium" | "high" | "blocked";
  nextAction: string;
  founderReviewNeeded: boolean;
  legalReviewNeeded: boolean;
  guardianReviewNeeded: boolean;
  securityReviewNeeded: boolean;
  requiredReviews: CodexReviewArea[];
};

export type CodexJurisdiction = {
  category: CodexTaskCategory;
  ownerArea: string;
  allowedFiles: string[];
  forbiddenFiles: string[];
  allowedSurfaces: string[];
  forbiddenSurfaces: string[];
  allowedTerms: string[];
  forbiddenTerms: string[];
  requiredReviews: CodexReviewArea[];
  validationRequired: string[];
  screenshotRequired: boolean;
  rollbackRule: string;
  blockedByDefault: boolean;
};

export type CodexTaskPassport = {
  taskId: string;
  title: string;
  mission: string;
  reason: string;
  category: CodexTaskCategory;
  riskLevel: CodexTaskRiskLevel;
  workerLevel: CodexWorkerLevel;
  ownerMinistryOrArea: string;
  allowedFiles: string[];
  forbiddenFiles: string[];
  allowedSurfaces: string[];
  forbiddenSurfaces: string[];
  requiredReviews: CodexReviewArea[];
  founderApprovalRequired: boolean;
  legalReviewRequired: boolean;
  guardianReviewRequired: boolean;
  securityReviewRequired: boolean;
  productTruthRequirements: string[];
  publicLanguageRules: string[];
  forbiddenScope: string[];
  validationCommands: string[];
  screenshotRequirements: string[];
  rollbackRule: string;
  finalReportFormat: string[];
  expectedCommitMessage: string;
  createdAt: string;
  valid: boolean;
  invalidReasons: string[];
};

export type CodexExecutionPermit = {
  permitId: string;
  taskId: string;
  decision: CodexExecutionPermitDecision;
  reason: string;
  safeNextAction: string;
  requiredReviews: CodexReviewArea[];
  blockedReason: string | null;
  autoSubmitAllowed: boolean;
  maxWorkerLevel: CodexWorkerLevel;
};

export type CodexCompiledPrompt = {
  promptId: string;
  taskId: string;
  mode: CodexSubmitMode;
  prompt: string;
  manualCopyPasteCommand: string;
  githubCommentText: string;
  codexExecCommandText: string;
  codexCloudExecCommandText: string;
  includesForbiddenScope: boolean;
  includesValidationCommands: boolean;
  secretsIncluded: false;
  executableFromWebApp: false;
  externalSubmissionActive: false;
};

export type CodexSubmitReadinessItem = {
  taskId: string;
  status: CodexAutoSubmitStatus;
  supportedModes: CodexSubmitMode[];
  defaultMode: "manual_only";
  readinessLevel: "level_3_0" | "level_3_1_readiness_only" | "future_only";
  reason: string;
  externalRunnerRequired: boolean;
  webAppCanExecuteShell: false;
  webAppCanCallCodex: false;
};

export type CodexAutoSubmitGovernance = {
  checkedAt: string;
  supportedModes: CodexSubmitMode[];
  defaultMode: "manual_only";
  allowedCurrentLevels: Array<"level_3_0" | "level_3_1_readiness_only">;
  futureOnlyLevels: string[];
  items: CodexSubmitReadinessItem[];
  eligibleLowRiskCategories: CodexTaskCategory[];
  truth: {
    webAppShellExecution: false;
    callsCodexDirectly: false;
    externalSubmissionActive: false;
    externalRunnerApproved: false;
    sendsSecretsToCodex: false;
  };
};

export type CodexResultReportInput = {
  reportId: string;
  taskId: string;
  validationPassed: boolean;
  gitClean: boolean;
  pushed: boolean;
  changedFiles: string[];
  forbiddenScopeViolated: boolean;
  productTruthPreserved: boolean;
  publicInternalTerminologyLeak: boolean;
  fakeActivationIncluded: boolean;
  secretsExposed: boolean;
  screenshotsPresent: boolean;
  ahmadVisualReviewNeeded: boolean;
};

export type CodexResultTribunalDecision = {
  reportId: string;
  taskId: string;
  decision: CodexResultTribunalOutcome;
  reason: string;
  checks: {
    validationPassed: boolean;
    gitClean: boolean;
    pushed: boolean;
    changedFilesMatchPassport: boolean;
    forbiddenFilesUntouched: boolean;
    forbiddenScopeNotViolated: boolean;
    productTruthPreserved: boolean;
    noPublicInternalTerminologyLeak: boolean;
    noFakeActivation: boolean;
    noSecretsExposure: boolean;
    screenshotsPresentIfRequired: boolean;
    ahmadVisualReviewNeeded: boolean;
  };
  nextAction: string;
};

export type CodexMemoryLesson = {
  lessonId: string;
  taskType: CodexTaskCategory | "founder_preference" | "visual_history";
  outcome: "accepted_pattern" | "rejected_pattern" | "repeated_mistake" | "future_rule" | "blocked_category";
  reason: string;
  filesTouched: string[];
  risk: CodexTaskRiskLevel;
  ahmadFeedback: string;
  knownRepeatedMistake: string | null;
  futureRule: string;
  avoidPattern: string;
  acceptedPattern: string;
  noSecrets: true;
  noPrivateSensitiveData: true;
};

export type CodexConstructionState = {
  checkedAt: string;
  mode: "codex_sovereign_construction_state";
  status: "ready";
  constitutionReady: boolean;
  parliamentReady: boolean;
  jurisdictionReady: boolean;
  passportReady: boolean;
  permitReady: boolean;
  promptCompilerReady: boolean;
  autoSubmitReady: boolean;
  tribunalReady: boolean;
  memoryLessonsReady: boolean;
};

export type CodexGovernanceSnapshot = CodexConstructionState & {
  constitution: CodexTaskConstitution;
  sampleRequests: CodexConstructionRequest[];
  parliamentDecisions: CodexTaskParliamentDecision[];
  jurisdictions: CodexJurisdiction[];
  taskPassports: CodexTaskPassport[];
  executionPermits: CodexExecutionPermit[];
  compiledPrompts: CodexCompiledPrompt[];
  autoSubmitGovernance: CodexAutoSubmitGovernance;
  resultTribunal: CodexResultTribunalDecision[];
  memoryLessons: CodexMemoryLesson[];
  blockedCategories: CodexTaskCategory[];
  currentWorkerLevels: CodexWorkerLevel[];
  allowedCurrentAutomationLevels: Array<"level_3_0" | "level_3_1_readiness_only">;
  nextSafeActions: string[];
  whatNotToAutomate: string[];
  truth: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    socialPublishingInactive: true;
    productionSecretsUntouched: true;
    authSecurityPreserved: true;
    noUncontrolledAutomation: true;
    noShellExecutionFromWebApp: true;
    noSecretsSentToCodex: true;
  };
};

export type CodexPresidencyReport = {
  checkedAt: string;
  mode: "codex_sovereign_presidency_report";
  readiness: "ready";
  constitutionStatus: "active";
  taskPassportsReady: number;
  permits: CodexExecutionPermitDecision[];
  blockedTaskCategories: CodexTaskCategory[];
  level3Status: {
    level30DraftOnly: true;
    level31ReadinessOnly: true;
    webAppExecution: false;
  };
  resultTribunalStatus: CodexResultTribunalOutcome[];
  lessonsLearned: string[];
  tasksWaitingFounderApproval: string[];
  autoSubmitEligibleCategories: CodexTaskCategory[];
  whatNotToAutomate: string[];
  truth: CodexGovernanceSnapshot["truth"];
};
