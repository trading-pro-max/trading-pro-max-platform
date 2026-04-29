export type UniverseLayerId =
  | "ahmad_private_devices"
  | "alkawn_universe"
  | "ahmad_digital_vault"
  | "protection_core"
  | "universe_one"
  | "swiss_local_constitution"
  | "pro_max_galaxy"
  | "earth_planet"
  | "living_earth_reality"
  | "trading_ground"
  | "global_layer"
  | "public_pro_max_surfaces"
  | "alkon_background_guardian";

export type UniverseLayer = {
  id: UniverseLayerId;
  layerOrder: number;
  label: string;
  role: string;
  visibility:
    | "private_founder_device_only"
    | "private_strategy_only"
    | "future_public_after_gates"
    | "private_background";
  truth: string;
  publicExposure: boolean;
  state:
    | "active_private"
    | "demo_safe"
    | "future_blocked"
    | "private_read_only"
    | "decision_required";
  canonicalStatus: "primary" | "protected" | "compatibility" | "needs_ahmad_decision";
};

export const universeLayerOrder: UniverseLayer[] = [
  {
    id: "ahmad_private_devices",
    layerOrder: 0,
    label: "Ahmad Private Devices",
    role: "private_device_runtime_only",
    visibility: "private_founder_device_only",
    truth: "الكون works only on Ahmad's private devices.",
    publicExposure: false,
    state: "active_private",
    canonicalStatus: "primary",
  },
  {
    id: "alkawn_universe",
    layerOrder: 1,
    label: "الكون / Universe",
    role: "ahmad_private_electronic_self_main_private_project",
    visibility: "private_founder_device_only",
    truth:
      "الكون هو نسخة أحمد الإلكترونية الخاصة. Universe is only the English technical translation where useful.",
    publicExposure: false,
    state: "active_private",
    canonicalStatus: "primary",
  },
  {
    id: "ahmad_digital_vault",
    layerOrder: 2,
    label: "Ahmad Digital Vault",
    role: "private_documents_secrets_memory_decisions_strategy",
    visibility: "private_strategy_only",
    truth:
      "Private vault meaning is documented only; no raw personal documents or secrets are stored by this cleanup.",
    publicExposure: false,
    state: "decision_required",
    canonicalStatus: "needs_ahmad_decision",
  },
  {
    id: "protection_core",
    layerOrder: 3,
    label: "Protection Core",
    role: "permissions_audit_kill_switch_secret_protection_strategy",
    visibility: "private_strategy_only",
    truth:
      "Protection Core is a required private safety concept; implementation waits for kernel canonicalization and Ahmad approval.",
    publicExposure: false,
    state: "decision_required",
    canonicalStatus: "needs_ahmad_decision",
  },
  {
    id: "universe_one",
    layerOrder: 4,
    label: "Universe One",
    role: "literal_living_reality_system",
    visibility: "private_founder_device_only",
    truth:
      "Universe One is the literal living reality system: real when sourced, simulated when labeled.",
    publicExposure: false,
    state: "active_private",
    canonicalStatus: "primary",
  },
  {
    id: "swiss_local_constitution",
    layerOrder: 5,
    label: "Swiss Local Constitution",
    role: "local_swiss_review_layer_above_global_layer",
    visibility: "private_strategy_only",
    truth:
      "Swiss Local Constitution sits above Global Layer as a review gate; it is not legal approval, FINMA approval, certification, or endorsement.",
    publicExposure: false,
    state: "decision_required",
    canonicalStatus: "needs_ahmad_decision",
  },
  {
    id: "pro_max_galaxy",
    layerOrder: 6,
    label: "Pro Max Galaxy",
    role: "product_galaxy_inside_alkawn",
    visibility: "future_public_after_gates",
    truth: "Pro Max Galaxy is inside الكون. Pro Max is the future public product, not الكون.",
    publicExposure: false,
    state: "future_blocked",
    canonicalStatus: "primary",
  },
  {
    id: "earth_planet",
    layerOrder: 7,
    label: "Earth Planet",
    role: "first_planet_complete_trading_project",
    visibility: "future_public_after_gates",
    truth:
      "Earth Planet is the trading project and compatibility successor to the earlier Pro Max Earth wording.",
    publicExposure: false,
    state: "demo_safe",
    canonicalStatus: "primary",
  },
  {
    id: "living_earth_reality",
    layerOrder: 8,
    label: "Living Earth Reality",
    role: "device_time_and_device_date_life_layers",
    visibility: "future_public_after_gates",
    truth: "Living Earth Reality uses device-time and device-date simulation.",
    publicExposure: false,
    state: "demo_safe",
    canonicalStatus: "primary",
  },
  {
    id: "trading_ground",
    layerOrder: 9,
    label: "/trading",
    role: "trading_surface_on_earth_planet",
    visibility: "future_public_after_gates",
    truth: "Trading Surface on Earth Planet is demo-safe/read-only now.",
    publicExposure: false,
    state: "demo_safe",
    canonicalStatus: "primary",
  },
  {
    id: "global_layer",
    layerOrder: 10,
    label: "Global Layer",
    role: "future_global_layer_under_swiss_local_constitution",
    visibility: "future_public_after_gates",
    truth: "Global Layer is future and remains under Swiss Local Constitution review.",
    publicExposure: false,
    state: "future_blocked",
    canonicalStatus: "needs_ahmad_decision",
  },
  {
    id: "public_pro_max_surfaces",
    layerOrder: 11,
    label: "Public Pro Max Future Surfaces",
    role: "future_public_product_layer",
    visibility: "future_public_after_gates",
    truth: "Public Pro Max launch is blocked until all gates close.",
    publicExposure: false,
    state: "future_blocked",
    canonicalStatus: "protected",
  },
  {
    id: "alkon_background_guardian",
    layerOrder: 12,
    label: "ALKON Background Guardian",
    role: "private_background_guardian_intelligence_support",
    visibility: "private_background",
    truth: "ALKON is private/background, not second.",
    publicExposure: false,
    state: "private_read_only",
    canonicalStatus: "protected",
  },
];

