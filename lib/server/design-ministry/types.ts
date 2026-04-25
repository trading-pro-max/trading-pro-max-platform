import "server-only";

export type DesignAuthorityKey =
  | "design_system"
  | "plan_style"
  | "platform_experience"
  | "motion_state"
  | "visual_quality";

export type DesignAuthority = {
  key: DesignAuthorityKey;
  label: string;
  mandate: string;
  owns: string[];
  requiredPartners: string[];
  forbiddenActions: string[];
};

export type MinistryPlanIdentityKey =
  | "free"
  | "pro"
  | "vip"
  | "institutional"
  | "founder_command";

export type MinistryPlanIdentity = {
  key: MinistryPlanIdentityKey;
  publicLabel: string;
  audience: "public" | "founder_internal";
  palette: string;
  feel: string;
  state: "active_paper_safe" | "planned_locked" | "future_planned" | "internal_private";
  mustFeelLike: string[];
  mustNotImply: string[];
};

export type PlatformExperienceKey =
  | "web_public"
  | "web_workstation"
  | "desktop_future"
  | "mobile_future"
  | "founder_command_desktop_future"
  | "founder_command_mobile_future";

export type PlatformExperienceRule = {
  key: PlatformExperienceKey;
  label: string;
  currentState: "active" | "foundation_ready" | "future_planned" | "internal_private";
  designRule: string;
  chartPriority: "primary" | "secondary" | "not_applicable";
  motionRule: string;
  forbiddenScope: string[];
};

export type DesignMinistryReadinessStatus =
  | "ready"
  | "partial"
  | "review_required"
  | "blocked";

export type DesignMinistrySnapshot = {
  checkedAt: string;
  mode: "visual_identity_platform_design_ministry";
  status: DesignMinistryReadinessStatus;
  ministryName: "Ministry of Visual Identity, Plan Experience & Platform Design";
  authorities: DesignAuthority[];
  planIdentities: MinistryPlanIdentity[];
  platformExperiences: PlatformExperienceRule[];
  integrations: {
    visualAcceptance: {
      status: string;
      averageScoreEstimate: number;
      humanAcceptanceRequired: boolean;
    };
    productTruth: {
      liveExecution: "blocked";
      realMoneyRouting: "blocked";
      billing: "inactive";
      publicLaunch: "inactive";
      socialPublishing: "inactive";
      founderCommand: "owner_only_private";
    };
    planEntitlements: {
      currentPlan: string;
      publicPlans: string[];
      paidActivationFaked: false;
    };
    productMemory: {
      openProductGaps: number;
      memorySafetyStatus: string;
    };
    founderCommand: {
      privateOnly: true;
      publicNavigationVisible: false;
      userPlanFeature: false;
    };
  };
  diagnostics: {
    designMinistryReadiness: "ready";
    planIdentityReadiness: "ready";
    visualGovernanceReadiness: "ready";
    publicLanguageGuarded: true;
  };
  publicLanguage: {
    allowed: string[];
    forbiddenForNormalUsers: string[];
  };
  truth: {
    launchActivated: false;
    productionActivated: false;
    liveExecutionActivated: false;
    realMoneyActivated: false;
    brokerFeedActivated: false;
    billingActivated: false;
    founderCommandPublic: false;
    fakePaidActivation: false;
  };
};
