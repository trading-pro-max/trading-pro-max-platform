import {
  proMaxPublicFutureReadiness,
  universeCanonicalHierarchy,
  universeDeepModel,
  universeForbiddenOrderRules,
  universeLayerOrder,
  universeManagementReadiness,
  universeNextAction,
  universeProductTruth,
  type UniverseLayer,
} from "@/lib/server/universe-management";

export type UniverseGateState =
  | "allowed_now"
  | "blocked_now"
  | "future_legal_review"
  | "future_swiss_review"
  | "future_global_review"
  | "future_launch_review";

export type UniverseTruthItem = {
  id: string;
  label: string;
  value: string;
  state: UniverseGateState;
  note: string;
};

export type ProjectUniverseTruthSnapshot = {
  checkedAt: string;
  identityLine: string;
  canonicalHierarchy: typeof universeCanonicalHierarchy;
  deepModel: typeof universeDeepModel;
  layerOrder: UniverseLayer[];
  managementReadiness: typeof universeManagementReadiness;
  proMaxPublicFutureReadiness: typeof proMaxPublicFutureReadiness;
  forbiddenOrderRules: typeof universeForbiddenOrderRules;
  finalLayerTruth: typeof universeProductTruth;
  projectPrivateState: "private_until_legally_ready";
  alkonPrivateReadOnlyState: "private_read_only";
  proMaxTradingProductState: "first_living_product_demo_safe";
  tradingVisualRealismState: "premium_operating_floor_ready_with_notes";
  animatedEarthIdentityState: "code_driven_original_animated";
  swissInspiredIdentityState: "visual_inspiration_only";
  complianceReadinessState: "legal_review_ready_not_approved";
  brandGateState: "frozen_deferred";
  allowedNow: UniverseTruthItem[];
  blockedNow: UniverseTruthItem[];
  futureLegalReview: UniverseTruthItem[];
  futureSwissReview: UniverseTruthItem[];
  futureGlobalReview: UniverseTruthItem[];
  futureLaunchReview: UniverseTruthItem[];
  gates: {
    swissLegalReview: "pending";
    globalLegalReview: "pending";
    publicLaunch: "not_started";
    billing: "not_active";
    realMoney: "disabled";
    brokerFeed: "disabled_not_connected";
    localDayOne: "not_started";
    brandGate: "frozen_deferred";
  };
  productTruth: {
    privateMode: "yes";
    readOnly: "yes";
    demoSafe: "yes";
    realMoney: "disabled";
    brokerExecution: "disabled_not_connected";
    publicLaunch: "not_started";
    billing: "not_active";
    brandGate: "frozen_deferred";
    localDayOne: "not_started";
    privateOriginPublicExposure: "no";
    swissLegalReview: "pending";
    globalLegalReview: "pending";
    swissInspiredVisualIdentityOnly: true;
  };
  complianceReadiness: {
    status: "legal_review_ready_only";
    notFinmaApproved: true;
    notLicensed: true;
    notRegulated: true;
    notPublic: true;
    notBillingActive: true;
    notRealMoneyActive: true;
    notBrokerActive: true;
    investmentAdviceBoundary: "no_investment_advice";
    riskDisclosureBoundary: "risk_disclosure_required_before_public_or_real_money";
    marketingClaimsBoundary: "no_performance_or_regulatory_claims";
    onboardingBoundary: "real_users_need_privacy_terms_support_and_review";
    dataProtectionReviewNeeded: true;
    amlKycReviewNeededIfMoneyOrAccounts: true;
    swissFinancialRegulationReviewNeeded: true;
    globalLegalReviewNeeded: true;
    swissInspiredVisualIdentityOnly: true;
  };
  oneNextAction: string;
  whatNotToDo: string[];
};

const identityLine =
  "Earth-scale intelligence. Swiss-inspired precision. Private until legally ready.";

const allowedNow: UniverseTruthItem[] = [
  {
    id: "private_demo_review",
    label: "Private demo review",
    value: "Allowed now",
    state: "allowed_now",
    note: "Founder and internal review may inspect the platform without public launch or real-money routing.",
  },
  {
    id: "paper_safe_trading_floor",
    label: "Paper-safe trading floor",
    value: "Allowed now",
    state: "allowed_now",
    note: "Demo/read-only market rehearsal, chart reading, and product truth review are allowed.",
  },
  {
    id: "animated_earth_identity",
    label: "Animated Earth identity",
    value: "Allowed now",
    state: "allowed_now",
    note: "Original code-driven Earth identity is allowed as visual inspiration, not as a legal or regulatory claim.",
  },
  {
    id: "founder_universe_readiness",
    label: "Founder universe readiness",
    value: "Allowed now",
    state: "allowed_now",
    note: "Private read-only command center may show blocked gates, one next action, and product truth.",
  },
];

const blockedNow: UniverseTruthItem[] = [
  {
    id: "real_money",
    label: "Real money",
    value: "Disabled",
    state: "blocked_now",
    note: "No real-money routing before legal, product, risk, support, broker, and Ahmad gates close.",
  },
  {
    id: "broker_execution",
    label: "Broker execution",
    value: "Disabled / not connected",
    state: "blocked_now",
    note: "No broker order execution is active.",
  },
  {
    id: "billing",
    label: "Billing",
    value: "Not active",
    state: "blocked_now",
    note: "No payment or billing activation is allowed in this closure.",
  },
  {
    id: "public_launch",
    label: "Public launch",
    value: "Not started",
    state: "blocked_now",
    note: "The platform remains private until legal, product, support, and Founder gates close.",
  },
  {
    id: "brand_gate",
    label: "Brand Gate",
    value: "Frozen / deferred",
    state: "blocked_now",
    note: "No renaming, trademark research, domain research, or candidate adoption is active in this mission.",
  },
];

