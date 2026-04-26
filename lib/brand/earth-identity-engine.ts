import type {
  EarthIdentity,
  EarthIdentityInput,
} from "./earth-identity-types";
import type { LivingEarthPlan } from "./earth-background-types";
import type { PlanRealmId } from "@/lib/plans/realms/types";

const planRealmIds: Record<LivingEarthPlan, PlanRealmId> = {
  free: "free_earth",
  pro: "pro_orbit",
  vip: "vip_lunar",
  institutional: "institutional_station",
  founder: "alkon_universe",
};

const planVariables: Record<LivingEarthPlan, Record<string, string>> = {
  free: {
    "--tpm-earth-gold": "#a6b6c8",
    "--tpm-earth-ocean-highlight": "color-mix(in srgb, #49d8ca 28%, white 7%)",
    "--tpm-earth-ocean-mid": "color-mix(in srgb, #0d3346 82%, #2ccfba 18%)",
    "--tpm-earth-ocean-deep": "color-mix(in srgb, #06111e 88%, #2ccfba 12%)",
    "--tpm-earth-land-top": "color-mix(in srgb, #b7c7d7 32%, #1b2b3e 68%)",
    "--tpm-earth-land-bottom": "color-mix(in srgb, #263848 92%, #7aa2b8 8%)",
    "--tpm-earth-orbit-opacity": "0.46",
    "--tpm-earth-line-opacity": "0.54",
    "--tpm-earth-realm-ring-opacity": "0.24",
    "--tpm-earth-realm-grid-opacity": "0.16",
    "--tpm-earth-realm-node-opacity": "0.26",
  },
  pro: {
    "--tpm-earth-gold": "#7edbcf",
    "--tpm-earth-ocean-highlight": "color-mix(in srgb, #53ead7 34%, white 7%)",
    "--tpm-earth-ocean-mid": "color-mix(in srgb, #092c38 74%, #30c8b7 26%)",
    "--tpm-earth-ocean-deep": "color-mix(in srgb, #041018 82%, #1e897e 18%)",
    "--tpm-earth-land-top": "color-mix(in srgb, #c8d4dc 24%, #1c4c49 76%)",
    "--tpm-earth-land-bottom": "color-mix(in srgb, #0e302e 80%, #c4d1da 20%)",
    "--tpm-earth-orbit-opacity": "0.68",
    "--tpm-earth-line-opacity": "0.72",
    "--tpm-earth-realm-ring-opacity": "0.48",
    "--tpm-earth-realm-grid-opacity": "0.42",
    "--tpm-earth-realm-node-opacity": "0.5",
  },
  vip: {
    "--tpm-earth-gold": "#f1c96b",
    "--tpm-earth-ocean-highlight": "color-mix(in srgb, #6bc8ff 26%, white 8%)",
    "--tpm-earth-ocean-mid": "color-mix(in srgb, #141b28 72%, #1f5c88 28%)",
    "--tpm-earth-ocean-deep": "color-mix(in srgb, #05070c 76%, #173b5b 24%)",
    "--tpm-earth-land-top": "color-mix(in srgb, #f5d889 38%, #353a42 62%)",
    "--tpm-earth-land-bottom": "color-mix(in srgb, #1e2229 72%, #f1c96b 28%)",
    "--tpm-earth-orbit-opacity": "0.92",
    "--tpm-earth-line-opacity": "0.82",
    "--tpm-earth-realm-ring-opacity": "0.68",
    "--tpm-earth-realm-grid-opacity": "0.32",
    "--tpm-earth-realm-node-opacity": "0.62",
  },
  institutional: {
    "--tpm-earth-gold": "#91d8ff",
    "--tpm-earth-ocean-highlight": "color-mix(in srgb, #86dbff 28%, white 7%)",
    "--tpm-earth-ocean-mid": "color-mix(in srgb, #112d4e 82%, #37b7d8 18%)",
    "--tpm-earth-ocean-deep": "color-mix(in srgb, #030a18 82%, #112d4e 18%)",
    "--tpm-earth-land-top": "color-mix(in srgb, #d8e2ec 26%, #17324a 74%)",
    "--tpm-earth-land-bottom": "color-mix(in srgb, #0a1727 78%, #89cbed 22%)",
    "--tpm-earth-orbit-opacity": "0.62",
    "--tpm-earth-line-opacity": "0.88",
    "--tpm-earth-realm-ring-opacity": "0.56",
    "--tpm-earth-realm-grid-opacity": "0.5",
    "--tpm-earth-realm-node-opacity": "0.58",
  },
  founder: {
    "--tpm-earth-gold": "#f1c96b",
    "--tpm-earth-red": "#d12b2b",
    "--tpm-earth-ocean-highlight": "color-mix(in srgb, #f1c96b 28%, white 5%)",
    "--tpm-earth-ocean-mid": "color-mix(in srgb, #191510 82%, #b8842f 18%)",
    "--tpm-earth-ocean-deep": "color-mix(in srgb, #030303 84%, #5a1010 16%)",
    "--tpm-earth-land-top": "color-mix(in srgb, #f5d889 42%, #232323 58%)",
    "--tpm-earth-land-bottom": "color-mix(in srgb, #0a0a0a 68%, #f1c96b 32%)",
    "--tpm-earth-orbit-opacity": "0.98",
    "--tpm-earth-line-opacity": "0.9",
    "--tpm-earth-realm-ring-opacity": "0.92",
    "--tpm-earth-realm-grid-opacity": "0.72",
    "--tpm-earth-realm-node-opacity": "0.84",
  },
};

