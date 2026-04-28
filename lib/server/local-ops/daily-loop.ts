import "server-only";

import { getLocalDayCycleSnapshot } from "./day-cycle";
import { getLocalDayOneReadinessSnapshot } from "./day-one";

export type LocalDailyLoopStageId =
  | "start"
  | "inspect_build"
  | "inspect_routes"
  | "review_public_entry"
  | "review_workstation"
  | "review_assistant"
  | "review_journal_coach"
  | "review_settings_diagnostics"
  | "record_founder_acceptance"
  | "record_product_gaps"
  | "draft_codex_task"
  | "validate"
  | "store_summary"
  | "close_day";

export type LocalDailyLoopStage = {
  id: LocalDailyLoopStageId;
  order: number;
  label: string;
  purpose: string;
  checks: string[];
  passCriteria: string[];
  output: string;
  memoryTouchpoint: boolean;
  codexTouchpoint: boolean;
  automationAllowed: false;
};

export type LocalDailyLoopSnapshot = {
  checkedAt: string;
  mode: "local_daily_operations_loop";
  status: "ready";
  sourceCycleStages: number;
  stages: LocalDailyLoopStage[];
  founderAcceptanceStates: Array<
    | "accepted"
    | "needs_polish"
    | "confusing"
    | "too_much"
    | "missing"
    | "blocked_by_design"
    | "future"
  >;
  summary: {
    totalStages: number;
    memoryTouchpoints: number;
    codexTouchpoints: number;
    readinessGate: string;
    launchCriteriaIncluded: false;
    automaticLaunch: false;
    productionActionIncluded: false;
    billingActionIncluded: false;
    brokerFeedActionIncluded: false;
    realMoneyActionIncluded: false;
    secretStorageIncluded: false;
    surveillanceIncluded: false;
  };
  dailyOutputs: string[];
  nextSafeActions: string[];
  truth: {
    localOnly: true;
    readinessOnly: true;
    paperSafe: true;
    storesSecrets: false;
    storesPrivateSensitiveData: false;
    createsSurveillance: false;
    autoLaunch: false;
    productionActivation: false;
    billingActivation: false;
    brokerFeedActivation: false;
    liveExecutionActivation: false;
    realMoneyRouting: false;
    externalPublishing: false;
  };
};