export const universeCanonicalHierarchy = [
  "Ahmad Private Devices",
  "الكون / Universe - Ahmad private electronic self / main private project",
  "Ahmad Digital Vault - private documents, secrets, memory, decisions",
  "Protection Core - permissions, audit, kill switch, secret protection",
  "Universe One - literal living reality system",
  "Swiss Local Constitution - above Global Layer",
  "Pro Max Galaxy - product galaxy inside الكون",
  "Earth Planet - first planet / complete trading project",
  "Living Earth Reality - device-time life layers",
  "/trading - trading surface on Earth",
  "Global Layer - future, under Swiss Constitution",
  "Public Pro Max Future Surfaces - blocked",
  "ALKON - private background guardian",
] as const;

export const universeDeepModel = {
  ahmadPrivateDevices: {
    layerOrder: 0,
    universeAllowedOnlyInPrivateFounderDeviceContext: true,
    publicExposure: false,
  },
  alkawnUniverse: {
    layerOrder: 1,
    arabicFounderMeaning: "الكون هو نسخة أحمد الإلكترونية الخاصة.",
    englishTechnicalTranslation: "Universe",
    role: "ahmad_private_electronic_self_main_private_project",
    highestManagementLayer: true,
    communicatesOnlyWithAhmad: true,
    privateOnlyOnAhmadDevices: true,
    neverPublicNow: true,
    manages: "Pro Max Galaxy",
  },
  universe: {
    layerOrder: 1,
    role: "technical_translation_of_alkawn",
    highestManagementLayer: true,
    manages: "Pro Max Galaxy",
    privateOnlyOnAhmadDevices: true,
    neverPublicNow: true,
  },
  ahmadDigitalVault: {
    layerOrder: 2,
    role: "private_documents_secrets_memory_decisions_strategy",
    implementation: "not_built_in_this_cleanup",
    requiresAhmadDecision: true,
    rawPersonalDocumentsStored: false,
    secretsStoredInClient: false,
  },
  protectionCore: {
    layerOrder: 3,
    role: "permissions_audit_kill_switch_secret_protection_strategy",
    implementation: "not_built_in_this_cleanup",
    requiresKernelCanonicalization: true,
    requiresAhmadDecision: true,
  },
  universeOne: {
    layerOrder: 4,
    role: "literal_living_reality_system",
    realWhenSourced: true,
    simulatedWhenLabeled: true,
    weather: "not_connected",
    location: "not_requested",
    soundscape: "user_controlled_off_by_default",
  },
  swissLocalConstitution: {
    layerOrder: 5,
    role: "above_global_layer_review_gate",
    legalReview: "pending",
    finmaApprovalClaim: false,
    licensedRegulatedClaim: false,
    swissGovernmentEndorsementClaim: false,
  },
  proMaxGalaxy: {
    layerOrder: 6,
    role: "product_galaxy_inside_alkawn",
    proMaxIsUniverse: false,
    futurePublicProductContainer: true,
    publicLaunch: "blocked",
    brandGate: {
      status: "ready_with_notes",
      decision: "frozen_deferred",
      publicLaunchBlocked: true,
    },
  },
  earthPlanet: {
    layerOrder: 7,
    role: "first_planet_complete_trading_project",
    compatibilityName: "Pro Max Earth",
    tradingProject: true,
    demoSafe: true,
    readOnlyWhereApplicable: true,
    realMoney: "disabled",
    brokerExecution: "disabled_not_connected",
  },
  proMaxEarth: {
    layerOrder: 7,
    role: "compatibility_alias_for_earth_planet",
    futureGlobalProduct: true,
    workingNameOnly: true,
    globalApproval: false,
    publicLaunch: "blocked",
    brandGate: "ready_with_notes",
  },
  livingEarthReality: {
    layerOrder: 8,
    role: "device_time_life_layers",
    dayNight: "device_time_simulation",
    season: "device_date_simulation",
    weather: "not_connected",
    location: "not_requested",
    soundscape: "user_controlled",
  },
  trading: {
    layerOrder: 9,
    role: "trading_surface_on_earth_planet",
    demoSafe: true,
    readOnlyWhereApplicable: true,
    realMoney: "disabled",
    brokerExecution: "disabled_not_connected",
  },
  globalLayer: {
    layerOrder: 10,
    role: "future_global_layer_under_swiss_local_constitution",
    publicLaunch: "blocked",
    legalReview: "pending",
    brandReview: "pending",
    complianceReview: "pending",
  },
  publicProMaxSurfaces: {
    layerOrder: 11,
    role: "future_public_product_layer",
    publicLaunch: "blocked",
    legalReview: "pending",
    brandReview: "pending",
    complianceReview: "pending",
    billingReview: "pending",
    brokerReview: "pending",
    assetReview: "pending",
  },
  alkon: {
    layerOrder: 12,
    role: "private_background_guardian_intelligence_support",
    readOnly: true,
    evidenceAware: true,
    noPublicExposure: true,
    mustNeverBeSecondLayer: true,
    visuallyDominant: false,
  },
} as const;

