import "server-only";

import type {
  LocalDayOneReadinessCategory,
  LocalDayOneReadinessSnapshot,
  LocalDayOneReadinessStatus,
} from "./types";

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

const reviewChecklist = [
  "public entry",
  "Free plan clarity",
  "Pro planned clarity",
  "VIP planned clarity",
  "Institutional future clarity",
  "Trading Workspace",
  "chart",
  "paper execution",
  "TPM Assistant open and closed",
  "Why Blocked",
  "Journal/Coach",
  "Settings",
  "Diagnostics",
  "Earth Mark",
  "Swiss Precision Clock / Pulse",
  "no internal terminology leak",
  "no fake activation",
  "no visual blockers",
];

const endOfDayChecklist = [
  "record founder acceptance notes",
  "record gaps",
  "draft next safe build task",
  "Git clean",
  "confirm launch remains forbidden",
  "launch remains forbidden",
];

function category(input: LocalDayOneReadinessCategory): LocalDayOneReadinessCategory {
  return input;
}

const categories: LocalDayOneReadinessCategory[] = [
  category({
    id: "runtime_readiness",
    label: "Runtime readiness",
    status: "pass",
    reason: "The local app has a verified build/start baseline and stays local-only.",
    evidence: ["local runtime routes are defined", "production activation is out of scope"],
    nextAction: "Start the local runtime and review routes.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "public_entry_readiness",
    label: "Public entry readiness",
    status: "pass",
    reason:
      "Public entry uses professional plan language and does not claim launch, billing, broker/feed, or live trading.",
    evidence: ["Free / Pro / VIP / Institutional naming", "paper-safe entry path"],
    nextAction: "Review dark and light public entry screenshots.",
    blocker: null,
    humanAcceptanceNeeded: true,
  }),
  category({
    id: "trading_workstation_readiness",
    label: "Trading workstation readiness",
    status: "pass",
    reason: "The Trading Workspace is chart-first with execution kept visible and paper-safe.",
    evidence: ["chart-first layout", "execution rail remains blocked for live money"],
    nextAction: "Review workstation dark, light, and ultrawide states.",
    blocker: null,
    humanAcceptanceNeeded: true,
  }),
  category({
    id: "chart_readiness",
    label: "Chart readiness",
    status: "needs_ahmad_review",
    reason: "The repaired chart is protected, but final visual acceptance belongs to Ahmad.",
    evidence: ["chart dominance guard exists", "visual proof required"],
    nextAction: "Capture chart-focus proof and record Ahmad acceptance or polish notes.",
    blocker: null,
    humanAcceptanceNeeded: true,
  }),
  category({
    id: "paper_execution_readiness",
    label: "Paper execution readiness",
    status: "pass",
    reason: "Paper execution is visible; live execution and real-money routing remain blocked.",
    evidence: ["Buy / AI Wait / Sell are paper-only", "real-money mode cannot route orders"],
    nextAction: "Review paper ticket clarity during Local Day One.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "tpm_assistant_readiness",
    label: "TPM Assistant readiness",
    status: "pass",
    reason: "TPM Assistant is plan-aware, non-executing, and blocks unsafe intents.",
    evidence: ["safe intent model", "Why Blocked and Journal/Coach integration"],
    nextAction: "Test blocked intent and journal prompt examples.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "why_blocked_readiness",
    label: "Why Blocked readiness",
    status: "pass",
    reason:
      "Blocked states are explainable for live, real money, billing, broker/feed, launch, social publishing, and restricted controls.",
    evidence: ["state explanation engine", "Assistant blocked-state templates"],
    nextAction: "Confirm explanations are short and public-safe.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "journal_coach_readiness",
    label: "Journal / Coach readiness",
    status: "partial",
    reason:
      "Journal and Coach are safe for local reflection, while durable account-safe persistence remains planned.",
    evidence: ["paper-session prompts", "no financial advice", "local/session memory foundation"],
    nextAction: "Use Local Day One to decide if prompt wording needs polish.",
    blocker: null,
    humanAcceptanceNeeded: true,
  }),
  category({
    id: "settings_readiness",
    label: "Settings readiness",
    status: "pass",
    reason: "Settings acts as a user control center for account, plan, Assistant, Journal/Coach, theme, language, and truth.",
    evidence: ["public-safe settings sections", "no billing activation control"],
    nextAction: "Review Settings for compactness and clarity.",
    blocker: null,
    humanAcceptanceNeeded: true,
  }),
  category({
    id: "diagnostics_readiness",
    label: "Diagnostics readiness",
    status: "pass",
    reason: "Diagnostics shows readiness and product truth without raw secrets or fake metrics.",
    evidence: ["readiness probes", "blocked/inactive truth"],
    nextAction: "Review Local Day One readiness in Diagnostics.",
    blocker: null,
    humanAcceptanceNeeded: true,
  }),
  category({
    id: "plan_language_readiness",
    label: "Plan language readiness",
    status: "pass",
    reason: "Public plan language is Free, Pro, VIP, and Institutional; Enterprise is not public-facing.",
    evidence: ["plan label tests", "public language rules"],
    nextAction: "Keep terminology regression active.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "product_truth_readiness",
    label: "Product Truth readiness",
    status: "pass",
    reason:
      "Live execution, real money, broker/feed, billing, public launch, and social publishing remain blocked or inactive.",
    evidence: ["Product Truth snapshot", "state explanation coverage"],
    nextAction: "Verify Product Truth in Settings, Diagnostics, and Assistant.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "founder_command_privacy_readiness",
    label: "Founder Command privacy readiness",
    status: "pass",
    reason: "Founder Command remains owner-only, read-only, hidden from public navigation, and not a user plan feature.",
    evidence: ["no public nav", "owner-only readiness APIs", "approval execution disabled"],
    nextAction: "Keep public UI leak tests active.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "local_operations_protocol_readiness",
    label: "Local operations protocol readiness",
    status: "pass",
    reason: "Local doctrine, day cycle, readiness law, digital twin profiles, and reports are established.",
    evidence: ["21-stage local day cycle", "no automatic launch thresholds"],
    nextAction: "Run the Local Day One checklist from start to end.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "product_memory_readiness",
    label: "Product memory readiness",
    status: "partial",
    reason:
      "Product memory is safe and deterministic for local/internal readiness; durable production storage is intentionally not implemented.",
    evidence: ["secrets rejected", "raw sensitive data forbidden", "safe summaries only"],
    nextAction: "Use memory for summaries and product gaps, not surveillance or real user data.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "visual_acceptance_readiness",
    label: "Visual acceptance readiness",
    status: "needs_ahmad_review",
    reason: "The product can enter visual review, but final acceptance must be Ahmad's human judgment.",
    evidence: ["screenshot checklist defined", "no fake 10/10 allowed"],
    nextAction: "Capture final screenshots and record Ahmad acceptance notes.",
    blocker: null,
    humanAcceptanceNeeded: true,
  }),
  category({
    id: "security_safety_readiness",
    label: "Security / safety readiness",
    status: "pass",
    reason:
      "Dangerous actions remain blocked, secrets are not exposed, and auth/security boundaries remain preserved.",
    evidence: ["live/money/billing/feed/social blocked", "secret storage forbidden"],
    nextAction: "Keep validation and API leak tests active.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
  category({
    id: "git_validation_readiness",
    label: "Git / validation readiness",
    status: "partial",
    reason:
      "The gate documents the required validation and Git clean check; the actual result must come from the current command run.",
    evidence: ["validation command list", "git status expectation documented"],
    nextAction: "Run full validation, commit only after pass, then verify clean status.",
    blocker: null,
    humanAcceptanceNeeded: false,
  }),
];

function countStatus(status: LocalDayOneReadinessStatus) {
  return categories.filter((item) => item.status === status).length;
}

export function getLocalDayOneReadinessSnapshot(
  checkedAt = new Date().toISOString()
): LocalDayOneReadinessSnapshot {
  const blockers = categories
    .filter((item) => item.status === "blocker")
    .map((item) => item.blocker ?? item.reason);
  const partialCount = countStatus("partial");
  const needsAhmadReview = countStatus("needs_ahmad_review");

  return {
    checkedAt,
    mode: "local_day_one_acceptance_gate",
    operationMode: "closed_local_product_review",
    gateStatus:
      blockers.length > 0
        ? "not_ready"
        : partialCount > 0 || needsAhmadReview > 0
        ? "local_operations_ready"
        : "local_operations_ready",
    readyToStartLocalDayOne: blockers.length === 0,
    ahmadHumanReviewRequired: true,
    globalLaunchEvaluation: "not_evaluated",
    categories,
    summary: {
      total: categories.length,
      pass: countStatus("pass"),
      partial: partialCount,
      blocker: blockers.length,
      planned: countStatus("planned"),
      blockedByDesign: countStatus("blocked_by_design"),
      needsAhmadReview,
    },
    commands,
    routes,
    reviewChecklist,
    endOfDayChecklist,
    blockers,
    launchForbiddenReminder:
      "Local Day One can only start closed local review. It does not evaluate or authorize global launch, production, billing, broker/feed activation, live execution, real-money routing, or social publishing.",
    truth: {
      localOnly: true,
      paperSafe: true,
      productionActive: false,
      billingActive: false,
      brokerFeedActive: false,
      liveExecutionActive: false,
      realMoneyActive: false,
      publicLaunchActive: false,
      socialPublishingActive: false,
      fakeUsersRevenueMetrics: false,
      globalLaunchReadinessClaimed: false,
    },
  };
}
