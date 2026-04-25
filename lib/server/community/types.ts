import "server-only";

export type CommunityPlanLayer = "free" | "pro" | "vip" | "institutional";

export type CommunityRoomState = "planned" | "future" | "blocked_by_design";

export type CommunityRoomKind =
  | "free_learning_space"
  | "pro_room"
  | "vip_room"
  | "feedback_room"
  | "support_room";

export type CommunitySafetyRule =
  | "anti_scam"
  | "no_fake_profit_screenshots"
  | "no_signal_rooms"
  | "no_copy_trading"
  | "guardian_moderation"
  | "legal_claim_review"
  | "no_fake_members"
  | "private_data_protection";

export type CommunityRoomReadiness = {
  id: CommunityRoomKind;
  label: string;
  planLayer: CommunityPlanLayer;
  state: CommunityRoomState;
  visibleToUser: boolean;
  accessTruth: string;
  safetyRules: CommunitySafetyRule[];
  requiredReviews: string[];
};

export type CommunityReadinessSnapshot = {
  checkedAt: string;
  mode: "community_readiness";
  status: "planned_only";
  rooms: CommunityRoomReadiness[];
  safetyPolicy: {
    rules: CommunitySafetyRule[];
    moderation: "guardian_required";
    legalReview: "claim_review_required";
    scamProtection: "required";
    fakeProfitScreenshots: "blocked";
    signalRooms: "blocked";
    copyTrading: "blocked";
  };
  planAccess: {
    free: "learning_space_planned";
    pro: "room_planned";
    vip: "room_planned";
    institutional: "future";
  };
  truth: {
    activeRooms: false;
    fakeRooms: false;
    fakeMembers: false;
    liveChatActive: false;
    socialNetworkActive: false;
    socialAccountsConnected: false;
    billingActive: false;
    fakeProAccess: false;
    fakeVipAccess: false;
    founderCommandPublic: false;
  };
};
