import type {
  BrandArchitectureSnapshot,
  BrandAudience,
  BrandNameSet,
} from "./brand-architecture-types";

export const BRAND_NAME_SET: BrandNameSet = {
  publicMotherBrand: "Pro Max",
  publicPrimeProduct: "Pro Max Trading",
  publicAssistant: "Pro Max Assistant",
  legacyProjectName: "Trading Pro Max",
  internalNamespace: "TPM",
  privateUniverse: "Alkon",
  privateUniverseArabic: "الكون",
};

export const PUBLIC_BRAND_ALLOWED_TERMS = [
  BRAND_NAME_SET.publicMotherBrand,
  BRAND_NAME_SET.publicPrimeProduct,
  BRAND_NAME_SET.publicAssistant,
  "Trading Workspace",
  "Markets",
  "Plans",
  "Apps / Platforms",
  "Academy",
  "Community",
  "Support",
  "Free",
  "Pro",
  "VIP",
  "Institutional",
  "Journal",
  "Coach",
  "Settings",
  "Diagnostics",
  "Readiness",
  "Paper-safe",
  "Planned",
  "Inactive",
  "Future",
  "Adaptive Atmosphere",
  "Solar Theme",
  "Weather Theme",
  "Static Mode",
  "Personal Reality",
  "Earth-native",
] as const;

export const PUBLIC_BRAND_FORBIDDEN_TERMS = [
  BRAND_NAME_SET.privateUniverse,
  BRAND_NAME_SET.privateUniverseArabic,
  "Founder Command",
  "Genesis Universe",
  "Future Worlds",
  "World Seeds",
  "Digital Universe Runtime",
  "Sovereign Consciousness",
  "Cosmic Physics",
  "Task Passport",
  "Result Tribunal",
  "Product Memory internals",
  "Risk Belt",
  "Black Hole Zone",
] as const;

export function getBrandArchitectureSnapshot(
  audience: BrandAudience = "public_user"
): BrandArchitectureSnapshot {
  return {
    root: "pro_max",
    publicProduct: "pro_max_trading",
    privateUniverse: "alkon",
    audience,
    names: BRAND_NAME_SET,
    publicCopyRule:
      "Public users see Pro Max as the mother brand and Pro Max Trading as the first paper-safe product.",
    namespacePolicy:
      "TPM may remain in internal code, tests, CSS classes, API compatibility, and technical modules where renaming would create churn.",
    primeWorld: BRAND_NAME_SET.publicPrimeProduct,
    futureWorldsPublic: false,
    alkonPublic: false,
    productTruth: {
      proMaxTradingIsPrimeWorld: true,
      legacyTradingProMaxNameTransitional: true,
      tpmNamespaceAllowedInternally: true,
      noFutureWorldLaunch: true,
      noPublicAlkonExposure: true,
    },
  };
}

export function getPublicBrandNames() {
  return {
    motherBrand: BRAND_NAME_SET.publicMotherBrand,
    primeProduct: BRAND_NAME_SET.publicPrimeProduct,
    assistant: BRAND_NAME_SET.publicAssistant,
  };
}

export function getPrivateBrandUniverse() {
  return {
    motherBrand: BRAND_NAME_SET.publicMotherBrand,
    primeWorld: BRAND_NAME_SET.publicPrimeProduct,
    privateUniverse: BRAND_NAME_SET.privateUniverse,
    privateUniverseArabic: BRAND_NAME_SET.privateUniverseArabic,
    futureWorldsReadiness: "private_world_seeds_only" as const,
    founderFinalAuthority: true,
    publicExposure: false,
  };
}
