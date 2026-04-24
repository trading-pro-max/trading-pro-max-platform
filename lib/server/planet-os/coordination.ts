import "server-only";

import type {
  MinistryMessage,
  MinistryWorkflow,
  PresidencyCoordinationDecision,
} from "./types";

export const INTER_MINISTRY_WORKFLOWS: MinistryWorkflow[] = [
  {
    id: "media-campaign-workflow",
    name: "Media campaign workflow",
    path: [
      "Media",
      "Founder Presidency",
      "Legal",
      "Guardian",
      "Treasury",
      "Founder",
      "Media",
    ],
    currentTruth: "readiness_only",
    blockedCapabilities: ["external publishing", "social tokens", "fake metrics"],
    requiredReviews: ["Legal", "Guardian", "Founder"],
    founderApprovalRequired: true,
  },
  {
    id: "vip-feature-workflow",
    name: "VIP feature workflow",
    path: [
      "Product",
      "Founder Presidency",
      "Treasury",
      "Legal",
      "Guardian",
      "Engineering",
      "Quality",
      "Founder",
    ],
    currentTruth: "readiness_only",
    blockedCapabilities: ["billing activation", "fake VIP access", "premium guarantee claims"],
    requiredReviews: ["Treasury", "Legal", "Guardian", "Quality"],
    founderApprovalRequired: true,
  },
  {
    id: "security-incident-workflow",
    name: "Security incident workflow",
    path: ["Guardian", "Founder Presidency", "Emergency", "Engineering", "Legal", "Founder"],
    currentTruth: "architecture_only",
    blockedCapabilities: ["invasive surveillance", "silent secret exposure"],
    requiredReviews: ["Guardian", "Engineering", "Legal"],
    founderApprovalRequired: true,
  },
  {
    id: "islamic-wording-workflow",
    name: "Islamic account wording workflow",
    path: ["Account Types", "Founder Presidency", "Legal", "Rights/IP", "Founder"],
    currentTruth: "readiness_only",
    blockedCapabilities: ["fake Sharia certification", "unreviewed Islamic claims"],
    requiredReviews: ["Legal", "Rights/IP"],
    founderApprovalRequired: true,
  },
  {
    id: "sponsored-clock-workflow",
    name: "Sponsored Swiss clock partnership workflow",
    path: ["Partnerships", "Founder Presidency", "Legal", "Rights/IP", "Media", "Founder"],
    currentTruth: "architecture_only",
    blockedCapabilities: ["fake Swiss company status", "unreviewed sponsor claims"],
    requiredReviews: ["Legal", "Rights/IP", "Media"],
    founderApprovalRequired: true,
  },
  {
    id: "production-activation-workflow",
    name: "Production activation workflow",
    path: ["Ops", "Founder Presidency", "Engineering", "Legal", "Guardian", "Founder"],
    currentTruth: "blocked_until_future_stage",
    blockedCapabilities: ["production deployment", "live execution", "billing", "broker/feed"],
    requiredReviews: ["Ops", "Engineering", "Legal", "Guardian", "Founder"],
    founderApprovalRequired: true,
  },
];

export function getMinistryMessageExample(
  checkedAt = new Date().toISOString()
): MinistryMessage {
  return {
    messageId: "msg-presidency-0001",
    sourceMinistry: "Media & Communications Ministry",
    targetMinistry: "Justice / Legal / Compliance Ministry",
    coordinationCenter: "Founder Presidency / Central Coordination System",
    type: "review_required",
    priority: "high",
    riskLevel: "high",
    automationLevel: "founder_approval",
    summary: "Review a future Pro/VIP campaign draft before any public use.",
    requestedAction: "Classify claims and return safe wording guidance.",
    guardianReviewRequired: true,
    legalReviewRequired: true,
    treasuryReviewRequired: true,
    engineeringReviewRequired: false,
    founderApprovalRequired: true,
    status: "draft",
    createdAt: checkedAt,
    updatedAt: checkedAt,
    resolvedAt: null,
  };
}

export function getInterMinistryCoordinationSnapshot(
  checkedAt = new Date().toISOString()
) {
  const decisions: PresidencyCoordinationDecision[] = [
    {
      id: "route-sensitive-media",
      title: "Route sensitive media through review",
      decision: "route_to_review",
      reason: "VIP, launch, AI, broker/feed, billing, and performance wording are high-risk.",
      nextStep: "Send draft to Legal, Guardian, Treasury where needed, then Founder.",
    },
    {
      id: "block-production-activation",
      title: "Block production activation workflow",
      decision: "block",
      reason: "Production, live, billing, broker/feed, and secrets are outside the current scope.",
      nextStep: "Keep readiness visible and defer activation.",
    },
  ];

  return {
    checkedAt,
    mode: "founder_presidency_coordination_system",
    coordinationCenter: "Founder Presidency / Central Coordination System",
    messageContract: getMinistryMessageExample(checkedAt),
    workflows: INTER_MINISTRY_WORKFLOWS,
    decisions,
    summary: {
      workflows: INTER_MINISTRY_WORKFLOWS.length,
      messageStates: [
        "draft",
        "sent",
        "in_review",
        "waiting_for_response",
        "approved",
        "rejected",
        "blocked",
        "escalated",
        "resolved",
        "archived",
      ],
      crossMinistryMustUsePresidency: true,
      realWorkflowExecutionActive: false,
      socialPublishingActive: false,
      productionActivationActive: false,
    },
  };
}
