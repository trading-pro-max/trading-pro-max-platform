import "server-only";

import {
  compileCodexTaskDraft,
  getConstructionQueueSnapshot,
} from "@/lib/server/codex-construction";
import type { CodexTaskDraft } from "@/lib/server/codex-construction";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import {
  getLocalDayOneReadinessSnapshot,
  getLocalOperationsFinalReportSnapshot,
} from "@/lib/server/local-ops";
import {
  getProductGapMemorySnapshot,
  getProductMemorySummarySnapshot,
  getValidationSummaryMemorySnapshot,
} from "@/lib/server/product-memory";
import { getProductRealityFinalScoreSnapshot } from "@/lib/server/product-reality";
import type { FounderBuildRoomSnapshot } from "./types";

const blockedActions = [
  "live execution activation",
  "real-money routing",
  "billing activation",
  "broker/feed activation",
  "public launch",
  "production secret changes",
  "social publishing",
  "fake users/revenue/metrics",
  "fake Pro/VIP/Institutional activation",
  "automatic external Codex sending",
  "uncontrolled autonomous execution",
];

const nextSafeBuildActions = [
  "Review Local Day One screenshots and record Ahmad visual acceptance notes.",
  "Choose one open visual or UX gap and generate a scoped Codex draft.",
  "Run the full validation command set after any build pass.",
  "Update product memory with accepted decisions, gaps, and validation summaries.",
  "Keep Founder Command private and read-only until owner auth and audit gates exist.",
];

const draftInputs = [
  {
    suffix: "visual_simplification",
    title: "Visual simplification and global trading polish",
    type: "visual_gap_detected" as const,
    affectedArea: "Public UI and Trading Workspace",
    affectedFiles: [
      "modules/product/components/PublicProductEntry.tsx",
      "modules/shell/components/TradingWorkstation.tsx",
      "app/theme-localization.css",
      "tests/regression/verified-platform-truth.spec.ts",
    ],
  },
  {
    suffix: "chart_polish",
    title: "Chart polish for local Day One acceptance",
    type: "chart_quality_low" as const,
    affectedArea: "Trading Workspace chart",
    affectedFiles: [
      "modules/shell/components/TradingWorkstation.tsx",
      "app/theme-localization.css",
      "tests/regression/verified-platform-truth.spec.ts",
    ],
  },
  {
    suffix: "assistant_improvement",
    title: "TPM Assistant daily-use improvement",
    type: "assistant_context_missing" as const,
    affectedArea: "TPM Assistant",
    affectedFiles: [
      "lib/server/companion/context.ts",
      "lib/server/companion/responses.ts",
      "modules/companion/components/TPMCompanionPanel.tsx",
      "tests/regression/verified-platform-truth.spec.ts",
    ],
  },
  {
    suffix: "journal_coach",
    title: "Journal and Coach local reflection improvement",
    type: "codex_task_needed" as const,
    affectedArea: "Journal / Coach",
    affectedFiles: [
      "lib/server/journal-coach/state.ts",
      "modules/journal-coach/components",
      "docs/product/academy-journal-coach.md",
      "tests/regression/verified-platform-truth.spec.ts",
    ],
  },
  {
    suffix: "settings_diagnostics",
    title: "Settings and Diagnostics cleanup",
    type: "ux_confusion_detected" as const,
    affectedArea: "Settings and Diagnostics",
    affectedFiles: [
      "modules/shell/components/PlatformUtilitySurfaces.tsx",
      "lib/server/diagnostics/health.ts",
      "tests/regression/verified-platform-truth.spec.ts",
    ],
  },
  {
    suffix: "public_entry",
    title: "Public entry local acceptance polish",
    type: "visual_gap_detected" as const,
    affectedArea: "Public entry",
    affectedFiles: [
      "modules/product/components/PublicProductEntry.tsx",
      "modules/brand/components/ProductLogo.tsx",
      "app/theme-localization.css",
    ],
  },
  {
    suffix: "local_day_blocker",
    title: "Local Day One blocker fix",
    type: "validation_failed" as const,
    affectedArea: "Local operations readiness",
    affectedFiles: [
      "lib/server/local-ops",
      "lib/server/product-reality",
      "docs/product/local-day-one-acceptance.md",
      "tests/regression/verified-platform-truth.spec.ts",
    ],
  },
  {
    suffix: "test_cleanup",
    title: "Regression and smoke test cleanup",
    type: "regression_failed" as const,
    affectedArea: "Validation",
    affectedFiles: [
      "tests/regression/verified-platform-truth.spec.ts",
      "scripts/tpm-canonical-routes-smoke.mjs",
    ],
  },
];

function compileBuildRoomDraft(
  input: (typeof draftInputs)[number],
  checkedAt: string
): CodexTaskDraft {
  const draft = compileCodexTaskDraft(
    {
      title: input.title,
      type: input.type,
      affectedArea: input.affectedArea,
      affectedFiles: input.affectedFiles,
      source: "founder_command_build_room",
    },
    checkedAt
  );

  return {
    ...draft,
    taskId: `${draft.taskId}_${input.suffix}`,
    title: input.title,
    mission: `Build Room draft: ${input.title}`,
    executionTruth: "draft_only_not_sent_not_executed",
  };
}

