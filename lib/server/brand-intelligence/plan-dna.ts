import "server-only";

import type { BrandPlan, BrandPlanDNA } from "./types";

export const BRAND_PLAN_DNA: Record<BrandPlan, BrandPlanDNA> = {
  guest: {
    plan: "guest",
    publicLabel: "Trading Pro Max",
    audience: "public",
    palette: "graphite / clean blue",
    traits: ["orientation", "simple", "public-safe"],
    activationTruth: "orientation only",
    forbiddenClaims: ["paid access", "workspace depth active"],
  },
  free: {
    plan: "free",
    publicLabel: "Free",
    audience: "public",
    palette: "graphite / blue / cyan",
    traits: ["familiar", "clean", "paper-safe", "simple", "moderate TPM advantage"],
    activationTruth: "active paper-safe",
    forbiddenClaims: ["live execution", "real-money routing", "paid access"],
  },
  pro: {
    plan: "pro",
    publicLabel: "Pro",
    audience: "authenticated_user",
    palette: "graphite / emerald / silver",
    traits: ["professional", "intelligent", "focused", "daily workspace"],
    activationTruth: "planned or entitlement-locked",
    forbiddenClaims: ["active Pro without entitlement", "billing active", "better outcomes"],
  },
  vip: {
    plan: "vip",
    publicLabel: "VIP",
    audience: "authenticated_user",
    palette: "black / gold / platinum",
    traits: ["elite", "deep", "premium", "advanced layer"],
    activationTruth: "planned or entitlement-locked",
    forbiddenClaims: ["active VIP without entitlement", "profit promise", "win-rate claim"],
  },
  institutional: {
    plan: "institutional",
    publicLabel: "Institutional",
    audience: "authenticated_user",
    palette: "navy / platinum / cyan",
    traits: ["formal", "controlled", "team-ready", "future only"],
    activationTruth: "future planned",
    forbiddenClaims: ["Enterprise public label", "active team access", "certification claim"],
  },
  founder: {
    plan: "founder",
    publicLabel: "Restricted command identity",
    audience: "founder",
    palette: "graphite / gold / subtle Swiss red",
    traits: ["internal only", "command", "sovereign", "owner-only"],
    activationTruth: "internal/private only",
    forbiddenClaims: ["user-facing plan", "public navigation", "approval execution active"],
  },
};

export function getBrandPlanDNA(plan: BrandPlan): BrandPlanDNA {
  return BRAND_PLAN_DNA[plan] ?? BRAND_PLAN_DNA.free;
}

export function getBrandPlanDNASnapshot() {
  return Object.values(BRAND_PLAN_DNA);
}
