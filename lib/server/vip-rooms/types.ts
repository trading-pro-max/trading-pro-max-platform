import "server-only";

export type VipRoomCapabilityId =
  | "advanced_coaching"
  | "strategy_review"
  | "premium_reports"
  | "private_rooms"
  | "priority_review_future";

export type VipRoomState = "planned_not_active" | "future" | "blocked_by_design";

export type VipRoomCapability = {
  id: VipRoomCapabilityId;
  label: string;
  state: VipRoomState;
  accessTruth: string;
  requiredReviews: string[];
  mustNotClaim: string[];
};

export type VipRoomsReadinessSnapshot = {
  checkedAt: string;
  mode: "vip_rooms_readiness";
  status: "planned_not_active";
  capabilities: VipRoomCapability[];
  planAccess: {
    vip: "planned_not_active";
    pro: "not_vip_access";
    free: "not_vip_access";
    institutional: "future";
  };
  roomRules: {
    signalGuarantees: "blocked";
    copyTrading: "blocked";
    profitPromises: "blocked";
    fakeAccess: "blocked";
    fakeMembers: "blocked";
    guardianModerationRequired: true;
    legalClaimReviewRequired: true;
    founderApprovalRequiredBeforeActivation: true;
  };
  truth: {
    vipActive: false;
    privateRoomsActive: false;
    advancedCoachingActive: false;
    strategyReviewActive: false;
    premiumReportsActive: false;
    fakeVipAccess: false;
    fakeMembers: false;
    signalRooms: false;
    copyTrading: false;
    guaranteedProfitClaims: false;
    billingActive: false;
    founderCommandPublic: false;
  };
};
