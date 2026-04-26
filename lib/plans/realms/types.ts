import type { LivingEarthPlan } from "@/lib/brand/earth-background-types";

export type PlanRealmId =
  | "free_earth"
  | "pro_orbit"
  | "vip_lunar"
  | "institutional_station"
  | "alkon_universe";

export type RealmVisibility = "public_user" | "private_founder";

export type RealmActivationState =
  | "active"
  | "planned"
  | "future"
  | "blocked"
  | "internal_only";

export type RealmFeatureState =
  | "active"
  | "locked"
  | "planned"
  | "future"
  | "hidden"
  | "blocked";

export type RealmFeature = {
  key: string;
  label: string;
  state: RealmFeatureState;
  explanation: string;
};

export type PlanRealm = {
  realmId: PlanRealmId;
  publicPlanName: "Free" | "Pro" | "VIP" | "Institutional" | "Alkon";
  realmName: string;
  visibility: RealmVisibility;
  activationState: RealmActivationState;
  visualIdentity: {
    plan: LivingEarthPlan;
    palette: string;
    shapeLanguage: string;
    motion: "none" | "low" | "medium" | "command";
  };
  earthPerspective: string;
  allowedFeatures: RealmFeature[];
  lockedFeatures: RealmFeature[];
  plannedFeatures: RealmFeature[];
  hiddenFeatures: RealmFeature[];
  assistantBehavior: string;
  journalCoachDepth: string;
  workspaceBehavior: string;
  academyDepth: string;
  communityDepth: string;
  reportsDepth: string;
  appsPlatformsAccess: string;
  supportAccess: string;
  safetyBoundaries: string[];
  upgradeExplanation: string;
  productTruthRequirements: string[];
};
