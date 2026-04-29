import "server-only";

export type ArchitectureRegistryCategory =
  | "primary"
  | "compatibility"
  | "protected"
  | "cleanup_candidate"
  | "needs_ahmad_decision";

export type ArchitectureRegistryLayer =
  | "ahmad_private_devices"
  | "alkawn_universe"
  | "ahmad_digital_vault"
  | "protection_core"
  | "universe_one"
  | "swiss_local_constitution"
  | "pro_max_galaxy"
  | "earth_planet"
  | "living_earth_reality"
  | "trading_surface"
  | "global_layer"
  | "public_pro_max_future"
  | "alkon_background_guardian"
  | "product_truth"
  | "brand_gate"
  | "kernel"
  | "jar"
  | "reality_conversion"
  | "permission_to_exist"
  | "desktop_mobile_strategy"
  | "reports_docs_tests";

export type ArchitectureRegistryItemType =
  | "route"
  | "api"
  | "server_module"
  | "client_module"
  | "component"
  | "style"
  | "report"
  | "doc"
  | "test"
  | "asset"
  | "script";

export type ArchitectureRegistryRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ArchitectureRegistryItem = {
  id: string;
  label: string;
  category: ArchitectureRegistryCategory;
  layer: ArchitectureRegistryLayer;
  path: string;
  type: ArchitectureRegistryItemType;
  purpose: string;
  canonicalOwner: string;
  importsOrUsedBy: string[];
  productTruthImpact: string;
  risk: ArchitectureRegistryRisk;
  recommendation: string;
  evidence: string[];
};

export type ArchitectureRegistrySummary = {
  total: number;
  byCategory: Record<ArchitectureRegistryCategory, number>;
  unresolvedConflictCount: number;
  primaryCount: number;
  compatibilityCount: number;
  protectedCount: number;
  cleanupCandidateCount: number;
  needsAhmadDecisionCount: number;
  infinityModeSafe: false;
  ultimateDepthSafe: false;
  safestNextAction:
    | "controlled canonical cleanup"
    | "existing kernel canonicalization"
    | "Absolute Founder Boundary 100"
    | "Al-Kawn Visual Map"
    | "Al-Kawn Desktop Operating Environment";
};