export const universeProductTruth = {
  private: "yes",
  alkawn: "Ahmad private electronic self",
  universe: "technical_translation_private_on_ahmad_devices",
  proMax: "working_name_only",
  proMaxGalaxy: "inside_alkawn",
  earthPlanet: "trading_project_demo_safe",
  swissLocalConstitution: "above_global_layer_review_pending",
  proMaxPublicGlobalApproval: false,
  brandGate: "ready_with_notes",
  brandGateDecision: "frozen_deferred",
  publicLaunch: "blocked_not_started",
  billing: "not_active",
  realMoney: "disabled",
  brokerExecution: "disabled_not_connected",
  trading: "demo_safe_read_only",
  localDayOne: "not_started",
  alkonPublicExposure: "no",
  alkon: "private_read_only_background",
  swissLegalReview: "pending",
  globalLegalReview: "pending",
  weather: "not_connected",
  location: "not_requested",
  assets: "local_legal_safe_procedural_manifest_tracked",
  soundscape: "user_controlled_off_by_default",
  privateUntilLegallyReady: true,
} as const;

export const universeForbiddenOrderRules = [
  "Pro Max must not be treated as the whole Universe.",
  "Pro Max Galaxy must remain inside الكون.",
  "Earth Planet must remain the trading project inside Pro Max Galaxy.",
  "Swiss Local Constitution must stay above Global Layer.",
  "ALKON must not be shown as the second layer.",
  "ALKON must not dominate the public visual identity.",
  "Universe/الكون must not be exposed publicly.",
  "Public Pro Max launch must remain blocked until all gates close.",
] as const;

export const universeManagementReadiness = {
  status: "controlled_cleanup_ready_with_remaining_kernel_canonicalization",
  alkawnPrivateOnAhmadDevices: true,
  universeEnglishTranslationOnly: true,
  proMaxGalaxyManagedByAlkawn: true,
  earthPlanetTradingProject: true,
  swissLocalConstitutionAboveGlobalLayer: true,
  alkonBackgroundGuardian: true,
  publicExposureAllowed: false,
  newKernelCreated: false,
  infinityModeActive: false,
} as const;

export const proMaxPublicFutureReadiness = {
  status: "future_blocked_until_all_gates_close",
  brandGate: "ready_with_notes",
  brandDecision: "frozen_deferred",
  legalReview: "pending",
  complianceReview: "pending",
  billingReview: "pending",
  brokerReview: "pending",
  assetReview: "pending",
  founderReview: "pending",
  swissLocalConstitutionReview: "pending",
  globalLayerReview: "pending",
  publicLaunchAllowed: false,
} as const;

export const universeNextAction =
  "Existing kernel canonicalization: wrap and map the validated ALKON kernel into the canonical Universe architecture without creating a second kernel.";
