export type AlkonActionCategory =
  | "public_ui_change"
  | "visual_identity_change"
  | "trading_workspace_change"
  | "assistant_behavior_change"
  | "plan_claim_change"
  | "media_content"
  | "social_publishing"
  | "support_response"
  | "treasury_payment"
  | "founder_reimbursement"
  | "tax_reserve_adjustment"
  | "budget_change"
  | "ad_spend"
  | "launch_gate_change"
  | "production_activation"
  | "billing_activation"
  | "broker_feed_activation"
  | "live_execution_activation"
  | "real_money_activation"
  | "security_setting_change"
  | "secrets_access"
  | "codex_task_approval"
  | "cleanup_removal"
  | "legal_claim"
  | "partnership_claim"
  | "user_data_change"
  | "device_authority_change"
  | "emergency_lockdown";

export type AlkonAuthorityLevel =
  | "view_only"
  | "draft_only"
  | "approve_low_risk"
  | "approve_sensitive"
  | "founder_final_decision"
  | "constitutionally_forbidden";

export type AlkonDecisionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "black_hole";

export type AlkonLegitimacyReviewOutcome =
  | "pass"
  | "review_required"
  | "founder_approval_required"
  | "delayed_until_ready"
  | "blocked"
  | "black_holed";

export type AlkonLegitimacyDecisionOutcome =
  | "legitimate"
  | "legitimate_with_review"
  | "founder_approval_required"
  | "delayed_until_ready"
  | "blocked"
  | "black_holed";

export type AlkonDecisionPermitOutcome =
  | "permit_report_only"
  | "permit_draft_only"
  | "permit_review_required"
  | "permit_founder_approval_required"
  | "permit_delayed_until_ready"
  | "permit_blocked"
  | "permit_black_holed";

export type AlkonLegitimacyDimension =
  | "purpose_legitimacy"
  | "truth_legitimacy"
  | "user_legitimacy"
  | "financial_legitimacy"
  | "security_legitimacy"
  | "timing_legitimacy"
  | "reversibility_legitimacy"
  | "reputation_legitimacy"
  | "legal_guardian_legitimacy"
  | "founder_responsibility";

export type AlkonRollbackProfile =
  | "fully_reversible"
  | "reversible_with_backup"
  | "rollback_required"
  | "irreversible_review_required"
  | "irreversible_blocked";

export type AlkonAuditReadiness = {
  auditLedgerReady: boolean;
  recordsRawSecrets: false;
  recordsBankCardData: false;
  recordMode: "readiness_only";
  requiredFields: string[];
};

export type AlkonLegitimacyRequest = {
  actionCategory: AlkonActionCategory;
  title: string;
  description: string;
  requestedBy: "founder" | "system" | "codex_draft" | "unknown";
  affectedWorld: "public_earth" | "private_alkon" | "invisible_operating_layer";
  affectedSurface: string;
  amount?: number;
  currency?: "CHF" | "USD" | "EUR";
  claimText?: string;
  riskHint?: AlkonDecisionRiskLevel;
  currentStage:
    | "laptop_planet"
    | "waitlist"
    | "private_beta"
    | "soft_launch_paper_only"
    | "production_economic"
    | "public_launch";
  fundingMode:
    | "founder_funded"
    | "hybrid_funded"
    | "revenue_funded"
    | "growth_mode"
    | "blocked";
  hasInvoice: boolean;
  hasRollback: boolean;
  requiresSecrets: boolean;
  publicVisible: boolean;
  planImpact?: "none" | "free" | "pro" | "vip" | "institutional" | "alkon_private";
  productTruthImpact?:
    | "none"
    | "copy_only"
    | "plan_claim"
    | "billing"
    | "live"
    | "broker_feed"
    | "launch"
    | "real_money";
};

export type AlkonLegitimacyReview = {
  dimension: AlkonLegitimacyDimension;
  outcome: AlkonLegitimacyReviewOutcome;
  reason: string;
  evidenceNeeded: string[];
  safeAlternative: string;
  requiredReview: string[];
  memoryLesson: string;
};

export type AlkonPurposeLegitimacyResult = AlkonLegitimacyReview & {
  missionAlignmentScore: number;
  requiredOwner: string;
  nextSafeAction: string;
};

export type AlkonTruthLegitimacyResult = AlkonLegitimacyReview & {
  falseClaimRisk: AlkonDecisionRiskLevel;
  productTruthImpact: string;
  safePublicWording: string;
};

export type AlkonFinancialLegitimacyResult = AlkonLegitimacyReview & {
  fundingMode: AlkonLegitimacyRequest["fundingMode"];
  reserveImpact: "none" | "review" | "required";
  monthlyBurnImpact: "none" | "within_cap" | "over_cap" | "unknown";
  revenueCoverageImpact: "not_required" | "not_covered" | "partial" | "covered";
  taxReserveRequired: boolean;
  accountantReviewRequired: boolean;
  safePaymentPath: string;
};