function areaStatus(
  areas: ReturnType<typeof getProductRealityFinalScoreSnapshot>["areas"],
  area: (typeof areas)[number]["area"]
) {
  const item = areas.find((candidate) => candidate.area === area);

  return item
    ? `${item.status} (${item.score}/10)`
    : "not evaluated by final score";
}

export function getFounderBuildRoomSnapshot(
  checkedAt = new Date().toISOString()
): FounderBuildRoomSnapshot {
  const localDayOne = getLocalDayOneReadinessSnapshot(checkedAt);
  const finalReport = getLocalOperationsFinalReportSnapshot(checkedAt);
  const productGaps = getProductGapMemorySnapshot(checkedAt);
  const validation = getValidationSummaryMemorySnapshot(checkedAt);
  const productMemory = getProductMemorySummarySnapshot(checkedAt);
  const constructionQueue = getConstructionQueueSnapshot(checkedAt);
  const productReality = getProductRealityFinalScoreSnapshot(checkedAt);
  const journalCoach = getJournalCoachSnapshot(checkedAt);
  const topProductGaps = productGaps.gaps
    .filter((gap) => gap.status !== "resolved")
    .slice(0, 6);
  const topVisualGaps = productGaps.gaps
    .filter((gap) => gap.category === "visual" || gap.category === "chart")
    .slice(0, 4);
  const codexTaskDrafts = draftInputs.map((input) =>
    compileBuildRoomDraft(input, checkedAt)
  );

  return {
    checkedAt,
    mode: "founder_command_build_room",
    localMode: "local_laptop_universe",
    readinessStatus: localDayOne.readyToStartLocalDayOne
      ? "ready_for_local_build_drafting"
      : "blocked",
    routeExposure: {
      hiddenRouteCreated: false,
      apiReadinessAdded: true,
      publicNavigationVisible: false,
      userPlanExposure: false,
      reason:
        "No /founder/build-room route is created until owner authentication, device trust, and step-up confirmation are sufficient.",
    },
    localDayReadiness: {
      gateStatus: localDayOne.gateStatus,
      readyToStartLocalDayOne: localDayOne.readyToStartLocalDayOne,
      ahmadHumanReviewRequired: localDayOne.ahmadHumanReviewRequired,
      globalLaunchEvaluation: localDayOne.globalLaunchEvaluation,
    },
    topProductGaps,
    topVisualGaps,
    assistantStatus: "safe daily-use foundation ready; no execution authority",
    journalCoachStatus: `${journalCoach.planAccess.demo}; ${journalCoach.memoryFoundation.persistence}`,
    workstationStatus: areaStatus(productReality.areas, "workstation_clarity"),
    chartStatus: areaStatus(productReality.areas, "chart_dominance"),
    settingsStatus: areaStatus(productReality.areas, "settings_organization"),
    diagnosticsStatus: areaStatus(productReality.areas, "diagnostics_organization"),
    validationStatus: {
      commands: validation.commandStatuses,
      policy: "summary_only_no_raw_logs",
      falsePassAllowed: false,
    },
    memoryStatus: {
      storage: productMemory.storage,
      domainCount: productMemory.domainSummary.length,
      openProductGaps: productMemory.founderSummary.openProductGaps.length,
      secretsStored: productMemory.truth.secretsStored,
      privateSensitiveDataStored: productMemory.truth.privateSensitiveDataStored,
    },
    constructionQueueStatus: constructionQueue.summary,
    nextSafeBuildActions,
    blockedActions,
    codexTaskDrafts,
    founderDecisionNeeded: true,
    whatNotToDo: [
      ...blockedActions,
      "treat Codex drafts as already approved",
      "send tasks externally without Ahmad review",
      "claim Local Day One is global launch readiness",
      ...finalReport.blockedByDesign,
    ],
    productReality: {
      overallScore: productReality.overallScore,
      status: productReality.status,
      ahmadHumanAcceptanceRequired: productReality.ahmadHumanAcceptanceRequired,
      noPerfectScoreClaim: productReality.truth.noPerfectScoreClaim,
    },
    truth: {
      noSecrets: true,
      noPrivateUserData: true,
      noFakeUsers: true,
      noFakeRevenue: true,
      noFakeMetrics: true,
      noAutomaticCodexSending: true,
      noUncontrolledAutomation: true,
      approvalExecutionActive: false,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerFeedActivation: "blocked",
      billing: "inactive",
      publicLaunch: "inactive",
      socialPublishing: "inactive",
    },
  };
}

export function getFounderBuildRoomReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getFounderBuildRoomSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_build_room_readiness" as const,
    localMode: snapshot.localMode,
    readinessStatus: snapshot.readinessStatus,
    routeExposure: snapshot.routeExposure,
    localDayReadiness: snapshot.localDayReadiness,
    summaries: {
      productGaps: snapshot.topProductGaps.length,
      visualGaps: snapshot.topVisualGaps.length,
      codexTaskDrafts: snapshot.codexTaskDrafts.length,
      constructionQueueTotal: snapshot.constructionQueueStatus.total,
      blockedConstructionItems: snapshot.constructionQueueStatus.blocked,
      validationCommands: snapshot.validationStatus.commands.length,
      nextSafeBuildActions: snapshot.nextSafeBuildActions.length,
      blockedActions: snapshot.blockedActions.length,
    },
    productReality: snapshot.productReality,
    truth: snapshot.truth,
  };
}