const planLayerDescriptions: Record<LivingEarthPlan, EarthIdentity["layers"]> = {
  free: {
    earthBase: "clean realistic Earth",
    surfaceMaterial: "simple calm atmosphere",
    continentTreatment: "muted land without premium gold dominance",
    gridSystem: "light public orientation grid",
    orbitSystem: "simple moon/orbit",
    moonBehavior: "low motion",
    motionLaw: "stable and paper-safe",
    planDNA: "Free public simplicity",
    realmShape: "single complete web-workspace globe",
    functionalSignal: "active Web, paper ticket, Basic Assistant, Basic Journal/Coach",
    themeAdaptation: "crisp in light and deep in dark",
    stateSignal: "paper-safe readiness only",
    occasionSkin: "default product skin",
  },
  pro: {
    earthBase: "professional Earth",
    surfaceMaterial: "emerald and silver precision",
    continentTreatment: "technical but restrained",
    gridSystem: "more precise grid",
    orbitSystem: "professional orbit",
    moonBehavior: "low to medium motion",
    motionLaw: "workstation-safe",
    planDNA: "Pro precision without activation claims",
    realmShape: "orbital professional grid around the active Free workspace",
    functionalSignal: "planned workspace depth, Decision Replay, alerts, and workflow memory",
    themeAdaptation: "clean light, deeper dark",
    stateSignal: "paper-safe or planned",
    occasionSkin: "default product skin",
  },
  vip: {
    earthBase: "premium Earth",
    surfaceMaterial: "gold and platinum depth",
    continentTreatment: "gold continent edges allowed",
    gridSystem: "premium technical grid",
    orbitSystem: "gold orbit",
    moonBehavior: "stronger orbit without profit promise",
    motionLaw: "premium but calm",
    planDNA: "VIP identity without fake access",
    realmShape: "lunar/deep orbit with premium edge treatment",
    functionalSignal: "planned advanced Assistant, advanced Coach, premium reports, and VIP rooms",
    themeAdaptation: "high depth in dark, crisp in light",
    stateSignal: "planned premium readiness",
    occasionSkin: "default product skin",
  },
  institutional: {
    earthBase: "formal Earth",
    surfaceMaterial: "navy, platinum, cyan",
    continentTreatment: "controlled formal edges",
    gridSystem: "formal compliance grid",
    orbitSystem: "controlled orbit",
    moonBehavior: "slow deliberate movement",
    motionLaw: "stable institutional feel",
    planDNA: "team and compliance future layer",
    realmShape: "station/control grid with restrained institutional orbit",
    functionalSignal: "future team/admin/audit/compliance readiness",
    themeAdaptation: "clear daylight, controlled dark",
    stateSignal: "future readiness",
    occasionSkin: "default product skin",
  },
  founder: {
    earthBase: "private command Earth",
    surfaceMaterial: "gold, graphite, Swiss red micro accent",
    continentTreatment: "strong command treatment",
    gridSystem: "private command grid",
    orbitSystem: "command orbit",
    moonBehavior: "strong private command orbit",
    motionLaw: "local-only command pulse",
    planDNA: "Founder private surface only",
    realmShape: "private command universe with strongest internal orbit",
    functionalSignal: "private readiness, gaps, and next safe actions only",
    themeAdaptation: "deep command dark, restrained light",
    stateSignal: "local-only command status",
    occasionSkin: "Founder-only private future skins",
  },
};

export function getEarthIdentity(input: EarthIdentityInput = {}): EarthIdentity {
  const plan = input.plan ?? "free";
  const surface = input.surface ?? "public_entry";
  const state = input.state ?? "paper_safe";
  const theme = input.theme ?? "auto";
  const cssVariables = { ...planVariables[plan] };

  if (surface === "workstation") {
    cssVariables["--tpm-earth-moon-duration"] = "30s";
    cssVariables["--tpm-earth-map-duration"] = "22s";
    cssVariables["--tpm-earth-orbit-opacity"] = "0.36";
    cssVariables["--tpm-earth-line-opacity"] = "0.42";
  }

  if (theme === "light") {
    cssVariables["--tpm-earth-theme-rim-opacity"] = "0.42";
    cssVariables["--tpm-earth-theme-shadow-opacity"] = "0.12";
  } else if (theme === "dark") {
    cssVariables["--tpm-earth-theme-rim-opacity"] = "0.74";
    cssVariables["--tpm-earth-theme-shadow-opacity"] = "0.28";
  } else {
    cssVariables["--tpm-earth-theme-rim-opacity"] = "0.58";
    cssVariables["--tpm-earth-theme-shadow-opacity"] = "0.2";
  }

  if (state === "blocked") {
    cssVariables["--tpm-earth-state-accent"] = "var(--tpm-status-blocked-text, #ff6b6b)";
  } else if (state === "review_required") {
    cssVariables["--tpm-earth-state-accent"] = "var(--tpm-status-pending-text, #f1c96b)";
  } else {
    cssVariables["--tpm-earth-state-accent"] = "var(--tpm-celestial-cyan, #35d6c4)";
  }

  return {
    plan,
    realmId: planRealmIds[plan],
    surface,
    state,
    theme,
    layers: planLayerDescriptions[plan],
    cssVariables,
    truth: {
      rasterAssetsUsed: false,
      externalMapAssetsUsed: false,
      noProfitPromise: true,
      noPreciseLocation: true,
      publicFounderSymbol: false,
    },
  };
}
