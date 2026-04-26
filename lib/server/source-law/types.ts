export type TargetType =
  | "idea"
  | "feature"
  | "task"
  | "page"
  | "component"
  | "workspace"
  | "assistant_behavior"
  | "visual_identity"
  | "public_copy"
  | "codex_task"
  | "future_world"
  | "treasury_action"
  | "media_message"
  | "legal_gate"
  | "security_change"
  | "launch_step";

export type SourceDecision =
  | "aligned_now"
  | "aligned_later"
  | "needs_proof"
  | "needs_founder_review"
  | "delay"
  | "block"
  | "archive"
  | "return_to_prime_world";

export type SourceDriftType =
  | "complexity_without_user_value"
  | "theory_without_product_impact"
  | "expansion_before_prime_world"
  | "beauty_without_function"
  | "feature_without_truth"
  | "action_without_proof"
  | "decision_without_founder_need"
  | "legal_or_financial_risk"
  | "assistant_or_chart_not_improved"
  | "local_day_one_delayed";

export type SourceLawTarget = {
  targetId?: string;
  title: string;
  description: string;
  type: TargetType;
  affectedSurface: string;
  currentStation?: "station_1_open" | "station_1_closed" | "future";
  publicVisible?: boolean;
  servesHuman?: boolean;
  improvesClarity?: boolean;
  improvesTrust?: boolean;
  improvesSafePractice?: boolean;
  improvesLearning?: boolean;
  reducesConfusion?: boolean;
  supportsFounderOperation?: boolean;
  protectsBeginners?: boolean;
  reducesClutter?: boolean;
  improvesPrimeWorld?: boolean;
  affectsChart?: boolean;
  improvesAssistant?: boolean;
  addsComplexity?: boolean;
  theoryOnly?: boolean;
  delaysLocalDayOne?: boolean;
  expandsFutureWorld?: boolean;
  requiresFounderReview?: boolean;
  isVisualAcceptanceSensitive?: boolean;
  hasTruthProof?: boolean;
  hasSafetyProof?: boolean;
  hasValidationProof?: boolean;
  hasScreenshots?: boolean;
  hasPublicLeakCheck?: boolean;
  hasProductTruthCheck?: boolean;
  hasGitProof?: boolean;
  hasFounderVisualAcceptance?: boolean;
  involvesFakeClaim?: boolean;
  involvesFakeNumberOneClaim?: boolean;
  involvesLiveExecution?: boolean;
  involvesRealMoney?: boolean;
  involvesBrokerFeed?: boolean;
  involvesBilling?: boolean;
  involvesSecrets?: boolean;
  involvesBankCardData?: boolean;
  involvesShellExecution?: boolean;
  involvesDirectCodexExecution?: boolean;
  exposesAlkonPublicly?: boolean;
  weakensSecurity?: boolean;
  violatesPrivacy?: boolean;
  preciseHiddenTracking?: boolean;
  regulatedFinancialAction?: boolean;
  claimText?: string;
};

export type AhmadVisionCore = {
  sourceId: "ahmad_vision_core";
  privateFounderSource: true;
  vision:
    "Pro Max should become worthy of world-class status by building a truthful, safe, Earth-native financial intelligence and trading command platform for real humans.";
  founderOwnsAlkon: true;
  founderFinalAuthority: true;
  noPublicDoctrine: true;
  noImagesUnlessExplicit: true;
  noPublicNumberOneClaim: true;
};

export type SourceAlignmentReview = {
  reviewId: string;
  visionAlignment: "aligned" | "partial" | "misaligned" | "blocked";
  founderReviewNeeded: boolean;
  reason: string;
};

export type HumanValueCheck = {
  humanValueScore: number;
  affectedHuman: "public_user" | "founder" | "beginner" | "operator" | "none";
  userBenefit: string;
  founderBenefit: string;
  decision: SourceDecision;
};

export type TruthCheck = {
  truthStatus: "true" | "needs_review" | "false_claim_risk" | "blocked";
  falseClaimRisk: string[];
  safeAlternative: string;
  decision: SourceDecision;
};

export type SafetyCheck = {
  safetyStatus: "safe" | "review_required" | "blocked";
  blockedReasons: string[];
  requiredReview: string[];
  decision: SourceDecision;
};

export type ProofCheck = {
  proofStatus: "proven" | "needs_proof" | "needs_founder_review" | "blocked";
  missingProof: string[];
  requiredEvidence: string[];
  canClose: boolean;
};

export type OneCorrectActionDecision = {
  oneCorrectAction: string;
  whyThisNow: string;
  delayedActions: string[];
  blockedActions: string[];
  founderDecisionNeeded: string;
};

export type SourceDriftSignal = {
  driftDetected: boolean;
  driftType: SourceDriftType;
  severity: "none" | "low" | "medium" | "high" | "critical";
  correction: string;
  returnToHeart: string;
};

export type SourceLawMemoryLesson = {
  lessonId: string;
  lesson: string;
  appliesTo: TargetType[];
  futureGuard: string;
  requiredTest: string;
};

export type SourceLawReport = {
  reportId: string;
  target: SourceLawTarget;
  vision: SourceAlignmentReview;
  humanValue: HumanValueCheck;
  truth: TruthCheck;
  safety: SafetyCheck;
  proof: ProofCheck;
  driftSignals: SourceDriftSignal[];
  oneCorrectAction: OneCorrectActionDecision;
  decision: SourceDecision;
  memoryLesson: SourceLawMemoryLesson;
  nextSafeAction: string;
};

export type SourceLawSnapshot = {
  snapshotId: "alkon_sovereign_source_law";
  name: "Alkon Sovereign Source Law";
  visibility: "private_founder_only";
  publicExposure: false;
  readiness: "ready";
  primeWorld: "Pro Max Trading";
  sourceLaw:
    "Ahmad vision -> human value -> truth -> safety -> proof -> one correct action now.";
  visionCore: AhmadVisionCore;
  visionAlignment: SourceAlignmentReview;
  humanValueStatus: HumanValueCheck;
  truthStatus: TruthCheck;
  safetyStatus: SafetyCheck;
  proofStatus: ProofCheck;
  driftSignals: SourceDriftSignal[];
  oneCorrectAction: OneCorrectActionDecision;
  sampleReports: SourceLawReport[];
  delayedActions: string[];
  blockedActions: string[];
  founderReviewNeeds: string[];
  primeWorldFocusStatus: "protected";
  memoryLessons: SourceLawMemoryLesson[];
  nextSafeActions: string[];
  publicExposureStatus: {
    publicUiVisible: false;
    publicApiRoutesExposed: false;
    publicNavigationVisible: false;
    diagnosticsLeak: false;
    publicSourceLawDoctrineVisible: false;
  };
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    productionSecretsUntouched: true;
    authSecurityPreserved: true;
    noSecretsExposed: true;
    noPublicSourceLawExposure: true;
    noShellExecutionFromWebApp: true;
    noImagesOrRasterAssets: true;
  };
  createdAt: string;
};
