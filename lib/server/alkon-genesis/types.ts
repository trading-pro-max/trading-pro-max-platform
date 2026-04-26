export type WorldSeedCategory =
  | "financial_intelligence_product"
  | "media_ai_studio"
  | "education_academy"
  | "treasury_business_ops"
  | "mobile_command_tool"
  | "support_platform"
  | "analytics_platform"
  | "security_tooling"
  | "developer_tooling"
  | "future_unknown";

export type WorldStatus =
  | "seed"
  | "evaluating"
  | "rejected"
  | "delayed"
  | "prototype_allowed"
  | "proof_required"
  | "founder_approval_required"
  | "birth_permitted"
  | "active_world"
  | "paused"
  | "retired"
  | "archived"
  | "black_holed";

export type GenesisDecision =
  | "accept_seed"
  | "evaluate_more"
  | "prototype_allowed"
  | "proof_required"
  | "founder_approval_required"
  | "birth_permitted"
  | "delay_until_prime_world_ready"
  | "reject_seed"
  | "black_hole";

export type GenesisGateId =
  | "meaning_gate"
  | "human_need_gate"
  | "market_gate"
  | "law_gate"
  | "treasury_gate"
  | "security_gate"
  | "prototype_gate"
  | "proof_gate"
  | "prime_world_protection_gate"
  | "founder_gate"
  | "birth_gate";

export type WorldRelationshipToPrime =
  | "supports_prime_world"
  | "extends_prime_world"
  | "shares_infrastructure"
  | "independent_future"
  | "distracts_from_prime_world"
  | "weakens_prime_world"
  | "forbidden";

export type GenesisGateStatus =
  | "pass"
  | "needs_review"
  | "delay"
  | "reject"
  | "blocked"
  | "black_hole";

export type AlkonWorldSeed = {
  seedId: string;
  name: string;
  category: WorldSeedCategory;
  purposeHypothesis: string;
  intendedAudience: string;
  relationshipToPrime: WorldRelationshipToPrime;
  possibleValue: string;
  possibleRisk: string;
  requiredGates: GenesisGateId[];
  currentStatus: WorldStatus;
  allowedScopeNow: string[];
  forbiddenScopeNow: string[];
  nextSafeAction: string;
  publicVisible: boolean;
  founderVisible: true;
  requiresExternalSpend?: boolean;
  requiresUserData?: boolean;
  requiresRegulatoryReview?: boolean;
  requiresMediaClaims?: boolean;
  requiresAlkonAccess?: boolean;
  hasPrototypeProof?: boolean;
  hasMarketProof?: boolean;
  hasLegalProof?: boolean;
  hasTreasuryEstimate?: boolean;
  hasSecurityProof?: boolean;
  founderApproval?: "not_requested" | "approved_seed_evaluation" | "approved_prototype" | "approved_birth" | "rejected" | "delayed";
};

export type AlkonWorldCandidate = AlkonWorldSeed & {
  candidateStatus: "candidate_only";
  noProjectCreated: true;
  noPublicPageCreated: true;
};

export type AlkonGenesisGate = {
  gateId: GenesisGateId;
  name: string;
  requirement: string;
  blocks: string[];
};

export type AlkonGenesisGateResult = {
  gateId: GenesisGateId;
  status: GenesisGateStatus;
  reason: string;
  evidenceNeeded: string[];
  requiredReview: string[];
  safeAlternative: string;
};

export type AlkonWorldBirthPermit = {
  permitId: string;
  worldName: string;
  category: WorldSeedCategory;
  purpose: string;
  relationshipToPrime: WorldRelationshipToPrime;
  status:
    | "not_permitted"
    | "prototype_only"
    | "proof_required"
    | "founder_required"
    | "birth_permitted"
    | "blocked";
  passedGates: GenesisGateId[];
  failedGates: AlkonGenesisGateResult[];
  allowedScope: string[];
  forbiddenScope: string[];
  requiredProof: string[];
  founderDecision: "required" | "approved" | "rejected" | "delayed";
  nextSafeAction: string;
  noExecution: true;
  noProjectCreation: true;
};

