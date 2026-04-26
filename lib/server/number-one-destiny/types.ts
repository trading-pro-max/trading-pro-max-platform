export type EvaluationTargetType =
  | "idea"
  | "feature"
  | "component"
  | "page"
  | "workspace"
  | "assistant_behavior"
  | "visual_identity"
  | "public_copy"
  | "media_message"
  | "treasury_action"
  | "legal_gate"
  | "security_change"
  | "codex_task"
  | "cleanup_candidate"
  | "future_world"
  | "launch_step";

export type DestinyDimensionId =
  | "human_value"
  | "number_one_quality"
  | "product_truth"
  | "law_compliance"
  | "safety_security"
  | "time_cost_worthiness"
  | "proof_of_closure"
  | "founder_energy"
  | "prime_world_protection"
  | "user_trust"
  | "visual_excellence"
  | "operational_readiness";

export type DestinyDecision =
  | "pursue_now"
  | "pursue_after_prime_world"
  | "improve"
  | "monitor"
  | "review_required"
  | "founder_decision_required"
  | "delay"
  | "block"
  | "remove_or_archive";

export type DriftType =
  | "overbuilding"
  | "feature_sprawl"
  | "visual_noise"
  | "public_claim_risk"
  | "legal_risk"
  | "treasury_risk"
  | "security_risk"
  | "prime_world_distraction"
  | "founder_energy_overload"
  | "weak_proof"
  | "assistant_confusion"
  | "chart_not_king";

export type CompletionOutcome =
  | "complete"
  | "complete_with_notes"
  | "needs_polish"
  | "needs_rebuild"
  | "delay"
  | "future"
  | "blocked"
  | "remove";

export type ClaimFirewallStatus = "allowed" | "blocked";

export type NumberOneEvaluationTarget = {
  targetId?: string;
  title: string;
  description: string;
  type: EvaluationTargetType;
  affectedSurface: string;
  publicVisible?: boolean;
  servesHumanNeed?: boolean;
  improvesPrimeWorld?: boolean;
  affectsChart?: boolean;
  assistantImpact?: boolean;
  addsClutter?: boolean;
  hasFunctionalProof?: boolean;
  hasVisualAcceptance?: boolean;
  hasTruthProof?: boolean;
  hasSafetyProof?: boolean;
  hasLegalReview?: boolean;
  hasOperationalProof?: boolean;
  hasMemoryRule?: boolean;
  hasCostJustification?: boolean;
  hasFounderAcceptance?: boolean;
  hasTests?: boolean;
  involvesPublicClaim?: boolean;
  claimText?: string;
  expandsFutureWorld?: boolean;
  createsNewWorld?: boolean;
  requiresFounderNow?: boolean;
  increasesFounderLoad?: boolean;
  canDelegateToCodex?: boolean;
  involvesMoney?: boolean;
  involvesMedia?: boolean;
  involvesSecurity?: boolean;
  involvesLegal?: boolean;
  involvesLiveExecution?: boolean;
  involvesBilling?: boolean;
  involvesBrokerFeed?: boolean;
  involvesRealMoney?: boolean;
  involvesRegulatedActivity?: boolean;
  stationStatus?: "station_1_open" | "station_1_closed" | "future";
};

export type NorthStarResult = {
  northStar:
    "Make Pro Max worthy of becoming the world's #1 Earth-native financial intelligence and trading command platform.";
  publicClaimForbidden: true;
  northStarAlignment: "aligned" | "partial" | "misaligned" | "blocked";
  reason: string;
  missingEvidence: string[];
  nextSafeAction: string;
};

export type DestinyDimension = {
  dimensionId: DestinyDimensionId;
  score: number;
  reason: string;
  proofRequired: string[];
};

export type NumberOneScore = {
  totalScore: number;
  maxScore: 120;
  overallScore: number;
  noFakeTenOutOfTen: true;
  scoreCap: number;
  scoreCapReason: string;
  dimensions: DestinyDimension[];
  weakestDimensions: DestinyDimensionId[];
  priority: "P0" | "P1" | "P2" | "P3" | "blocked";
  recommendedDecision: DestinyDecision;
  requiredProof: string[];
};

export type DriftSignal = {
  driftDetected: boolean;
  driftType: DriftType;
  severity: "none" | "low" | "medium" | "high" | "critical";
  affectedStation: "station_1" | "prime_world" | "public_claims" | "founder_energy" | "none";
  stopOrContinue: "continue" | "continue_with_guard" | "delay" | "block";
  correction: string;
};