export type AlkonSecurityLegitimacyResult = AlkonLegitimacyReview & {
  trustedDeviceRequired: boolean;
  stepUpRequired: boolean;
  passkeyReadinessRequired: boolean;
  presenceReadinessRequired: boolean;
  emergencyLockdownRecommended: boolean;
};

export type AlkonTimingLegitimacyResult = AlkonLegitimacyReview & {
  currentStage: AlkonLegitimacyRequest["currentStage"];
  requiredStage: AlkonLegitimacyRequest["currentStage"];
  readinessGap: string;
};

export type AlkonReversibilityLegitimacyResult = AlkonLegitimacyReview & {
  rollbackProfile: AlkonRollbackProfile;
  backupRequired: boolean;
  incidentPlanRequired: boolean;
};

export type AlkonReputationLegitimacyResult = AlkonLegitimacyReview & {
  publicTrustRisk: AlkonDecisionRiskLevel;
  claimsReviewRequired: boolean;
};

export type AlkonLegalGuardianLegitimacyResult = AlkonLegitimacyReview & {
  legalReviewRequired: boolean;
  guardianReviewRequired: boolean;
  safeWording: string;
  blockedReason?: string;
};

export type AlkonFounderResponsibilityResult = AlkonLegitimacyReview & {
  founderDecisionRequired: boolean;
  decisionSummary: string;
  confirmationPhraseRequired: string;
  suggestedReasonPrompt: string;
  auditNote: string;
};

export type AlkonDecisionPermit = {
  permitId: string;
  outcome: AlkonDecisionPermitOutcome;
  actionCategory: AlkonActionCategory;
  authorityLevel: AlkonAuthorityLevel;
  riskLevel: AlkonDecisionRiskLevel;
  legitimacySummary: string;
  failedDimensions: AlkonLegitimacyDimension[];
  requiredReviews: string[];
  safeAlternative: string;
  rollbackRequirement: string;
  auditRequirement: string;
  memoryLesson: string;
  nextSafeAction: string;
  mayExecuteFromWebApp: false;
  paymentExecutionEnabled: false;
  externalCallsEnabled: false;
  secretsAllowed: false;
};

export type AlkonLegitimacyDecision = {
  request: AlkonLegitimacyRequest;
  outcome: AlkonLegitimacyDecisionOutcome;
  authorityLevel: AlkonAuthorityLevel;
  riskLevel: AlkonDecisionRiskLevel;
  reviews: AlkonLegitimacyReview[];
  permit: AlkonDecisionPermit;
  report: AlkonLegitimacyReport;
  nextSafeAction: string;
  memoryLesson: AlkonMemoryLegitimacyLesson;
  founderReviewNeeded: string[];
};

export type AlkonMemoryLegitimacyLesson = {
  lessonId: string;
  appliesTo: AlkonActionCategory[];
  lesson: string;
  futureGuard: string;
  containsSecrets: false;
  containsBankCardData: false;
};

export type AlkonLegitimacyReport = {
  reportId: string;
  title: string;
  summary: string;
  decision: AlkonLegitimacyDecisionOutcome;
  founderResponsibility: string;
  auditReadiness: AlkonAuditReadiness;
};

export type AlkonLegitimacySnapshot = {
  snapshotId: "alkon_sovereign_legitimacy_system";
  name: "Alkon Sovereign Legitimacy System";
  visibility: "private_founder_only";
  publicExposure: false;
  readiness: "ready";
  dimensionsStatus: Record<AlkonLegitimacyDimension, "ready">;
  recentSampleDecisions: AlkonLegitimacyDecision[];
  blockedCategories: AlkonActionCategory[];
  blackHoleCategories: AlkonActionCategory[];
  financialReadiness: {
    paymentExecutionStatus: "disabled";
    bankCardSecretStatus: "forbidden";
    taxReserveReadiness: "readiness_only";
    autopayGovernance: "planned_disabled";
  };
  securityAuthorityReadiness: {
    trustedDevice: "planned";
    stepUpConfirmation: "planned";
    passkey: "planned";
    presenceLiveness: "readiness_only_no_biometrics";
    auditLedger: "readiness_only";
    emergencyLockdown: "readiness_only";
  };
  timingReadiness: {
    currentStage: "laptop_planet";
    launchActivationAllowed: false;
    billingActivationAllowed: false;
    productionActivationAllowed: false;
  };
  reputationReadiness: {
    claimsFirewallReady: true;
    publishingGateInactive: true;
    mediaReviewRequired: true;
  };
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
    noTaxLegalFinancialFinalAdvice: true;
    noSecretsExposed: true;
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noImagesOrRasterAssets: true;
    noFakeClaims: true;
  };
  createdAt: string;
};
