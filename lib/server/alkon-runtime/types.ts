export type AlkonRuntimeInputCategory =
  | "founder_idea"
  | "product_gap"
  | "visual_rejection"
  | "chart_issue"
  | "shell_issue"
  | "assistant_issue"
  | "support_gap"
  | "apps_gap"
  | "invoice"
  | "treasury_event"
  | "tax_event"
  | "media_message"
  | "claim_risk"
  | "security_risk"
  | "secret_risk"
  | "build_result"
  | "validation_result"
  | "codex_result"
  | "launch_request"
  | "billing_request"
  | "live_request"
  | "broker_feed_request"
  | "real_money_request"
  | "social_publish_request"
  | "cleanup_candidate"
  | "public_feedback"
  | "legal_question"
  | "device_event"
  | "environment_signal";

export type AlkonRuntimeWorld =
  | "public_earth"
  | "private_alkon"
  | "invisible_operating_layer";

export type AlkonRuntimeLayer =
  | "space"
  | "time"
  | "law"
  | "gravity"
  | "orbit"
  | "life"
  | "civilization"
  | "economy"
  | "defense"
  | "communication"
  | "reality"
  | "consequence"
  | "memory";

export type AlkonRuntimeDecision =
  | "allow_internal"
  | "readiness_only"
  | "public_safe"
  | "review_required"
  | "founder_approval_required"
  | "delayed_until_ready"
  | "blocked"
  | "black_holed";

export type AlkonRuntimeFate =
  | "continue"
  | "monitor"
  | "improve"
  | "draft_task"
  | "send_to_codex_draft"
  | "tribunal_review"
  | "memory_update"
  | "restrict"
  | "deprecate"
  | "archive"
  | "remove_candidate"
  | "black_hole";

export type AlkonRuntimeGravityLevel =
  | "P0_critical"
  | "P1_high"
  | "P2_standard"
  | "P3_future"
  | "blocked"
  | "black_hole";

export type AlkonRuntimeTimeDecision =
  | "now"
  | "later_today"
  | "next_build_cycle"
  | "after_audit"
  | "after_cleanup"
  | "after_visual_acceptance"
  | "after_legal_review"
  | "after_accounting_review"
  | "after_launch_gate"
  | "future"
  | "blocked_now";

export type AlkonRuntimeOrbitId =
  | "public_earth_orbit"
  | "market_workspace_orbit"
  | "assistant_orbit"
  | "earth_identity_orbit"
  | "environment_orbit"
  | "treasury_orbit"
  | "media_reality_orbit"
  | "security_orbit"
  | "secrets_orbit"
  | "codex_construction_orbit"
  | "launch_readiness_orbit"
  | "legal_guardian_orbit"
  | "memory_orbit"
  | "cleanup_orbit"
  | "reality_admission_orbit"
  | "black_hole_orbit";

export type AlkonRuntimeLifecycleState =
  | "idea"
  | "born"
  | "identified"
  | "reviewed"
  | "drafted"
  | "built"
  | "validated"
  | "accepted"
  | "monitored"
  | "improved"
  | "restricted"
  | "deprecated"
  | "archived"
  | "removed_candidate"
  | "black_holed";

export type AlkonRuntimeInput = {
  inputId?: string;
  category: AlkonRuntimeInputCategory;
  title: string;
  description: string;
  requestedBy: "founder" | "system" | "review" | "test";
  affectedWorld?: AlkonRuntimeWorld;
  affectedSurface?: string;
  amount?: number;
  currency?: "CHF" | "USD" | "EUR";
  claimText?: string;
  currentStage?: "laptop_planet" | "waitlist" | "beta" | "soft_launch" | "production";
  publicVisible?: boolean;
  requiresSecrets?: boolean;
  containsBankCardData?: boolean;
  requestsPaymentExecution?: boolean;
  requestsTaxFilingAutomation?: boolean;
  requestsImageGeneration?: boolean;
  explicitImageApproval?: boolean;
  hasInvoice?: boolean;
  hasBudget?: boolean;
  hasReserve?: boolean;
  hasRollback?: boolean;
  visualSensitive?: boolean;
};

export type AlkonRuntimeBirth = {
  runtimeEntityId: string;
  name: string;
  category: AlkonRuntimeInputCategory;
  reasonBorn: string;
  sourceText: string;
  initialWorld: AlkonRuntimeWorld;
  publicVisible: boolean;
  sensitiveFlags: string[];
};

export type AlkonRuntimeIdentity = {
  runtimeEntityId: string;
  name: string;
  world: AlkonRuntimeWorld;
  surface: string;
  ownerArea: string;
  ownerWorker: string;
  reportTarget: string;
  publicVisible: boolean;
  founderVisible: boolean;
};

export type AlkonRuntimeMeaning = {
  runtimeEntityId: string;
  meaning: string;
  userImpact: string;
  founderImpact: string;
  riskContext: string;
  valueCreated: string;
};

export type AlkonRuntimeSpace = {
  assignedWorld: AlkonRuntimeWorld;
  assignedSpace:
    | "Earth Public World"
    | "Founder Private World"
    | "Invisible Operating Layer"
    | "Market Workspace"
    | "Assistant Layer"
    | "Treasury Orbit"
    | "Media Orbit"
    | "Security Orbit"
    | "Launch Gate"
    | "Memory Constellation"
    | "Risk Belt"
    | "Black Hole Zone";
  publicVisible: boolean;
  founderVisible: boolean;
  leakRisk: boolean;
  safePublicName: string;
};