export type AbsoluteCompletionCheck = {
  checkId:
    | "functional_completion"
    | "visual_completion"
    | "truth_completion"
    | "safety_completion"
    | "legal_completion"
    | "operational_completion"
    | "memory_completion"
    | "cost_completion"
    | "stage_completion"
    | "founder_acceptance_completion";
  outcome: CompletionOutcome;
  reason: string;
  requiredEvidence: string[];
};

export type ProMaxStandard = {
  standardId:
    | "ui_standard"
    | "chart_standard"
    | "assistant_standard"
    | "earth_identity_standard"
    | "security_standard"
    | "truth_standard"
    | "legal_standard"
    | "treasury_standard"
    | "media_standard"
    | "support_standard"
    | "accessibility_standard"
    | "performance_standard"
    | "alkon_privacy_standard";
  requirement: string;
  forbiddenPatterns: string[];
  proofRequired: string[];
  owner: string;
  tests: string[];
  memoryRule: string;
};

export type FounderEnergyImpact = {
  founderAttentionRequired: boolean;
  decisionLoad: "none" | "low" | "medium" | "high" | "overload";
  oneNextDecision: string;
  canDelegateToCodex: boolean;
  delayReason: string;
};

export type WorldlineProtectionResult = {
  protected: boolean;
  riskToPrimeWorld: "none" | "low" | "medium" | "high" | "critical";
  requiredDelay: boolean;
  allowedAsReadinessOnly: boolean;
  reason: string;
};

export type PublicClaimFirewallResult = {
  allowed: boolean;
  status: ClaimFirewallStatus;
  blockedTerms: string[];
  reason: string;
  safeAlternative: string;
};

export type NumberOneMemoryLesson = {
  lessonId: string;
  lesson: string;
  appliesTo: EvaluationTargetType[];
  futureGuard: string;
  requiredTest: string;
};

export type NumberOneReport = {
  reportId: string;
  target: NumberOneEvaluationTarget;
  northStar: NorthStarResult;
  score: NumberOneScore;
  driftSignals: DriftSignal[];
  completionChecks: AbsoluteCompletionCheck[];
  applicableStandards: ProMaxStandard[];
  founderEnergy: FounderEnergyImpact;
  worldlineProtection: WorldlineProtectionResult;
  publicClaimFirewall: PublicClaimFirewallResult;
  decision: DestinyDecision;
  memoryLesson: NumberOneMemoryLesson;
  nextSafeAction: string;
};

export type NumberOneDestinySnapshot = {
  snapshotId: "pro_max_number_one_destiny_alignment";
  name: "Pro Max Number One Destiny Alignment";
  visibility: "private_founder_only";
  publicExposure: false;
  readiness: "ready";
  internalMission:
    "Make Pro Max worthy of becoming the world's #1 Earth-native financial intelligence and trading command platform.";
  publicClaimStatus: "forbidden";
  noPublicNumberOneClaim: true;
  primeWorld: "Pro Max Trading";
  currentStationStatus: "station_1_open";
  northStar: NorthStarResult;
  scoresByLayer: NumberOneScore[];
  sampleReports: NumberOneReport[];
  topDrifts: DriftSignal[];
  weakDimensions: DestinyDimensionId[];
  standards: ProMaxStandard[];
  completionChecks: AbsoluteCompletionCheck[];
  founderEnergy: FounderEnergyImpact;
  worldlineProtection: WorldlineProtectionResult;
  claimFirewallExamples: PublicClaimFirewallResult[];
  memoryLessons: NumberOneMemoryLesson[];
  nextOneCriticalDecision: string;
  nextSafeActions: string[];
  publicExposureStatus: {
    publicUiVisible: false;
    publicApiRoutesExposed: false;
    publicNavigationVisible: false;
    diagnosticsLeak: false;
    publicNumberOneClaimVisible: false;
  };
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    productionSecretsUntouched: true;
    authSecurityPreserved: true;
    noPublicNumberOneBestGlobalRegulatedClaims: true;
    noFakeClaims: true;
    noAlkonNumberOneExposureToPublicUsers: true;
    noShellExecutionFromWebApp: true;
    noImagesOrRasterAssets: true;
  };
  createdAt: string;
};
