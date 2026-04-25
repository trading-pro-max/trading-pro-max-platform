import "server-only";

import type {
  LocalDayOneOperationReviewArea,
  LocalDayOneOperationSnapshot,
} from "./types";
import { getLocalDayOneReadinessSnapshot } from "./day-one";

const commands = [
  "cd C:\\Users\\ahmad\\Desktop\\trading-pro-max-platform",
  "npm run build",
  "npm start",
];

const routes = [
  "http://localhost:3000",
  "http://localhost:3000/en",
  "http://localhost:3000/settings",
  "http://localhost:3000/diagnostics",
];

const requiredScreenshots = [
  "public-entry-dark.png",
  "public-entry-light.png",
  "workstation-dark.png",
  "workstation-light.png",
  "chart-focus.png",
  "execution-ticket.png",
  "assistant-open.png",
  "journal-coach.png",
  "settings.png",
  "diagnostics.png",
  "plan-surfaces.png",
  "arabic-rtl-workstation.png",
];

function area(
  input: LocalDayOneOperationReviewArea
): LocalDayOneOperationReviewArea {
  return input;
}

const reviewAreas: LocalDayOneOperationReviewArea[] = [
  area({
    id: "public_entry",
    label: "Public entry",
    status: "pass",
    reason: "Public entry is professional, local-safe, and does not imply launch.",
    evidence: ["Free / Pro / VIP / Institutional language", "paper-safe product truth"],
    nextAction: "Review dark and light public entry screenshots.",
  }),
  area({
    id: "free_clarity",
    label: "Free clarity",
    status: "pass",
    reason: "Free is active as the familiar paper-safe local layer.",
    evidence: ["Free plan is visible", "paper execution remains non-live"],
    nextAction: "Confirm Free feels familiar and premium during Day One.",
  }),
  area({
    id: "pro_planned_clarity",
    label: "Pro planned clarity",
    status: "pass",
    reason: "Pro is described as planned and not fake-activated.",
    evidence: ["Pro planned copy", "billing inactive"],
    nextAction: "Keep Pro language roadmap-only until real entitlement support exists.",
  }),
  area({
    id: "vip_planned_clarity",
    label: "VIP planned clarity",
    status: "pass",
    reason: "VIP is planned and does not promise signals, outcomes, or private access.",
    evidence: ["VIP planned copy", "no profit or win-rate claims"],
    nextAction: "Keep VIP premium but truthful.",
  }),
  area({
    id: "institutional_future_clarity",
    label: "Institutional future clarity",
    status: "pass",
    reason: "Institutional remains future-only and replaces Enterprise publicly.",
    evidence: ["Institutional public naming", "Enterprise not public"],
    nextAction: "Keep Institutional as future until a real path exists.",
  }),
  area({
    id: "workstation",
    label: "Trading Workspace",
    status: "pass",
    reason: "The workstation is chart-first and paper-safe.",
    evidence: ["chart-first layout", "execution ticket visible"],
    nextAction: "Review dark, light, and RTL workstation captures.",
  }),
  area({
    id: "chart",
    label: "Chart",
    status: "needs_ahmad_review",
    reason: "Chart renders and is protected, but Ahmad's human visual acceptance is required.",
    evidence: ["chart readiness gate", "visual proof requirement"],
    nextAction: "Capture chart-focus screenshot and record Ahmad's acceptance notes.",
  }),
  area({
    id: "paper_execution",
    label: "Paper execution",
    status: "pass",
    reason: "Paper execution can be reviewed locally while live/real-money routing remains blocked.",
    evidence: ["paper route available", "live execution blocked"],
    nextAction: "Review execution-ticket clarity only in paper mode.",
  }),
  area({
    id: "assistant",
    label: "TPM Assistant",
    status: "pass",
    reason: "Assistant is daily-use safe, plan-aware, and non-executing.",
    evidence: ["unsafe intents blocked", "Why Blocked and Journal/Coach guidance"],
    nextAction: "Open Assistant and test local state explanation.",
  }),
  area({
    id: "journal_coach",
    label: "Journal / Coach",
    status: "ready_with_notes",
    reason: "Safe paper-session reflection is ready; deeper persistence remains planned.",
    evidence: ["local/session memory", "no financial advice"],
    nextAction: "Record Day One reflection notes and prompt polish needs.",
  }),
  area({
    id: "settings",
    label: "Settings",
    status: "pass",
    reason: "Settings exposes user controls and product truth without activation controls.",
    evidence: ["billing inactive", "broker/feed inactive"],
    nextAction: "Review Settings for visual calm and clarity.",
  }),
  area({
    id: "diagnostics",
    label: "Diagnostics",
    status: "pass",
    reason: "Diagnostics provides compact readiness and safety truth.",
    evidence: ["readiness probes", "blocked truth"],
    nextAction: "Review Local Day One Operation readiness in Diagnostics.",
  }),
  area({
    id: "product_truth",
    label: "Product Truth",
    status: "pass",
    reason: "Launch, production, billing, broker/feed, live, real money, and social publishing are blocked.",
    evidence: ["Product Truth snapshot", "regression tests"],
    nextAction: "Keep truth boundaries visible during Day One.",
  }),
  area({
    id: "founder_command_privacy",
    label: "Founder Command privacy",
    status: "pass",
    reason: "Founder Command stays private, hidden from public nav, and not part of user plans.",
    evidence: ["public leak tests", "owner-only readiness"],
    nextAction: "Do not expose Founder Command in public UI.",
  }),
  area({
    id: "local_day_cycle",
    label: "Local Day Cycle",
    status: "pass",
    reason: "The local day cycle is established for start, review, validation, memory, and close.",
    evidence: ["21-stage cycle", "launch forbidden reminder"],
    nextAction: "Use the checklist from start to close.",
  }),
  area({
    id: "product_memory",
    label: "Product Memory",
    status: "ready_with_notes",
    reason: "Safe local/internal memory summaries are ready; no secrets or private sensitive data are stored.",
    evidence: ["memory safety policy", "secret storage rejected"],
    nextAction: "Store only safe summaries and Day One notes.",
  }),
  area({
    id: "build_room_readiness",
    label: "Build Room readiness",
    status: "pass",
    reason: "Build Room can draft safe next tasks without external Codex sending or execution.",
    evidence: ["draft-only construction queue", "blocked actions list"],
    nextAction: "Use Build Room to decide the next safe Codex task after Day One.",
  }),
];

