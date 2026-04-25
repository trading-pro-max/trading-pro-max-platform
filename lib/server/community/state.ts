import "server-only";

import type {
  CommunityReadinessSnapshot,
  CommunityRoomReadiness,
  CommunitySafetyRule,
} from "./types";

export const communitySafetyRules: CommunitySafetyRule[] = [
  "anti_scam",
  "no_fake_profit_screenshots",
  "no_signal_rooms",
  "no_copy_trading",
  "guardian_moderation",
  "legal_claim_review",
  "no_fake_members",
  "private_data_protection",
];

const rooms: CommunityRoomReadiness[] = [
  {
    id: "free_learning_space",
    label: "Free learning space",
    planLayer: "free",
    state: "planned",
    visibleToUser: true,
    accessTruth: "Planned education room only; no active community is claimed.",
    safetyRules: ["anti_scam", "guardian_moderation", "no_fake_members", "private_data_protection"],
    requiredReviews: ["Guardian moderation", "Community safety"],
  },
  {
    id: "pro_room",
    label: "Pro room",
    planLayer: "pro",
    state: "planned",
    visibleToUser: true,
    accessTruth: "Pro room is planned and cannot imply paid access while billing is inactive.",
    safetyRules: ["anti_scam", "no_signal_rooms", "legal_claim_review", "no_fake_members"],
    requiredReviews: ["Guardian moderation", "Legal claim review", "Plan entitlement review"],
  },
  {
    id: "vip_room",
    label: "VIP room",
    planLayer: "vip",
    state: "planned",
    visibleToUser: true,
    accessTruth: "VIP room is planned and no private room access is active.",
    safetyRules: [
      "anti_scam",
      "no_fake_profit_screenshots",
      "no_signal_rooms",
      "no_copy_trading",
      "legal_claim_review",
      "no_fake_members",
    ],
    requiredReviews: ["Guardian moderation", "Legal claim review", "Founder approval later"],
  },
  {
    id: "feedback_room",
    label: "Feedback room",
    planLayer: "free",
    state: "planned",
    visibleToUser: true,
    accessTruth: "Feedback room is planned for product input, not live support automation.",
    safetyRules: ["anti_scam", "guardian_moderation", "private_data_protection"],
    requiredReviews: ["Support policy", "Private data protection"],
  },
  {
    id: "support_room",
    label: "Support room",
    planLayer: "free",
    state: "planned",
    visibleToUser: true,
    accessTruth: "Support room is planned; no staffing or response-time claim is active.",
    safetyRules: ["anti_scam", "guardian_moderation", "private_data_protection", "legal_claim_review"],
    requiredReviews: ["Support policy", "Legal review", "Security review"],
  },
];

export function getCommunityReadinessSnapshot(
  checkedAt = new Date().toISOString()
): CommunityReadinessSnapshot {
  return {
    checkedAt,
    mode: "community_readiness",
    status: "planned_only",
    rooms,
    safetyPolicy: {
      rules: communitySafetyRules,
      moderation: "guardian_required",
      legalReview: "claim_review_required",
      scamProtection: "required",
      fakeProfitScreenshots: "blocked",
      signalRooms: "blocked",
      copyTrading: "blocked",
    },
    planAccess: {
      free: "learning_space_planned",
      pro: "room_planned",
      vip: "room_planned",
      institutional: "future",
    },
    truth: {
      activeRooms: false,
      fakeRooms: false,
      fakeMembers: false,
      liveChatActive: false,
      socialNetworkActive: false,
      socialAccountsConnected: false,
      billingActive: false,
      fakeProAccess: false,
      fakeVipAccess: false,
      founderCommandPublic: false,
    },
  };
}
