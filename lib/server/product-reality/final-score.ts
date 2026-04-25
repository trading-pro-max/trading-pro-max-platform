import "server-only";

import type {
  ProductRealityFinalScoreItem,
  ProductRealityFinalScoreSnapshot,
  ProductRealityFinalScoreStatus,
} from "./types";

function item(input: ProductRealityFinalScoreItem): ProductRealityFinalScoreItem {
  return input;
}

const areas: ProductRealityFinalScoreItem[] = [
  item({
    area: "public_clarity",
    label: "Public clarity",
    score: 8.4,
    status: "pass",
    reason: "Public entry uses simple product language and avoids launch or billing claims.",
    blocker: null,
    nextAction: "Review public entry dark and light screenshots.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "workstation_clarity",
    label: "Workstation clarity",
    score: 8.2,
    status: "pass",
    reason: "The Trading Workspace is chart-first and execution stays paper-safe.",
    blocker: null,
    nextAction: "Confirm workstation layout on laptop, ultrawide, and RTL.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "chart_dominance",
    label: "Chart dominance",
    score: 8.1,
    status: "needs_human_review",
    reason: "Chart dominance is protected but must be accepted visually by Ahmad.",
    blocker: null,
    nextAction: "Capture chart-focus proof and record acceptance or polish notes.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "execution_clarity",
    label: "Execution clarity",
    score: 8.2,
    status: "pass",
    reason: "Buy / AI Wait / Sell stay visible while live and real-money execution remain blocked.",
    blocker: null,
    nextAction: "Review the execution ticket during Local Day One.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "assistant_usefulness",
    label: "Assistant usefulness",
    score: 8.1,
    status: "pass",
    reason: "TPM Assistant explains state, plans, blocked reasons, and Journal/Coach prompts safely.",
    blocker: null,
    nextAction: "Test blocked intents and short daily-use prompts.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "journal_coach_usefulness",
    label: "Journal / Coach usefulness",
    score: 7.4,
    status: "partial",
    reason: "Reflection prompts are safe, while deeper persistence and analytics remain planned.",
    blocker: null,
    nextAction: "Use Local Day One notes to tune prompts without financial advice.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "plan_clarity",
    label: "Plan clarity",
    score: 8.7,
    status: "pass",
    reason: "Free, Pro, VIP, and Institutional are separated without fake activation.",
    blocker: null,
    nextAction: "Keep Enterprise out of public UI.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "settings_organization",
    label: "Settings organization",
    score: 8,
    status: "pass",
    reason: "Settings is a user control center rather than a raw admin surface.",
    blocker: null,
    nextAction: "Review density and clarity during Day One.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "diagnostics_organization",
    label: "Diagnostics organization",
    score: 8,
    status: "pass",
    reason: "Diagnostics shows readiness, product truth, and safety boundaries compactly.",
    blocker: null,
    nextAction: "Verify Local Day One readiness appears without internal overload.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "visual_maturity",
    label: "Visual maturity",
    score: 7.8,
    status: "needs_human_review",
    reason: "The product is cleaner and more premium, but visual acceptance cannot self-certify.",
    blocker: null,
    nextAction: "Ahmad must review final screenshots before acceptance.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "swiss_identity",
    label: "Swiss identity",
    score: 8.1,
    status: "pass",
    reason: "Swiss-inspired precision is present without fake Swiss legal/company status.",
    blocker: null,
    nextAction: "Keep wording inspirational, not legal-status language.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "earth_mark_identity",
    label: "Earth Mark identity",
    score: 8.4,
    status: "pass",
    reason: "Earth Mark is SVG-based and should remain small, premium, and visible.",
    blocker: null,
    nextAction: "Keep screenshot guard for oversized/blocky logo regression.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "product_truth",
    label: "Product Truth",
    score: 9,
    status: "pass",
    reason: "Live execution, real money, broker/feed, billing, launch, and social publishing remain inactive or blocked.",
    blocker: null,
    nextAction: "Keep truth snapshots and tests active.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "safety_legal",
    label: "Safety / Legal",
    score: 8.8,
    status: "pass",
    reason: "Unsafe claims, fake certifications, advice, guarantees, and activation requests are blocked or review-routed.",
    blocker: null,
    nextAction: "Do not treat this as legal advice or launch certification.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "founder_command_privacy",
    label: "Founder Command privacy",
    score: 8.8,
    status: "pass",
    reason: "Founder Command stays hidden from normal users and has no approval execution.",
    blocker: null,
    nextAction: "Keep owner-only access tests active.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "local_operations_readiness",
    label: "Local operations readiness",
    score: 8.5,
    status: "pass",
    reason: "Local doctrine, day cycle, reports, and readiness gates are established.",
    blocker: null,
    nextAction: "Start Local Day One as closed local review only.",
    humanAcceptanceNeeded: false,
  }),
  item({
    area: "user_simplicity",
    label: "User simplicity",
    score: 7.9,
    status: "needs_human_review",
    reason: "The visible UI is simplified, but Ahmad must judge whether it feels calm enough.",
    blocker: null,
    nextAction: "Capture public/workstation/settings/diagnostics screenshots.",
    humanAcceptanceNeeded: true,
  }),
  item({
    area: "internal_integration",
    label: "Internal integration",
    score: 8.5,
    status: "pass",
    reason: "Truth, plans, Assistant, Why Blocked, memory, local ops, construction, and Founder reporting share readiness contracts.",
    blocker: null,
    nextAction: "Keep integration readable without exposing internal depth to normal users.",
    humanAcceptanceNeeded: false,
  }),
];

function countStatus(status: ProductRealityFinalScoreStatus) {
  return areas.filter((area) => area.status === status).length;
}

export function getProductRealityFinalScoreSnapshot(
  checkedAt = new Date().toISOString()
): ProductRealityFinalScoreSnapshot {
  const blockerCount = countStatus("blocker");
  const needsHumanReview = countStatus("needs_human_review");

  return {
    checkedAt,
    mode: "local_product_reality_final_score",
    overallScore:
      Math.round(
        (areas.reduce((total, area) => total + area.score, 0) / areas.length) * 10
      ) / 10,
    status:
      blockerCount > 0
        ? "blocker"
        : needsHumanReview > 0
        ? "needs_human_review"
        : countStatus("partial") > 0
        ? "partial"
        : "pass",
    areas,
    ahmadHumanAcceptanceRequired: true,
    summary: {
      totalAreas: areas.length,
      pass: countStatus("pass"),
      partial: countStatus("partial"),
      blocker: blockerCount,
      needsHumanReview,
    },
    truth: {
      scale: "0_to_10",
      noPerfectScoreClaim: true,
      ahmadVisualAcceptanceRequired: true,
      globalLaunchReadinessClaimed: false,
      fakeUsersRevenueMetrics: false,
    },
  };
}