export function getLocalDayOneOperationSnapshot(
  checkedAt = new Date().toISOString()
): LocalDayOneOperationSnapshot {
  const dayOne = getLocalDayOneReadinessSnapshot(checkedAt);
  const blocked = reviewAreas.filter((item) => item.status === "blocked_by_design");
  const needsAhmadReview = reviewAreas.filter(
    (item) => item.status === "needs_ahmad_review"
  );
  const notes = reviewAreas.filter((item) => item.status === "ready_with_notes");

  return {
    checkedAt,
    mode: "local_day_one_operation_gate",
    status:
      blocked.length > 0
        ? "blocked"
        : needsAhmadReview.length > 0 || notes.length > 0
        ? "ready_with_notes"
        : "ready_to_start",
    canStartLocalWork: blocked.length === 0 && dayOne.readyToStartLocalDayOne,
    canStartOnlyAs: "closed_local_paper_safe_review",
    ahmadHumanVisualAcceptanceRequired: true,
    ahmadVisualReviewRecorded: false,
    globalLaunchReadinessClaimed: false,
    commands,
    routes,
    reviewAreas,
    operationChecklist: [
      "run npm run build",
      "start local runtime",
      "review public entry",
      "review /en Trading Workspace",
      "review Settings",
      "review Diagnostics",
      "capture required screenshots",
      "record Ahmad visual acceptance notes",
      "record gaps and next safe task",
      "confirm Git clean and launch remains forbidden",
    ],
    finalChecklist: [
      "founder acceptance notes captured",
      "gaps captured",
      "next build task drafted",
      "validation recorded",
      "Git clean checked",
      "launch remains forbidden",
    ],
    visualProofDirectory: "test-results/final-local-day-one-operation/",
    requiredScreenshots,
    remainingLocalBlockers: blocked.map((item) => item.reason),
    notes: [
      "Ahmad human visual acceptance is still required before claiming visual acceptance.",
      "Journal/Coach and Product Memory are safe readiness foundations with deeper persistence planned.",
      "This gate is local work-start readiness only, not global launch readiness.",
    ],
    blockedByDesign: [
      "global launch",
      "production activation",
      "billing activation",
      "broker/feed activation",
      "live execution",
      "real-money routing",
      "social publishing",
      "fake users/revenue/metrics",
    ],
    truth: {
      localOnly: true,
      paperSafe: true,
      nonLaunch: true,
      nonProduction: true,
      billingActive: false,
      brokerFeedActive: false,
      liveExecutionActive: false,
      realMoneyActive: false,
      socialPublishingActive: false,
      fakeUsersRevenueMetrics: false,
      founderGoverned: true,
      globalLaunchReadinessClaimed: false,
    },
  };
}