export type AlkonRuntimeTime = {
  cycle:
    | "Local Day Cycle"
    | "Build Cycle"
    | "Review Cycle"
    | "Treasury Cycle"
    | "Media Cycle"
    | "Security Cycle"
    | "Launch Cycle"
    | "Reality Lifecycle"
    | "Memory Cycle";
  decision: AlkonRuntimeTimeDecision;
  reason: string;
  readinessGate: string;
};

export type AlkonRuntimeLawDecision = {
  lawDecision: AlkonRuntimeDecision;
  failedRules: string[];
  requiredReviews: string[];
  safeAlternative: string;
  blockedReason: string | null;
};

export type AlkonRuntimeGravity = {
  gravity: AlkonRuntimeGravityLevel;
  reason: string;
  urgency: string;
  escalationTarget: string;
  nextSafeAction: string;
};

export type AlkonRuntimeOrbit = {
  orbit: AlkonRuntimeOrbitId;
  owner: string;
  requiredChecks: string[];
  requiredProof: string[];
  allowedActions: string[];
  forbiddenActions: string[];
  reportTarget: string;
  memoryRule: string;
};

export type AlkonRuntimeLife = {
  lifecycleState: AlkonRuntimeLifecycleState;
  requiredProof: string[];
  monitoringNeed: string;
  evolutionRule: string;
  deprecationRule: string;
  removalRule: string;
};

export type AlkonRuntimeCivilization = {
  institution: string;
  authority: string;
  worker: string;
  court: string;
  acceptanceGate: string;
  reportTarget: string;
};

export type AlkonRuntimeEconomy = {
  economyDecision: AlkonRuntimeDecision | "not_applicable";
  fundingMode: "founder_funded" | "hybrid_funded" | "revenue_funded" | "growth_mode" | "blocked" | "not_applicable";
  budgetImpact: string;
  taxReserveNeed: string;
  accountantReviewNeeded: boolean;
  safeFinancialAction: string;
  paymentExecutionStatus: "disabled";
  bankCardDataStatus: "forbidden";
};

export type AlkonRuntimeDefense = {
  defenseDecision: AlkonRuntimeDecision;
  requiredProtection: string[];
  lockdownRecommended: boolean;
  auditRequired: boolean;
  blockedReason: string | null;
};

export type AlkonRuntimeCommunication = {
  communicationDecision: AlkonRuntimeDecision | "not_applicable";
  claimsRisk: "none" | "low" | "medium" | "high" | "black_hole";
  safeWording: string;
  requiredReview: string[];
  publishingStatus: "inactive";
};

export type AlkonRealityAdmission = {
  realityAdmission:
    | "internal_only"
    | "readiness_only"
    | "public_safe"
    | "waitlist_ready"
    | "private_beta_ready"
    | "paid_software_ready_after_review"
    | "regulatory_review_required"
    | "blocked_until_cleared"
    | "black_hole_forbidden";
  allowedStage: string;
  missingGates: string[];
  rollbackRequired: boolean;
  supportRequired: boolean;
  founderDecisionRequired: boolean;
};

export type AlkonRuntimeConsequence = {
  consequenceSummary: string;
  riskCreated: string;
  valueCreated: string;
  costCreated: string;
  supportCreated: string;
  memoryNeeded: boolean;
  nextFateRecommendation: AlkonRuntimeFate;
};

export type AlkonRuntimeMemory = {
  memoryLesson: string;
  appliesTo: string[];
  futureGuard: string;
  requiredTest: string;
  founderReviewNeeded: boolean;
};

export type AlkonRuntimeNextFate = {
  fate: AlkonRuntimeFate;
  reason: string;
  nextSafeAction: string;
  noExecution: true;
  noDeletion: true;
};

export type AlkonRuntimeReport = {
  reportId: string;
  input: AlkonRuntimeInput;
  birth: AlkonRuntimeBirth;
  identity: AlkonRuntimeIdentity;
  meaning: AlkonRuntimeMeaning;
  space: AlkonRuntimeSpace;
  time: AlkonRuntimeTime;
  law: AlkonRuntimeLawDecision;
  gravity: AlkonRuntimeGravity;
  orbit: AlkonRuntimeOrbit;
  life: AlkonRuntimeLife;
  civilization: AlkonRuntimeCivilization;
  economy: AlkonRuntimeEconomy;
  defense: AlkonRuntimeDefense;
  communication: AlkonRuntimeCommunication;
  reality: AlkonRealityAdmission;
  consequence: AlkonRuntimeConsequence;
  memory: AlkonRuntimeMemory;
  nextFate: AlkonRuntimeNextFate;
};

export type AlkonRuntimeSnapshot = {
  snapshotId: "alkon_digital_universe_runtime";
  name: "Alkon Digital Universe Runtime";
  visibility: "private_founder_only";
  publicExposure: false;
  readiness: "ready";
  activeInputs: AlkonRuntimeInput[];
  layerStatuses: Record<AlkonRuntimeLayer, "ready" | "readiness_only" | "blocked_guard_ready">;
  sampleReports: AlkonRuntimeReport[];
  blackHoleCategories: AlkonRuntimeInputCategory[];
  highGravityIssues: string[];
  pendingReviews: string[];
  founderDecisionsNeeded: string[];
  memoryLessons: string[];
  nextSafeFates: AlkonRuntimeNextFate[];
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
    productionSecretsUntouched: true;
    noPaymentExecution: true;
    noDeletionExecution: true;
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noSecretsExposed: true;
    noImagesOrRasterAssets: true;
    noFakeClaims: true;
  };
  createdAt: string;
};
