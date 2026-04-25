import "server-only";

import type {
  ProductRealityLocalStartScoreItem,
  ProductRealityLocalStartScoreSnapshot,
} from "./types";

function item(
  input: ProductRealityLocalStartScoreItem
): ProductRealityLocalStartScoreItem {
  return input;
}

const areas: ProductRealityLocalStartScoreItem[] = [
  item({
    area: "public_entry",
    label: "Public entry",
    score: 8.4,
    status: "pass",
    reason: "Public entry is clean, plan-aware, and does not imply launch.",
    nextAction: "Review dark and light public entry screenshots.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "workstation",
    label: "Workstation",
    score: 8.2,
    status: "pass",
    reason: "Workspace remains chart-first and local paper-safe.",
    nextAction: "Review dark, light, and RTL workstation screenshots.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "chart",
    label: "Chart",
    score: 8.1,
    status: "needs_ahmad_review",
    reason: "Chart dominance is protected but needs Ahmad human visual review.",
    nextAction: "Capture chart-focus proof and record acceptance notes.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "execution",
    label: "Execution",
    score: 8.2,
    status: "pass",
    reason: "Execution ticket is clear for paper review; live/real money remain blocked.",
    nextAction: "Review paper ticket only.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "assistant",
    label: "Assistant",
    score: 8.1,
    status: "pass",
    reason: "TPM Assistant is safe, plan-aware, and non-executing.",
    nextAction: "Test safe local state and blocked-intent prompts.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "journal_coach",
    label: "Journal / Coach",
    score: 7.4,
    status: "ready_with_notes",
    reason: "Paper-session guidance is safe; deeper persistence remains planned.",
    nextAction: "Record Day One reflection notes.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "settings",
    label: "Settings",
    score: 8,
    status: "pass",
    reason: "Settings is user-safe and does not expose activation controls.",
    nextAction: "Review density and clarity.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "diagnostics",
    label: "Diagnostics",
    score: 8,
    status: "pass",
    reason: "Diagnostics shows readiness and product truth compactly.",
    nextAction: "Confirm Local Day One Operation readiness is visible.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "plan_clarity",
    label: "Plan clarity",
    score: 8.7,
    status: "pass",
    reason: "Free, Pro, VIP, and Institutional remain truthful and separated.",
    nextAction: "Keep public naming regression tests active.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "visual_maturity",
    label: "Visual maturity",
    score: 7.8,
    status: "needs_ahmad_review",
    reason: "Visual quality is ready for review, but cannot self-certify.",
    nextAction: "Ahmad must review final screenshots.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "local_operations",
    label: "Local operations",
    score: 8.5,
    status: "pass",
    reason: "Local doctrine, day cycle, memory, and build-room readiness are established.",
    nextAction: "Start closed local work only after validation remains clean.",
    humanAcceptanceNeeded: false,
  }),
];

function count(status: ProductRealityLocalStartScoreItem["status"]) {
  return areas.filter((area) => area.status === status).length;
}

export function getProductRealityLocalStartScoreSnapshot(
  checkedAt = new Date().toISOString()
): ProductRealityLocalStartScoreSnapshot {
  const blocked = count("blocked");

  return {
    checkedAt,
    mode: "local_start_product_reality_score",
    overallScore:
      Math.round(
        (areas.reduce((total, area) => total + area.score, 0) / areas.length) * 10
      ) / 10,
    status: blocked > 0 ? "blocked" : "ready_with_notes",
    areas,
    ahmadHumanVisualAcceptanceRequired: true,
    summary: {
      totalAreas: areas.length,
      pass: count("pass"),
      readyWithNotes: count("ready_with_notes"),
      needsAhmadReview: count("needs_ahmad_review"),
      blocked,
    },
    truth: {
      scale: "0_to_10",
      noPerfectScoreClaim: true,
      localOperationsOnly: true,
      globalLaunchReadinessClaimed: false,
      fakeUsersRevenueMetrics: false,
      billingActive: false,
      brokerFeedActive: false,
      liveExecutionActive: false,
      realMoneyActive: false,
      socialPublishingActive: false,
    },
  };
}
