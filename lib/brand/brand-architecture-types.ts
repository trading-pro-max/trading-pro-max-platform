export type BrandRoot = "pro_max";

export type PublicProduct = "pro_max_trading";

export type PrivateUniverse = "alkon";

export type BrandAudience =
  | "public_user"
  | "founder_private"
  | "internal_technical";

export type BrandNameSet = {
  publicMotherBrand: "Pro Max";
  publicPrimeProduct: "Pro Max Trading";
  publicAssistant: "Pro Max Assistant";
  legacyProjectName: "Trading Pro Max";
  internalNamespace: "TPM";
  privateUniverse: "Alkon";
  privateUniverseArabic: "الكون";
};

export type BrandArchitectureSnapshot = {
  root: BrandRoot;
  publicProduct: PublicProduct;
  privateUniverse: PrivateUniverse;
  audience: BrandAudience;
  names: BrandNameSet;
  publicCopyRule: string;
  namespacePolicy: string;
  primeWorld: "Pro Max Trading";
  futureWorldsPublic: false;
  alkonPublic: false;
  productTruth: {
    proMaxTradingIsPrimeWorld: true;
    legacyTradingProMaxNameTransitional: true;
    tpmNamespaceAllowedInternally: true;
    noFutureWorldLaunch: true;
    noPublicAlkonExposure: true;
  };
};
