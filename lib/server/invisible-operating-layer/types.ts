export type InvisibleOperatingSystemKey =
  | "product_truth"
  | "plan_entitlements"
  | "tpm_assistant_context"
  | "why_blocked"
  | "guardian"
  | "legal"
  | "trust_governor"
  | "brand_intelligence"
  | "product_memory"
  | "sovereign_autonomy"
  | "codex_governance"
  | "local_day_cycle"
  | "diagnostics"
  | "world_interface"
  | "security_sovereignty"
  | "secrets_authority";

export type InvisibleOperatingLayerSystem = {
  key: InvisibleOperatingSystemKey;
  privateLabel: string;
  publicLabel: string | null;
  publicOutput: string | null;
  status: "ready" | "readiness_only" | "blocked" | "hidden";
  visibleToPublicUsers: boolean;
  visibleToFounder: boolean;
  notes: string;
};

export type PublicSafeOperatingOutput = {
  key: InvisibleOperatingSystemKey;
  publicLabel: string;
  publicOutput: string;
  status: "ready" | "readiness_only" | "blocked";
};

export type InvisibleOperatingLayerSnapshot = {
  checkedAt: string;
  mode: "invisible_operating_intelligence_map";
  systems: InvisibleOperatingLayerSystem[];
  publicSafeOutputs: PublicSafeOperatingOutput[];
  hiddenFromPublic: InvisibleOperatingSystemKey[];
  founderVisibleSystems: InvisibleOperatingSystemKey[];
  truth: {
    publicInternalTerminologyLeakAllowed: false;
    secretsVisibleToPublic: false;
    preciseLocationTracking: false;
    externalCalls: false;
    shellExecution: false;
    liveExecution: false;
    realMoney: false;
    brokerFeed: false;
    billing: false;
    socialPublishing: false;
  };
};
