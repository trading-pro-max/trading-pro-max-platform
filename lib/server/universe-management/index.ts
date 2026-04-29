export type UniverseLayerId =
  | "ahmad_private_devices"
  | "universe"
  | "pro_max_earth"
  | "living_earth_reality"
  | "trading_ground"
  | "public_pro_max_surfaces"
  | "alkon_background_guardian";

export type UniverseLayer = {
  id: UniverseLayerId;
  layerOrder: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  role: string;
  visibility: "private_founder_device_only" | "future_public_after_gates" | "private_background";
  truth: string;
  publicExposure: boolean;
  state: "active_private" | "demo_safe" | "future_blocked" | "private_read_only";
};

export const universeLayerOrder: UniverseLayer[] = [
  {
    id: "ahmad_private_devices",
    layerOrder: 0,
    label: "Ahmad Private Devices",
    role: "private_device_runtime_only",
    visibility: "private_founder_device_only",
    truth: "Universe stays private on Ahmad's devices.",
    publicExposure: false,
    state: "active_private",
  },
  {
    id: "universe",
    layerOrder: 1,
    label: "Universe",
    role: "private_living_operating_system",
    visibility: "private_founder_device_only",
    truth: "Universe is a private living operating system and visual simulation.",
    publicExposure: false,
    state: "active_private",
  },
  {
    id: "pro_max_earth",
    layerOrder: 2,
    label: "Pro Max Earth",
    role: "product_planet_inside_universe",
    visibility: "future_public_after_gates",
    truth: "Pro Max Earth is the product planet inside Universe.",
    publicExposure: false,
    state: "future_blocked",
  },
  {
    id: "living_earth_reality",
    layerOrder: 3,
    label: "Living Earth Reality",
    role: "device_time_life_layers",
    visibility: "future_public_after_gates",
    truth: "Living Earth Layers use device-time and device-date simulation.",
    publicExposure: false,
    state: "demo_safe",
  },
  {
    id: "trading_ground",
    layerOrder: 4,
    label: "/trading",
    role: "trading_ground_on_pro_max_earth",
    visibility: "future_public_after_gates",
    truth: "Trading Ground on Pro Max Earth is demo-safe/read-only now.",
    publicExposure: false,
    state: "demo_safe",
  },
  {
    id: "public_pro_max_surfaces",
    layerOrder: 5,
    label: "Public Pro Max Surfaces",
    role: "future_public_product_layer",
    visibility: "future_public_after_gates",
    truth: "Public Pro Max launch is blocked until all gates close.",
    publicExposure: false,
    state: "future_blocked",
  },
  {
    id: "alkon_background_guardian",
    layerOrder: 6,
    label: "ALKON",
    role: "private_background_guardian_intelligence_support",
    visibility: "private_background",
    truth: "ALKON is background guardian support, not the second layer.",
    publicExposure: false,
    state: "private_read_only",
  },
];

export const universeCanonicalHierarchy = [
  "Ahmad Private Devices",
  "Universe - Private Living Operating System",
  "Pro Max Earth - Future Global Product",
  "Living Earth Reality - Device-Time Life Layers",
  "/trading - Trading Ground",
  "Public Pro Max Surfaces - Future Public Product Layer",
  "ALKON - Private Background Guardian",
] as const;

export const universeDeepModel = {
  ahmadPrivateDevices: {
    layerOrder: 0,
    universeAllowedOnlyInPrivateFounderDeviceContext: true,
    publicExposure: false,
  },
  universe: {
    layerOrder: 1,
    role: "private_living_operating_system",
    highestManagementLayer: true,
    manages: "Pro Max",
    privateOnlyOnAhmadDevices: true,
    neverPublicNow: true,
  },
  proMaxEarth: {
    layerOrder: 2,
    role: "product_planet_inside_universe",
    futureGlobalProduct: true,
    workingNameOnly: true,
    globalApproval: false,
    publicLaunch: "blocked",
    brandGate: "ready_with_notes",
  },
  livingEarthReality: {
    layerOrder: 3,
    role: "device_time_life_layers",
    dayNight: "device_time_simulation",
    season: "device_date_simulation",
    weather: "not_connected",
    location: "not_requested",
    soundscape: "user_controlled",
  },
  trading: {
    layerOrder: 4,
    role: "trading_ground_on_pro_max_earth",
    demoSafe: true,
    readOnlyWhereApplicable: true,
    realMoney: "disabled",
    brokerExecution: "disabled_not_connected",
  },
  publicProMaxSurfaces: {
    layerOrder: 5,
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
    layerOrder: 6,
    role: "private_background_guardian_intelligence_support",
    readOnly: true,
    evidenceAware: true,
    noPublicExposure: true,
    mustNeverBeSecondLayer: true,
  },
} as const;

export const universeProductTruth = {
  private: "yes",
  universe: "Ahmad devices only",
  proMax: "working_name_only",
  proMaxPublicGlobalApproval: false,
  brandGate: "ready_with_notes",
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
  "ALKON must not be shown as the second layer.",
  "ALKON must not dominate the public visual identity.",
  "Universe must not be exposed publicly.",
  "Pro Max Earth must remain the product planet managed by Universe.",
  "Public Pro Max launch must remain blocked until all gates close.",
] as const;

export const universeManagementReadiness = {
  status: "private_operating_model_ready_with_gates",
  universePrivateOnAhmadDevices: true,
  proMaxManagedByUniverse: true,
  alkonBackgroundGuardian: true,
  publicExposureAllowed: false,
} as const;

export const proMaxPublicFutureReadiness = {
  status: "future_blocked_until_all_gates_close",
  brandGate: "ready_with_notes",
  legalReview: "pending",
  complianceReview: "pending",
  billingReview: "pending",
  brokerReview: "pending",
  assetReview: "pending",
  founderReview: "pending",
  publicLaunchAllowed: false,
} as const;

export const universeNextAction =
  "Ahmad opens /founder/universe and /trading, verifies the private Universe and Pro Max Earth hierarchy, then decides ACCEPT, REJECT with notes, or CORRECT one narrow issue.";
