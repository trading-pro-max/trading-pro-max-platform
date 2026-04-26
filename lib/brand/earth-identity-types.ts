import type { BrandSurface } from "./types";
import type { LivingEarthPlan, LivingEarthState } from "./earth-background-types";
import type { PlanRealmId } from "@/lib/plans/realms/types";

export type EarthIdentityTheme = "light" | "dark" | "auto";

export type EarthIdentityLayer =
  | "earthBase"
  | "surfaceMaterial"
  | "continentTreatment"
  | "gridSystem"
  | "orbitSystem"
  | "moonBehavior"
  | "motionLaw"
  | "planDNA"
  | "realmShape"
  | "functionalSignal"
  | "themeAdaptation"
  | "stateSignal"
  | "occasionSkin";

export type EarthIdentity = {
  plan: LivingEarthPlan;
  realmId: PlanRealmId;
  surface: BrandSurface | "public_entry";
  state: LivingEarthState;
  theme: EarthIdentityTheme;
  layers: Record<EarthIdentityLayer, string>;
  cssVariables: Record<string, string>;
  truth: {
    rasterAssetsUsed: false;
    externalMapAssetsUsed: false;
    noProfitPromise: true;
    noPreciseLocation: true;
    publicFounderSymbol: false;
  };
};

export type EarthIdentityInput = {
  plan?: LivingEarthPlan;
  surface?: BrandSurface;
  state?: LivingEarthState;
  theme?: EarthIdentityTheme;
};
