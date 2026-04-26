import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type RealWorldLaunchReadinessStatus =
  | "not_ready"
  | "partial"
  | "ready_for_waitlist"
  | "ready_for_private_beta"
  | "ready_for_soft_launch"
  | "blocked";

export type LaunchReadinessStage =
  | "laptop_planet"
  | "waitlist"
  | "soft_launch_paper_only"
  | "pro_paid_limited_later"
  | "production_economic"
  | "public_launch_after_gate";

export type ReadinessTruth = {
  launchActive: false;
  productionActive: false;
  billingActive: false;
  brokerFeedActive: false;
  liveExecutionActive: false;
  realMoneyActive: false;
  socialPublishingActive: false;
  externalAccountsCreated: false;
  emailSendingActive: false;
  paymentCredentialsStored: false;
  productionSecretsTouched: false;
  fakeUsersRevenueMetrics: false;
};

export type BudgetLineItem = {
  key: string;
  label: string;
  suggestedRangeChf: [number, number];
  plannedMonthlyChf: number;
  readiness: "planned" | "future" | "blocked";
  note: string;
};

export type LaunchBudgetSnapshot = {
  checkedAt: string;
  currency: "CHF";
  monthlyCapChf: 250;
  initialOperatingTargetChf: number;
  capRespected: boolean;
  founderApprovalRequiredAboveCap: true;
  noPurchase: true;
  noAccountCreation: true;
  noBillingActivation: true;
  lineItems: BudgetLineItem[];
};

export type LaunchInfrastructureSnapshot = {
  checkedAt: string;
  status: "partial";
  hostingOptions: string[];
  databaseOptions: string[];
  backupPlan: string[];
  monitoringPlan: string[];
  dnsCdnSslPlan: string[];
  rollbackPlan: string[];
  noProvisioning: true;
  noExternalCalls: true;
};

export type WaitlistReadinessSnapshot = {
  checkedAt: string;
  status: "partial";
  publicCopy: "Waitlist planned";
  emailCapture: "future_provider_required";
  privacyNoticeRequired: true;
  fakeSignupCountAllowed: false;
  emailSendingActive: false;
  hiddenTrackingAllowed: false;
  backendActive: false;
};

export type LegalReadinessSnapshot = {
  checkedAt: string;
  status: "partial";
  requiredPages: string[];
  noFinancialAdvicePolicy: true;
  noProfitGuaranteePolicy: true;
  tradingRiskDisclosureRequired: true;
  swissCompanyStatusClaimAllowed: false;
  shariaCertificationClaimAllowed: false;
  partnershipClaimAllowedWithoutContract: false;
  legalReviewRequired: true;
};

export type SupportReadinessSnapshot = {
  checkedAt: string;
  status: "partial";
  surfaces: string[];
  noEmailSending: true;
  fakeTicketBackendAllowed: false;
  escalationPolicyRequired: true;
  securityContactReadiness: "planned";
};

export type BillingReadinessSnapshot = {
  checkedAt: string;
  status: "blocked";
  provider: "future_only";
  checkoutActive: false;
  subscriptionsActive: false;
  invoicesActive: false;
  paymentCredentialsStored: false;
  planPricingDraft: "future";
  legalReviewRequired: true;
  founderApprovalRequired: true;
  performanceFeePublicUi: false;
};

export type BetaReadinessSnapshot = {
  checkedAt: string;
  status: "not_ready";
  betaType: "future_private_paper_beta";
  requiredBeforeBeta: string[];
  noRealMoney: true;
  noLiveExecution: true;
  noPublicLaunch: true;
};

export type LaunchGateSnapshot = {
  checkedAt: string;
  status: RealWorldLaunchReadinessStatus;
  canLaunch: false;
  canEnterWaitlist: false;
  canEnterPrivateBeta: false;
  canEnterSoftLaunch: false;
  founderFinalDecisionRequired: true;
  gates: Array<{
    key: string;
    label: string;
    status: "ready" | "partial" | "blocked" | "not_ready";
    required: boolean;
    evidence: string;
  }>;
  blockers: string[];
  nextSafeAction: string;
  truth: ReadinessTruth;
};

export type RealWorldLaunchReadinessSnapshot = {
  checkedAt: string;
  mode: "real_world_launch_readiness_gate";
  status: RealWorldLaunchReadinessStatus;
  stages: LaunchReadinessStage[];
  budget: LaunchBudgetSnapshot;
  infrastructure: LaunchInfrastructureSnapshot;
  waitlist: WaitlistReadinessSnapshot;
  legal: LegalReadinessSnapshot;
  support: SupportReadinessSnapshot;
  billing: BillingReadinessSnapshot;
  beta: BetaReadinessSnapshot;
  gate: LaunchGateSnapshot;
  founderCommand: {
    budgetCapChf: 250;
    finalDecisionRequired: true;
    blockedActivations: string[];
    nextSafeAction: string;
  };
  truth: ReadinessTruth;
};

export type RealWorldLaunchReadinessDiagnosticsProbe = DiagnosticsProbe;
