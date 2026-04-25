import "server-only";

import type { VipRoomCapability, VipRoomsReadinessSnapshot } from "./types";

const capabilities: VipRoomCapability[] = [
  {
    id: "advanced_coaching",
    label: "Advanced coaching",
    state: "planned_not_active",
    accessTruth: "Planned VIP coaching layer only; no active coaching access is claimed.",
    requiredReviews: ["Guardian", "Legal", "Coach safety", "Founder approval later"],
    mustNotClaim: ["better results", "guaranteed outcome", "financial advice"],
  },
  {
    id: "strategy_review",
    label: "Strategy review",
    state: "planned_not_active",
    accessTruth: "Strategy review is planned as education/review, not signal delivery.",
    requiredReviews: ["Guardian", "Legal", "Risk language", "Founder approval later"],
    mustNotClaim: ["signals", "copy trading", "win-rate", "guaranteed profit"],
  },
  {
    id: "premium_reports",
    label: "Premium reports",
    state: "planned_not_active",
    accessTruth: "Premium reports are planned and cannot imply live market advice.",
    requiredReviews: ["Legal", "Guardian", "Product Truth"],
    mustNotClaim: ["investment advice", "certainty", "future performance"],
  },
  {
    id: "private_rooms",
    label: "Private rooms",
    state: "planned_not_active",
    accessTruth: "VIP private rooms are planned and not active.",
    requiredReviews: ["Community safety", "Guardian", "Legal", "Founder approval later"],
    mustNotClaim: ["active members", "active room", "profit screenshots", "signal room"],
  },
  {
    id: "priority_review_future",
    label: "Priority review",
    state: "future",
    accessTruth: "Priority review is a future support concept without staffing or SLA claim.",
    requiredReviews: ["Support operations", "Legal", "Founder approval later"],
    mustNotClaim: ["priority support active", "guaranteed response", "VIP access active"],
  },
];

export function getVipRoomsReadinessSnapshot(
  checkedAt = new Date().toISOString()
): VipRoomsReadinessSnapshot {
  return {
    checkedAt,
    mode: "vip_rooms_readiness",
    status: "planned_not_active",
    capabilities,
    planAccess: {
      vip: "planned_not_active",
      pro: "not_vip_access",
      free: "not_vip_access",
      institutional: "future",
    },
    roomRules: {
      signalGuarantees: "blocked",
      copyTrading: "blocked",
      profitPromises: "blocked",
      fakeAccess: "blocked",
      fakeMembers: "blocked",
      guardianModerationRequired: true,
      legalClaimReviewRequired: true,
      founderApprovalRequiredBeforeActivation: true,
    },
    truth: {
      vipActive: false,
      privateRoomsActive: false,
      advancedCoachingActive: false,
      strategyReviewActive: false,
      premiumReportsActive: false,
      fakeVipAccess: false,
      fakeMembers: false,
      signalRooms: false,
      copyTrading: false,
      guaranteedProfitClaims: false,
      billingActive: false,
      founderCommandPublic: false,
    },
  };
}
