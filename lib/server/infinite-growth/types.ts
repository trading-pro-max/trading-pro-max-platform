export type GrowthDomain =
  | "idea"
  | "design"
  | "docs"
  | "tests"
  | "audit"
  | "memory"
  | "safe_local_build"
  | "public_ui"
  | "assistant"
  | "workspace"
  | "media"
  | "support"
  | "data"
  | "billing"
  | "payments"
  | "treasury"
  | "tax"
  | "accounting"
  | "launch"
  | "production"
  | "social"
  | "broker_feed"
  | "live_execution"
  | "real_money"
  | "financial_services"
  | "regulated_activity";

export type InfiniteGrowthLayer =
  | "domain_registry"
  | "swiss_law_gravity"
  | "product_truth_gate"
  | "privacy_gate"
  | "tax_accounting_gate"
  | "treasury_gate"
  | "claims_gate"
  | "media_publishing_gate"
  | "launch_gate"
  | "production_gate"
  | "security_secrets_gate"
  | "financial_services_gate"
  | "founder_final_authority_gate"
  | "growth_permit"
  | "memory_law";

export type InfiniteGrowthDecision =
  | "allow_safe_creation"
  | "allow_local_only"
  | "allow_readiness_only"
  | "allow_public_safe"
  | "privacy_review_required"
  | "accounting_review_required"
  | "legal_review_required"
  | "regulatory_review_required"
  | "founder_approval_required"
  | "delayed_until_ready"
  | "blocked_until_cleared"
  | "black_hole_forbidden_now";

export type SwissLawGravityLevel =
  | "local_private_low"
  | "public_claim_medium"
  | "user_data_high"
  | "money_high"
  | "media_claim_high"
  | "launch_high"
  | "financial_services_critical"
  | "regulated_activity_critical"
  | "black_hole";

export type GrowthGateStatus =
  | "pass"
  | "readiness_only"
  | "review_required"
  | "founder_approval_required"
  | "delayed_until_ready"
  | "blocked"
  | "black_hole";

export type RealityGateStatus = GrowthGateStatus;
export type MoneyGateStatus = GrowthGateStatus;
export type DataGateStatus = GrowthGateStatus;
export type ClaimsGateStatus = GrowthGateStatus;
export type MediaGateStatus = GrowthGateStatus;
export type RegulatoryGateStatus = GrowthGateStatus;
export type FounderAuthorityStatus = GrowthGateStatus;

export type GrowthPermitOutcome =
  | "permit_safe_creation"
  | "permit_local_build"
  | "permit_readiness_only"
  | "permit_public_safe"
  | "permit_review_required"
  | "permit_founder_approval_required"
  | "permit_delayed_until_ready"
  | "permit_blocked_until_cleared"
  | "permit_black_hole";

export type InfiniteGrowthIdea = {
  ideaId?: string;
  title: string;
  description: string;
  domain: GrowthDomain;
  requestedBy: "founder" | "system" | "review" | "test";
  publicVisible?: boolean;
  collectsUserData?: boolean;
  involvesMoney?: boolean;
  involvesPayments?: boolean;
  involvesTax?: boolean;
  involvesMediaClaims?: boolean;
  involvesLaunch?: boolean;
  involvesTrading?: boolean;
  involvesCustomerFunds?: boolean;
  involvesFinancialAdvice?: boolean;
  involvesBrokerFeed?: boolean;
  involvesLiveExecution?: boolean;
  involvesProduction?: boolean;
  involvesSecrets?: boolean;
  involvesPublishing?: boolean;
  involvesBankCardData?: boolean;
  involvesPreciseTracking?: boolean;
  involvesFakeClaim?: boolean;
  claimText?: string;
  currentStage?: "local_laptop" | "readiness" | "waitlist" | "beta" | "soft_launch" | "production";
};

