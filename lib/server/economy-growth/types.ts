export type EconomyReadinessState =
  | "active"
  | "planned"
  | "future"
  | "inactive"
  | "blocked"
  | "review_required";

export type EconomyRiskLevel = "low" | "medium" | "high" | "critical";

export type EconomyPlanKey = "free_demo" | "pro" | "vip" | "enterprise";

export type EconomyPlanRole = {
  plan: EconomyPlanKey;
  label: string;
  state: EconomyReadinessState;
  economyRole: string;
  activeValue: string[];
  plannedValue: string[];
  upgradePath: string;
  mustNotClaim: string[];
};

export type MonetizationReadiness = {
  billing: "inactive";
  checkout: "inactive";
  subscriptions: "inactive";
  paidEntitlements: "not_enabled";
  currentPerformanceFee: "0%";
  performanceBasedRevenue: "hidden_inactive_research_only";
  futureResearchRange: "5%-10%";
  legalReviewRequired: true;
  regulatoryReviewRequired: true;
  userConsentRequired: true;
  founderOnlyActivationAuthority: true;
  userVisible: false;
};

export type CommunityReadiness = {
  status: "planned_only";
  layers: Array<{
    key: string;
    label: string;
    state: EconomyReadinessState;
    safety: string[];
  }>;
  guardianModerationRequired: true;
  legalClaimReviewRequired: true;
  fakeActiveRooms: false;
};

export type MediaOfficeChannel = {
  key: string;
  label: string;
  state: "not_connected" | "planned";
  tokensPresent: false;
  publishingActive: false;
  metricsPresent: false;
};

export type MediaOfficeReadiness = {
  status: "draft_review_only";
  channels: MediaOfficeChannel[];
  capabilities: string[];
  requiredReviews: string[];
  noAccountsConnected: true;
  noApiTokens: true;
  externalPublishingActive: false;
  fakeMetricsIncluded: false;
};

export type AiVideoStudioReadiness = {
  status: "script_readiness_only";
  capabilities: string[];
  contentCategories: string[];
  uploadActive: false;
  publishingActive: false;
  fakeViewsIncluded: false;
  legalReviewRequired: true;
  guardianReviewRequired: true;
  founderApprovalRequired: true;
};

export type PartnershipReadiness = {
  status: "inactive_planned";
  sponsoredClock: {
    state:
      | "inactive"
      | "planned"
      | "partner_review"
      | "legal_review"
      | "founder_approval_required"
      | "scheduled"
      | "active"
      | "expired"
      | "blocked";
    publicVisibility: "off";
    companyNamesInUserUi: false;
    contractRequired: true;
  };
  partnershipTypes: string[];
  requiredReviews: string[];
  fakePartnershipClaims: false;
  impliedEndorsementAllowed: false;
};

export type ResourceEconomyMap = {
  hidden: Array<{ resource: string; ethicalValue: string; protection: string }>;
  visible: Array<{ resource: string; ethicalValue: string; protection: string }>;
  living: Array<{ resource: string; ethicalValue: string; protection: string }>;
  strategic: Array<{ resource: string; ethicalValue: string; protection: string }>;
  rules: string[];
};

export type FinalAcceptanceReadiness = {
  status: "internal_review_only";
  launchReady: false;
  publicLaunchApproved: false;
  productionApproved: false;
  humanVisualAcceptanceRequired: true;
  realWorldBetaTestingRequired: true;
  legalRegulatoryReviewRequiredLater: true;
  recommendation: "continue_internal_refinement";
  complete: string[];
  partial: string[];
  plannedOnly: string[];
  blocked: string[];
};

export type FinalGapChecklistItem = {
  area: string;
  status:
    | "pass"
    | "partial"
    | "blocker"
    | "planned"
    | "blocked_by_design"
    | "requires_human_acceptance"
    | "requires_real_world_testing"
    | "out_of_scope_until_launch_phase";
  note: string;
};

export type NonLaunchRoadmapItem = {
  priority: number;
  area: string;
  nextStep: string;
  status: "next_internal" | "planned" | "later" | "last";
};

export type PlanetEconomyGrowthReadinessSnapshot = {
  checkedAt: string;
  mode: "planet_economy_media_growth_readiness";
  economy: {
    treasuryState: "readiness_only";
    revenueReadiness: "planned_not_active";
    monetizationReadiness: MonetizationReadiness;
    planRoles: EconomyPlanRole[];
    resourceToValueModel: string[];
  };
  growth: {
    path: EconomyPlanKey[];
    conversionPrinciples: string[];
    retentionResources: string[];
    noDarkPatterns: true;
  };
  vip: {
    status: "planned_not_active";
    strategy: string[];
    privateRooms: "planned_not_active";
    prioritySupport: "planned_not_active";
    mustNotClaim: string[];
  };
  community: CommunityReadiness;
  mediaOffice: MediaOfficeReadiness;
  aiVideoStudio: AiVideoStudioReadiness;
  partnerships: PartnershipReadiness;
  resourcesToEconomy: ResourceEconomyMap;
  finalAcceptance: FinalAcceptanceReadiness;
  finalGapChecklist: FinalGapChecklistItem[];
  nonLaunchRoadmap: NonLaunchRoadmapItem[];
  founderCommandSignals: string[];
  truth: {
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerFeedActivation: "inactive";
    billing: "inactive";
    publicLaunch: "inactive";
    socialPublishing: "inactive";
    productionSecretsTouched: false;
    fakeUsersIncluded: false;
    fakeRevenueIncluded: false;
    fakeMetricsIncluded: false;
    fakePartnershipsIncluded: false;
    brandNamesUsedWithoutContracts: false;
  };
};
