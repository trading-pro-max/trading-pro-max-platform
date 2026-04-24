import type { PlanEntitlementContract } from "@/lib/plans/types";

export type PlanExperienceView = {
  plan: PlanEntitlementContract;
  current: boolean;
  billingInactive: true;
  vipInactive: true;
};