const futureLegalReview: UniverseTruthItem[] = [
  {
    id: "investment_advice",
    label: "Investment advice boundary",
    value: "Review needed",
    state: "future_legal_review",
    note: "Public copy, onboarding, assistant behavior, and trading education need qualified legal review.",
  },
  {
    id: "risk_disclosure",
    label: "Risk disclosure boundary",
    value: "Review needed",
    state: "future_legal_review",
    note: "Clear risk disclosures are required before any public or real-money path.",
  },
  {
    id: "data_protection",
    label: "Data protection",
    value: "Review needed",
    state: "future_legal_review",
    note: "Real user data flows need privacy, retention, access, deletion, and support review.",
  },
];

const futureSwissReview: UniverseTruthItem[] = [
  {
    id: "swiss_financial_review",
    label: "Swiss financial regulation review",
    value: "Pending",
    state: "future_swiss_review",
    note: "Swiss review is needed before real trading, broker integrations, Swiss-facing public claims, or paid financial services.",
  },
  {
    id: "swiss_visual_boundary",
    label: "Swiss-inspired identity",
    value: "Visual inspiration only",
    state: "future_swiss_review",
    note: "Red/white precision language is visual design inspiration only, with no government endorsement or certification claim.",
  },
];

const futureGlobalReview: UniverseTruthItem[] = [
  {
    id: "global_legal_review",
    label: "Global legal review",
    value: "Pending",
    state: "future_global_review",
    note: "Global launch, marketing, data, finance, and user onboarding need review by target market.",
  },
  {
    id: "aml_kyc",
    label: "AML / KYC",
    value: "Needed if money/accounts are introduced",
    state: "future_global_review",
    note: "Money movement, accounts, payouts, payments, or broker execution require AML/KYC review.",
  },
];

const futureLaunchReview: UniverseTruthItem[] = [
  {
    id: "public_launch_gate",
    label: "Public launch gate",
    value: "Future review",
    state: "future_launch_review",
    note: "Requires Product Truth, legal, privacy, support, billing, broker/feed, brand, and Ahmad acceptance gates.",
  },
  {
    id: "local_day_one",
    label: "Local Day One",
    value: "Not started",
    state: "future_launch_review",
    note: "Ahmad has not accepted Local Day One start.",
  },
];

export function getProjectUniverseTruthSnapshot(
  checkedAt = "2026-04-28T00:00:00.000Z"
): ProjectUniverseTruthSnapshot {
  return {
    checkedAt,
    identityLine,
    canonicalHierarchy: universeCanonicalHierarchy,
    deepModel: universeDeepModel,
    layerOrder: universeLayerOrder,
    managementReadiness: universeManagementReadiness,
    proMaxPublicFutureReadiness,
    forbiddenOrderRules: universeForbiddenOrderRules,
    finalLayerTruth: universeProductTruth,
    projectPrivateState: "private_until_legally_ready",
    alkonPrivateReadOnlyState: "private_read_only",
    proMaxTradingProductState: "first_living_product_demo_safe",
    tradingVisualRealismState: "premium_operating_floor_ready_with_notes",
    animatedEarthIdentityState: "code_driven_original_animated",
    swissInspiredIdentityState: "visual_inspiration_only",
    complianceReadinessState: "legal_review_ready_not_approved",
    brandGateState: "frozen_deferred",
    allowedNow,
    blockedNow,
    futureLegalReview,
    futureSwissReview,
    futureGlobalReview,
    futureLaunchReview,
    gates: {
      swissLegalReview: "pending",
      globalLegalReview: "pending",
      publicLaunch: "not_started",
      billing: "not_active",
      realMoney: "disabled",
      brokerFeed: "disabled_not_connected",
      localDayOne: "not_started",
      brandGate: "frozen_deferred",
    },
    productTruth: {
      privateMode: "yes",
      readOnly: "yes",
      demoSafe: "yes",
      realMoney: "disabled",
      brokerExecution: "disabled_not_connected",
      publicLaunch: "not_started",
      billing: "not_active",
      brandGate: "frozen_deferred",
      localDayOne: "not_started",
      privateOriginPublicExposure: "no",
      swissLegalReview: "pending",
      globalLegalReview: "pending",
      swissInspiredVisualIdentityOnly: true,
    },
    complianceReadiness: {
      status: "legal_review_ready_only",
      notFinmaApproved: true,
      notLicensed: true,
      notRegulated: true,
      notPublic: true,
      notBillingActive: true,
      notRealMoneyActive: true,
      notBrokerActive: true,
      investmentAdviceBoundary: "no_investment_advice",
      riskDisclosureBoundary: "risk_disclosure_required_before_public_or_real_money",
      marketingClaimsBoundary: "no_performance_or_regulatory_claims",
      onboardingBoundary: "real_users_need_privacy_terms_support_and_review",
      dataProtectionReviewNeeded: true,
      amlKycReviewNeededIfMoneyOrAccounts: true,
      swissFinancialRegulationReviewNeeded: true,
      globalLegalReviewNeeded: true,
      swissInspiredVisualIdentityOnly: true,
    },
    oneNextAction:
      universeNextAction,
    whatNotToDo: [
      "Do not rename anything.",
      "Do not start Brand Gate research.",
      "Do not start public launch.",
      "Do not start Local Day One.",
      "Do not activate billing.",
      "Do not activate real-money trading.",
      "Do not activate broker execution.",
      "Do not claim legal approval, licensing, regulation, investment advice, performance guarantees, guaranteed outcomes, or zero-risk trading.",
      "Do not expose the private origin publicly.",
    ],
  };
}