export type GrowthDomainRule = {
  domain: GrowthDomain;
  purpose: string;
  allowedInfinity: string[];
  requiredGates: InfiniteGrowthLayer[];
  forbiddenActions: string[];
  publicVisible: boolean;
  founderVisible: boolean;
  legalGravity: SwissLawGravityLevel;
  privacyGravity: SwissLawGravityLevel;
  moneyGravity: SwissLawGravityLevel;
  regulatoryGravity: SwissLawGravityLevel;
  requiredProof: string[];
  memoryRule: string;
};

export type SwissLawGravityResult = {
  gravity: SwissLawGravityLevel;
  requiredGates: InfiniteGrowthLayer[];
  blockedReasons: string[];
  safeAlternative: string;
  nextSafeAction: string;
};

export type InfiniteGrowthGate = {
  gateId:
    | "ProductTruthGate"
    | "PrivacyGate"
    | "TaxAccountingGate"
    | "TreasuryGate"
    | "ClaimsGate"
    | "MediaPublishingGate"
    | "LaunchGate"
    | "ProductionGate"
    | "SecuritySecretsGate"
    | "FinancialServicesGate"
    | "FounderFinalAuthorityGate";
  status: GrowthGateStatus;
  reason: string;
  evidenceNeeded: string[];
  requiredReview: string[];
  safeAlternative: string;
};

export type GrowthMemoryLesson = {
  lessonId: string;
  lesson: string;
  appliesTo: GrowthDomain[];
  futureGuard: string;
  requiredTest: string;
  founderReviewNeeded: boolean;
};

export type GrowthPermit = {
  permitId: string;
  outcome: GrowthPermitOutcome;
  title: string;
  domain: GrowthDomain;
  allowedActions: string[];
  forbiddenActions: string[];
  requiredProof: string[];
  requiredReview: string[];
  founderDecisionRequired: boolean;
  swissLawGravitySummary: string;
  productTruthSummary: string;
  nextSafeAction: string;
};

export type GrowthBlockReason = {
  domain: GrowthDomain;
  reason: string;
  gravity: SwissLawGravityLevel;
  safeAlternative: string;
};

export type InfiniteGrowthDecisionReport = {
  reportId: string;
  idea: InfiniteGrowthIdea;
  domainRule: GrowthDomainRule;
  gravity: SwissLawGravityResult;
  gates: InfiniteGrowthGate[];
  decision: InfiniteGrowthDecision;
  requiredGates: InfiniteGrowthLayer[];
  failedGates: InfiniteGrowthGate[];
  allowedScope: string[];
  blockedScope: string[];
  safeAlternative: string;
  founderApprovalRequired: boolean;
  suggestedTaskDraft: string;
  memoryLesson: GrowthMemoryLesson;
  nextSafeAction: string;
  permit: GrowthPermit;
};

export type InfiniteGrowthSnapshot = {
  snapshotId: "alkon_swiss_law_infinite_sovereign_growth_constitution";
  name: "Alkon Swiss-Law Infinite Sovereign Growth Constitution";
  visibility: "private_founder_only";
  publicExposure: false;
  readiness: "ready";
  domains: GrowthDomainRule[];
  layerStatuses: Record<InfiniteGrowthLayer, "ready" | "readiness_only" | "blocked_guard_ready">;
  sampleDecisions: InfiniteGrowthDecisionReport[];
  safeCreationDomains: GrowthDomain[];
  gatedRealityDomains: GrowthDomain[];
  blockedDomains: GrowthDomain[];
  blackHoleDomains: GrowthDomain[];
  requiredReviewCategories: string[];
  founderDecisionsNeeded: string[];
  memoryLessons: GrowthMemoryLesson[];
  nextSafeActions: string[];
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
    productionActivationBlocked: true;
    socialPublishingInactive: true;
    productionSecretsUntouched: true;
    noPaymentExecution: true;
    noBankCardData: true;
    noRegulatedActivityActivation: true;
    noSecretsExposed: true;
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noImagesOrRasterAssets: true;
    noFakeClaims: true;
  };
  createdAt: string;
};
