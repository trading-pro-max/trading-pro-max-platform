export type AlkonSignalType =
  | "founder_idea"
  | "visual_rejection"
  | "chart_annoyance"
  | "public_ui_gap"
  | "shell_duplication"
  | "logo_rejection"
  | "build_failure"
  | "validation_failure"
  | "public_private_leak"
  | "secret_risk"
  | "billing_request"
  | "live_request"
  | "broker_feed_request"
  | "social_publish_request"
  | "launch_request"
  | "codex_result"
  | "local_day_signal"
  | "support_gap"
  | "apps_gap"
  | "assistant_gap"
  | "environment_signal"
  | "weather_signal"
  | "market_session_signal";

export type AlkonMeaningCategory =
  | "user_confusion"
  | "visual_pain"
  | "product_gap"
  | "safety_risk"
  | "legal_risk"
  | "public_trust_risk"
  | "build_need"
  | "cleanup_need"
  | "founder_preference"
  | "blocked_activation"
  | "future_readiness"
  | "operational_signal";

export type AlkonWorld = "public_earth" | "private_alkon" | "invisible_operating_layer";

export type AlkonLawOutcome =
  | "allowed"
  | "review_required"
  | "founder_approval_required"
  | "blocked"
  | "quarantined"
  | "black_hole";

export type AlkonGravity =
  | "P0_critical"
  | "P1_high"
  | "P2_standard"
  | "P3_future"
  | "blocked"
  | "black_hole";

export type AlkonActionType =
  | "report_only"
  | "create_task_passport"
  | "create_codex_draft"
  | "request_founder_review"
  | "request_legal_guardian_review"
  | "quarantine"
  | "block"
  | "update_memory"
  | "create_cleanup_candidate"
  | "create_visual_review";

export type AlkonJudgmentOutcome =
  | "accepted"
  | "needs_fix"
  | "rejected"
  | "scope_violation"
  | "product_truth_violation"
  | "public_boundary_violation"
  | "security_violation"
  | "visual_review_required"
  | "founder_review_required"
  | "blocked";

export type AlkonRawSignalInput = {
  inputId?: string;
  text: string;
  source?: "founder" | "system" | "validation" | "codex" | "public_feedback";
  surface?: string;
  createdAt?: string;
  explicitImageApproval?: boolean;
};

export type AlkonSignal = {
  signalId: string;
  type: AlkonSignalType;
  title: string;
  rawSummary: string;
  source: NonNullable<AlkonRawSignalInput["source"]>;
  surface: string;
  world: AlkonWorld;
  explicitImageApproval: boolean;
  containsSecrets: false;
  containsPrivateSensitiveData: false;
  createdAt: string;
};

export type AlkonMeaning = {
  signalId: string;
  category: AlkonMeaningCategory;
  whatHappened: string;
  whyItMatters: string;
  affectedWorld: AlkonWorld;
  affectedSurface: string;
  userImpact: "none" | "low" | "medium" | "high" | "critical";
  founderImpact: "low" | "medium" | "high" | "critical";
  safetyImpact: "none" | "review" | "blocked" | "critical";
  trustImpact: "none" | "low" | "medium" | "high" | "critical";
  businessImpact: "none" | "low" | "medium" | "high";
  repeatedLessonReferences: string[];
};

export type AlkonLawDecision = {
  signalId: string;
  outcome: AlkonLawOutcome;
  reason: string;
  safeAlternative: string;
  requiredReviews: string[];
  blockedReason: string | null;
  productTruthPreserved: boolean;
  noSecrets: true;
  noPublicExposure: true;
};

export type AlkonGravityDecision = {
  signalId: string;
  priority: AlkonGravity;
  explanation: string;
  escalationTarget: string;
  allowedNextAction: AlkonActionType;
};

export type AlkonRouteDecision = {
  signalId: string;
  ownerSystem:
    | "Public Earth"
    | "Trading Workspace"
    | "Markets"
    | "Plan Realms"
    | "TPM Assistant"
    | "Academy"
    | "Community"
    | "Support"
    | "Apps / Platforms"
    | "Visual Identity"
    | "Shell / Navigation"
    | "Planetary Environment"
    | "Security Sovereignty"
    | "Secrets Authority"
    | "Codex Construction"
    | "Result Tribunal"
    | "Product Memory"
    | "Launch Readiness"
    | "Alkon Command";
  supportingSystems: string[];
  responsibleWorker: string;
  requiredMonitors: string[];
  reportTarget: "Founder Command";
  memoryTarget: "Product Memory" | "Security Memory" | "Visual Memory";
};

