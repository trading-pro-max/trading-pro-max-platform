import "server-only";

import { getConstructionQueueSnapshot } from "@/lib/server/codex-construction";
import { getProductGapMemorySnapshot } from "@/lib/server/product-memory/product-gaps";
import { getValidationSummaryMemorySnapshot } from "@/lib/server/product-memory/validation-summary";
import { getProductRealityFinalScoreSnapshot } from "@/lib/server/product-reality";
import { getLocalDailyOperationsLoopSnapshot } from "./daily-loop";
import { getLocalDayOneReadinessSnapshot } from "./day-one";

export type LocalDailyReportSnapshot = {
  checkedAt: string;
  mode: "local_daily_operations_report";
  dayNumber: number;
  readiness: {
    state: "day_one_candidate";
    localDayOneGate: string;
    readyToStartLocalDayOne: boolean;
    ahmadReviewRequired: true;
    globalLaunchEvaluated: false;
  };
  scores: {
    productRealityOverall: number;
    scoreScale: "0_to_10";
    noPerfectScoreClaim: true;
    ahmadHumanAcceptanceRequired: true;
  };
  gaps: Array<{
    id: string;
    category: string;
    severity: string;
    summary: string;
    affectedSurface: string;
    nextAction: string;
  }>;
  nextTask: {
    title: string;
    source: "construction_queue";
    status: string;
    externalExecutionActive: false;
    founderApprovalRequired: boolean;
  };
  validation: {
    status: "not_run_for_today";
    commands: Array<{
      command: string;
      status: "not_run";
    }>;
    rawLogsStored: false;
    falsePassAllowed: false;
  };
  gitClean: "not_evaluated_by_snapshot";
  completedStages: string[];
  plannedStages: string[];
  launchForbiddenReminder: string;
  founderDecisionNeeded: true;
  truth: {
    localOnly: true;
    paperSafe: true;
    productionActive: false;
    launchActive: false;
    billingActive: false;
    brokerFeedActive: false;
    liveExecutionActive: false;
    realMoneyActive: false;
    socialPublishingActive: false;
    secretsStored: false;
    privateSensitiveDataStored: false;
    surveillanceActive: false;
    fakeUsersRevenueMetrics: false;
  };
};

export function getLocalDailyOperationsReportSnapshot(
  checkedAt = new Date().toISOString()
): LocalDailyReportSnapshot {
  const loop = getLocalDailyOperationsLoopSnapshot(checkedAt);
  const dayOne = getLocalDayOneReadinessSnapshot(checkedAt);
  const finalScore = getProductRealityFinalScoreSnapshot(checkedAt);
  const gaps = getProductGapMemorySnapshot(checkedAt);
  const validation = getValidationSummaryMemorySnapshot(checkedAt);
  const queue = getConstructionQueueSnapshot(checkedAt);
  const nextQueueItem =
    queue.items.find((item) => item.status !== "blocked") ?? queue.items[0];

  return {
    checkedAt,
    mode: "local_daily_operations_report",
    dayNumber: 1,
    readiness: {
      state: "day_one_candidate",
      localDayOneGate: dayOne.gateStatus,
      readyToStartLocalDayOne: dayOne.readyToStartLocalDayOne,
      ahmadReviewRequired: true,
      globalLaunchEvaluated: false,
    },
    scores: {
      productRealityOverall: finalScore.overallScore,
      scoreScale: "0_to_10",
      noPerfectScoreClaim: true,
      ahmadHumanAcceptanceRequired: true,
    },
    gaps: gaps.gaps
      .filter((gap) => gap.status !== "resolved")
      .slice(0, 5)
      .map((gap) => ({
        id: gap.id,
        category: gap.category,
        severity: gap.severity,
        summary: gap.gap,
        affectedSurface: gap.affectedSurface,
        nextAction: gap.nextAction,
      })),
    nextTask: {
      title: nextQueueItem?.title ?? "Draft next safe local build task",
      source: "construction_queue",
      status: nextQueueItem?.status ?? "proposed",
      externalExecutionActive: false,
      founderApprovalRequired: nextQueueItem?.founderApprovalRequired ?? true,
    },
    validation: {
      status: "not_run_for_today",
      commands: validation.commandStatuses.map((command) => ({
        command: command.command,
        status: "not_run",
      })),
      rawLogsStored: false,
      falsePassAllowed: false,
    },
    gitClean: "not_evaluated_by_snapshot",
    completedStages: [],
    plannedStages: loop.stages.map((stage) => stage.id),
    launchForbiddenReminder:
      "This daily report is local-only. It does not authorize launch, production, billing, broker/feed activation, live execution, real-money routing, social publishing, or secret storage.",
    founderDecisionNeeded: true,
    truth: {
      localOnly: true,
      paperSafe: true,
      productionActive: false,
      launchActive: false,
      billingActive: false,
      brokerFeedActive: false,
      liveExecutionActive: false,
      realMoneyActive: false,
      socialPublishingActive: false,
      secretsStored: false,
      privateSensitiveDataStored: false,
      surveillanceActive: false,
      fakeUsersRevenueMetrics: false,
    },
  };
}
