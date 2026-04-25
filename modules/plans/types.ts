import type { PlanEntitlementContract, PlanPlanetAccessLayer } from "@/lib/plans/types";

export type PlanExperienceView = {
  plan: PlanEntitlementContract;
  current: boolean;
  billingInactive: true;
  vipInactive: true;
};

export type CitizenAccessMapView = {
  currentLayer: PlanPlanetAccessLayer;
  layers: PlanPlanetAccessLayer[];
  founderCommandUserVisible: false;
  performanceFeeUserVisible: false;
};
