export type SurfaceBoundaryCategory =
  | "public_user"
  | "authenticated_user"
  | "advanced_user"
  | "diagnostics_public_safe"
  | "private_founder"
  | "internal_readiness"
  | "invisible_operating_layer";

export type SurfaceBoundaryKey =
  | "public_entry"
  | "trading_workspace"
  | "markets"
  | "plans"
  | "apps_platforms"
  | "academy"
  | "community"
  | "support"
  | "settings"
  | "diagnostics"
  | "assistant"
  | "journal_coach"
  | "founder_command"
  | "local_operations"
  | "construction_queue"
  | "product_memory"
  | "secrets_authority"
  | "world_interface"
  | "security_sovereignty"
  | "media_office"
  | "treasury"
  | "codex_tasks";

export type SurfaceBoundaryRiskLevel = "low" | "medium" | "high" | "critical";

export type SurfaceBoundaryContract = {
  key: SurfaceBoundaryKey;
  label: string;
  audience: SurfaceBoundaryCategory;
  allowedTerminology: string[];
  forbiddenTerminology: string[];
  visibleSystems: string[];
  hiddenSystems: string[];
  productTruthAllowed: boolean;
  planTruthAllowed: boolean;
  founderOnly: boolean;
  riskLevel: SurfaceBoundaryRiskLevel;
  leakPreventionRules: string[];
};

export type SurfaceBoundarySnapshot = {
  checkedAt: string;
  mode: "dual_world_surface_boundaries";
  doctrine: {
    publicUserWorld: string;
    privateFounderWorld: string;
    invisibleOperatingLayer: string;
    coreLaw: string;
  };
  publicAllowedLanguage: string[];
  publicForbiddenLanguage: string[];
  surfaces: SurfaceBoundaryContract[];
  summary: {
    publicSurfaces: number;
    privateFounderSurfaces: number;
    invisibleLayerSurfaces: number;
    publicNavigationComplete: boolean;
    publicDiagnosticsSafe: boolean;
    privateFounderWorldLinkedPublicly: false;
    internalTermsAllowedInPublicUi: false;
  };
  truth: {
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerFeedActivation: "blocked";
    billingActivation: "blocked";
    publicLaunch: "inactive";
    socialPublishing: "inactive";
    secretsExposed: false;
    fakeUsersRevenueMetrics: false;
    uncontrolledAutomation: false;
  };
};

export type InvisibleLayerMappingKey =
  | "product_truth_live_blocked"
  | "billing_inactive"
  | "vip_planned"
  | "founder_command_private"
  | "security_sovereignty"
  | "product_memory"
  | "construction_queue"
  | "world_interface"
  | "media_office";

export type InvisibleLayerOutputMapping = {
  key: InvisibleLayerMappingKey;
  internalSystem: string;
  publicOutput: string;
  founderOutput: string;
  hiddenFromPublic: boolean;
};