const stages: LocalDailyLoopStage[] = [
  {
    id: "start",
    order: 1,
    label: "Start",
    purpose: "Open the local review day with paper-safe, non-launch intent.",
    checks: ["Confirm local-only mode", "Confirm no activation request is in scope"],
    passCriteria: ["Local review starts without production, launch, billing, live, or broker/feed work"],
    output: "Daily local operation started",
    memoryTouchpoint: false,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "inspect_build",
    order: 2,
    label: "Inspect build",
    purpose: "Review build readiness before judging the product surface.",
    checks: ["Check validation plan", "Confirm Git state is known", "Avoid secret changes"],
    passCriteria: ["Build status is honestly recorded or marked not run"],
    output: "Build inspection note",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "inspect_routes",
    order: 3,
    label: "Inspect routes",
    purpose: "Review the local public, settings, diagnostics, and workstation routes.",
    checks: ["Review /", "Review /trading", "Review /settings", "Review /diagnostics"],
    passCriteria: ["Routes are reviewed locally without public exposure"],
    output: "Route review note",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "review_public_entry",
    order: 4,
    label: "Review public entry",
    purpose: "Check public clarity, plan language, Earth Mark, and non-launch truth.",
    checks: ["Free / Pro / VIP / Institutional", "No internal command language", "No fake activation"],
    passCriteria: ["Public entry is clear, premium, and truthful"],
    output: "Public entry acceptance or gap note",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "review_workstation",
    order: 5,
    label: "Review workstation",
    purpose: "Check chart-first workspace, execution clarity, and no distracting overlays.",
    checks: ["Chart dominance", "Paper execution", "Assistant placement", "Why Blocked visibility"],
    passCriteria: ["Workspace remains professional, chart-first, and paper-safe"],
    output: "Workstation acceptance or gap note",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "review_assistant",
    order: 6,
    label: "Review TPM Assistant",
    purpose: "Review safe daily-use guidance, blocked intent handling, and public terminology.",
    checks: ["No signals", "No profit claims", "No internal governance terms", "No execution authority"],
    passCriteria: ["Assistant is useful, concise, plan-aware, and safe"],
    output: "Assistant review note",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "review_journal_coach",
    order: 7,
    label: "Review Journal / Coach",
    purpose: "Check reflection prompts and learning support without advice or pressure.",
    checks: ["No financial advice", "No outcome promise", "Persistence truth is visible"],
    passCriteria: ["Journal and Coach support safe local reflection"],
    output: "Journal / Coach review note",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "review_settings_diagnostics",
    order: 8,
    label: "Review Settings / Diagnostics",
    purpose: "Review user controls and readiness truth without raw internal overload.",
    checks: ["Settings clarity", "Diagnostics compactness", "No secrets", "No fake metrics"],
    passCriteria: ["Settings and Diagnostics are useful, compact, and public-safe"],
    output: "Settings / Diagnostics note",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "record_founder_acceptance",
    order: 9,
    label: "Record Founder acceptance",
    purpose: "Capture Ahmad's acceptance state as a safe local summary.",
    checks: ["accepted", "needs_polish", "confusing", "too_much", "missing", "blocked_by_design", "future"],
    passCriteria: ["Acceptance status is recorded without secrets or private sensitive data"],
    output: "Founder acceptance memory summary",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "record_product_gaps",
    order: 10,
    label: "Record product gaps",
    purpose: "Capture visual, UX, Assistant, Journal/Coach, and truth gaps as safe summaries.",
    checks: ["Affected surface", "Severity", "Suggested fix", "Safe next action"],
    passCriteria: ["Gaps are summarized without raw private data or activation claims"],
    output: "Product gap memory summary",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "draft_codex_task",
    order: 11,
    label: "Draft Codex task",
    purpose: "Draft the next safe local build task for manual Ahmad approval.",
    checks: ["Scope", "Forbidden scope", "Likely files", "Validation commands", "Product truth"],
    passCriteria: ["Task remains draft-only and excludes dangerous activation"],
    output: "Codex-ready draft candidate",
    memoryTouchpoint: true,
    codexTouchpoint: true,
    automationAllowed: false,
  },
  {
    id: "validate",
    order: 12,
    label: "Validate",
    purpose: "Run or record the validation status honestly before accepting the day.",
    checks: ["TypeScript", "ESLint", "Build", "Prisma", "Regression", "Smoke", "Diff check"],
    passCriteria: ["Validation status is recorded without false pass"],
    output: "Validation summary",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "store_summary",
    order: 13,
    label: "Store summary",
    purpose: "Store only safe local/internal summaries for the next day.",
    checks: ["No secrets", "No sensitive private data", "No raw logs", "No fake metrics"],
    passCriteria: ["Only safe readiness summaries are persisted or modeled"],
    output: "Product memory daily summary",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
  {
    id: "close_day",
    order: 14,
    label: "Close day",
    purpose: "Close the local day with launch forbidden and next safe action selected.",
    checks: ["Git clean expectation", "Next task", "Blockers", "Launch forbidden reminder"],
    passCriteria: ["Day closes without dangling activation or public launch claims"],
    output: "Closed local day report",
    memoryTouchpoint: true,
    codexTouchpoint: false,
    automationAllowed: false,
  },
];

export function getLocalDailyOperationsLoopSnapshot(
  checkedAt = new Date().toISOString()
): LocalDailyLoopSnapshot {
  const dayCycle = getLocalDayCycleSnapshot(checkedAt);
  const dayOne = getLocalDayOneReadinessSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "local_daily_operations_loop",
    status: "ready",
    sourceCycleStages: dayCycle.summary.totalStages,
    stages,
    founderAcceptanceStates: [
      "accepted",
      "needs_polish",
      "confusing",
      "too_much",
      "missing",
      "blocked_by_design",
      "future",
    ],
    summary: {
      totalStages: stages.length,
      memoryTouchpoints: stages.filter((stage) => stage.memoryTouchpoint).length,
      codexTouchpoints: stages.filter((stage) => stage.codexTouchpoint).length,
      readinessGate: dayOne.gateStatus,
      launchCriteriaIncluded: false,
      automaticLaunch: false,
      productionActionIncluded: false,
      billingActionIncluded: false,
      brokerFeedActionIncluded: false,
      realMoneyActionIncluded: false,
      secretStorageIncluded: false,
      surveillanceIncluded: false,
    },
    dailyOutputs: [
      "Founder acceptance summary",
      "Product gap summary",
      "Codex task draft candidate",
      "Validation summary",
      "Local day report",
      "Product memory daily summary",
    ],
    nextSafeActions: [
      "Run the daily loop locally from Start through Close day.",
      "Record only safe summaries for founder acceptance, product gaps, validation, and build decisions.",
      "Draft the next Codex task for manual Ahmad approval without external execution.",
    ],
    truth: {
      localOnly: true,
      readinessOnly: true,
      paperSafe: true,
      storesSecrets: false,
      storesPrivateSensitiveData: false,
      createsSurveillance: false,
      autoLaunch: false,
      productionActivation: false,
      billingActivation: false,
      brokerFeedActivation: false,
      liveExecutionActivation: false,
      realMoneyRouting: false,
      externalPublishing: false,
    },
  };
}