export type AlkonActionPreparation = {
  signalId: string;
  actionType: AlkonActionType;
  taskPassportNeeded: boolean;
  codexDraftNeeded: boolean;
  validationNeeded: boolean;
  founderReviewNeeded: boolean;
  legalGuardianReviewNeeded: boolean;
  blockedReason: string | null;
  nextSafeAction: string;
  webAppMayExecute: false;
  directCodexCallAllowed: false;
  externalCallAllowed: false;
  secretsAllowed: false;
};

export type AlkonJudgmentInput = {
  signalId?: string;
  tscPassed?: boolean;
  eslintPassed?: boolean;
  buildPassed?: boolean;
  prismaPassed?: boolean;
  regressionPassed?: boolean;
  smokePassed?: boolean;
  gitClean?: boolean;
  pushed?: boolean;
  changedFilesInScope?: boolean;
  forbiddenFilesTouched?: boolean;
  publicInternalTermsFound?: boolean;
  secretsFound?: boolean;
  fakeActivationFound?: boolean;
  rasterAssetsFound?: boolean;
  visualProofRequired?: boolean;
  visualProofProvided?: boolean;
};

export type AlkonJudgment = {
  signalId: string;
  outcome: AlkonJudgmentOutcome;
  reason: string;
  nextAction: string;
  memoryLesson: string;
  founderReviewNeeded: boolean;
};

export type AlkonMemoryLesson = {
  lessonId: string;
  title: string;
  rule: string;
  appliesTo: string[];
  containsSecrets: false;
  containsPrivateSensitiveData: false;
};

export type AlkonEvolutionRule = {
  ruleId: string;
  sourceLessonId: string;
  evolutionRule: string;
  appliesTo: string[];
  futureGuard: string;
  requiredTest: string;
  founderApprovalNeeded: boolean;
};

export type AlkonConsciousnessReport = {
  signalId: string;
  summary: string;
  law: AlkonLawOutcome;
  gravity: AlkonGravity;
  route: string;
  action: AlkonActionType;
  nextSafeAction: string;
  founderDecisionNeeded: boolean;
};

export type AlkonConsciousnessSnapshot = {
  snapshotId: "alkon_sovereign_operating_consciousness";
  name: "Alkon Sovereign Operating Consciousness";
  visibility: "private_founder_only";
  publicExposure: false;
  status: "ready";
  doctrine: {
    notHumanConsciousness: true;
    notIndependentAi: true;
    noUncontrolledAutonomy: true;
    founderFinalAuthority: true;
    productTruthIsLaw: true;
    codexIsWorkerNotRuler: true;
  };
  flow: [
    "sense",
    "meaning",
    "law",
    "gravity",
    "route",
    "act",
    "judge",
    "remember",
    "evolve",
  ];
  latestSignals: AlkonSignal[];
  meaningSummary: AlkonMeaning[];
  lawDecisions: AlkonLawDecision[];
  gravityDistribution: Record<AlkonGravity, number>;
  activeRoutes: AlkonRouteDecision[];
  preparedActions: AlkonActionPreparation[];
  judgments: AlkonJudgment[];
  memoryLessons: AlkonMemoryLesson[];
  evolutionRules: AlkonEvolutionRule[];
  reports: AlkonConsciousnessReport[];
  nextSafeActions: string[];
  blockedActions: string[];
  founderDecisionsNeeded: string[];
  publicExposureStatus: {
    publicUiVisible: false;
    publicApiRoutesExposed: false;
    publicNavigationVisible: false;
    diagnosticsLeak: false;
  };
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    socialPublishingInactive: true;
    productionSecretsUntouched: true;
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noImagesOrRasterAssets: true;
    noFakeClaims: true;
    noSecretsExposed: true;
  };
  createdAt: string;
};