export type AlkonWorldLifeCycle = {
  stages: Array<
    | "seed"
    | "evaluate"
    | "prototype"
    | "prove"
    | "birth"
    | "local_life"
    | "public_readiness"
    | "beta"
    | "revenue_readiness"
    | "growth"
    | "pause"
    | "retire"
    | "archive"
  >;
  currentStage: "seed" | "evaluate" | "prototype" | "prove";
  canSkipStages: false;
  publicRequiresPublicSafeGate: true;
  paidRequiresLegalAccountingSupportGate: true;
  regulatedRequiresReview: true;
  retirementRequiresMemory: true;
};

export type AlkonWorldRuntime = {
  runtimeMode: "readiness_only";
  noLaunch: true;
  noProduction: true;
  noBilling: true;
  noBrokerFeed: true;
  noLiveExecution: true;
  noRealMoney: true;
  noSocialPublishing: true;
  noProjectCreation: true;
};

export type AlkonWorldRelationship = {
  relationshipToPrime: WorldRelationshipToPrime;
  reason: string;
  primeWorldProtected: boolean;
  sharedServicesRequired: string[];
};

export type AlkonWorldRisk = {
  riskLevel: "low" | "medium" | "high" | "critical" | "black_hole";
  risks: string[];
  blockedReasons: string[];
  primeWorldImpact: string;
};

export type AlkonWorldProof = {
  purposeProof: boolean;
  marketHypothesisProof: boolean;
  legalReadinessProof: boolean;
  treasuryEstimateProof: boolean;
  securityProof: boolean;
  prototypeProof: boolean;
  tests: boolean;
  founderReview: boolean;
  noHarmToPrimeWorld: boolean;
};

export type AlkonGenesisReport = {
  reportId: string;
  seed: AlkonWorldSeed;
  candidate: AlkonWorldCandidate;
  gates: AlkonGenesisGateResult[];
  decision: GenesisDecision;
  birthPermit: AlkonWorldBirthPermit;
  lifecycle: AlkonWorldLifeCycle;
  relationship: AlkonWorldRelationship;
  risk: AlkonWorldRisk;
  proof: AlkonWorldProof;
  runtime: AlkonWorldRuntime;
  memoryLesson: string;
  nextSafeAction: string;
};

export type PrimeWorldSnapshot = {
  worldId: "trading_pro_max_prime_world";
  name: "Trading Pro Max";
  status: "prime_world_protected";
  localDayOneRequired: true;
  livingMarketCoreReadinessRequired: true;
  assistantReadinessRequired: true;
  visualAcceptanceRequired: true;
  realityAuditRequired: true;
  safeCleanupRequired: true;
  productTruthStableRequired: true;
  alkonPrivateBoundaryStableRequired: true;
  testsPassingRequired: true;
  gitCleanRequired: true;
  currentBlockers: string[];
  protectedPriorities: string[];
  newWorldLimit: "seed_or_prototype_readiness_only";
};

export type AlkonGenesisSnapshot = {
  snapshotId: "alkon_sovereign_genesis_system";
  name: "Alkon Sovereign Genesis System";
  visibility: "private_founder_only";
  publicExposure: false;
  readiness: "ready";
  primeWorld: PrimeWorldSnapshot;
  worldSeeds: AlkonWorldSeed[];
  reports: AlkonGenesisReport[];
  worldSeedCount: number;
  evaluatingSeeds: string[];
  delayedSeeds: string[];
  rejectedSeeds: string[];
  prototypeAllowedSeeds: string[];
  founderApprovalNeeded: string[];
  birthPermits: AlkonWorldBirthPermit[];
  blockedOrBlackHoledSeeds: string[];
  sharedServices: string[];
  memoryLessons: string[];
  nextSafeActions: string[];
  primeWorldProtectionWarnings: string[];
  publicExposureStatus: {
    publicUiVisible: false;
    publicApiRoutesExposed: false;
    publicNavigationVisible: false;
    diagnosticsLeak: false;
  };
  productTruthStatus: {
    tradingProMaxRemainsPrimeWorld: true;
    noNewProjectLaunched: true;
    noPublicFutureWorldsExposed: true;
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    productionSecretsUntouched: true;
    noSecretsExposed: true;
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noImagesOrRasterAssets: true;
    noFakeClaims: true;
  };
  createdAt: string;
};
