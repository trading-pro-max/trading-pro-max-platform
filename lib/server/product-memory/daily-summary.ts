import "server-only";

import { getBuildDecisionMemorySnapshot } from "./build-decisions";
import { getFounderAcceptanceProductMemorySnapshot } from "./founder-acceptance";
import { getLocalDailyOperationsLoopSnapshot } from "@/lib/server/local-ops/daily-loop";
import { getLocalDailyOperationsReportSnapshot } from "@/lib/server/local-ops/daily-report";
import { getLocalDayMemorySnapshot } from "./local-day";
import { getProductGapMemorySnapshot } from "./product-gaps";
import { getProductMemorySummarySnapshot } from "./state";
import { getValidationSummaryMemorySnapshot } from "./validation-summary";

export type ProductMemoryDailySummarySnapshot = {
  checkedAt: string;
  mode: "product_memory_daily_summary";
  status: "ready";
  dailyLoop: {
    totalStages: number;
    memoryTouchpoints: number;
    codexTouchpoints: number;
    automaticLaunch: false;
  };
  latestLocalDay: {
    dayNumber: number;
    readinessState: string;
    gitClean: string;
    validationStatus: string;
    launchForbiddenReminder: string;
  };
  founderAcceptance: {
    supportedStates: string[];
    categories: string[];
    recentDecisions: number;
    ahmadReviewRequired: true;
  };
  productGaps: {
    total: number;
    open: number;
    blockers: number;
    safeSummaryOnly: true;
    topGaps: Array<{
      id: string;
      category: string;
      severity: string;
      summary: string;
      nextAction: string;
    }>;
  };
  validation: {
    storagePolicy: "summary_only_no_raw_logs";
    commands: number;
    rawLogsStored: false;
    secretsStored: false;
    falsePassAllowed: false;
  };
  buildDecisions: {
    rememberedDecisions: number;
    externalCodexCalls: false;
    codeExecutionTriggered: false;
  };
  localDayReports: {
    storedFields: string[];
    launchAutomation: false;
  };
  memoryStatus: {
    storageMode: string;
    domains: number;
    safetyStatus: "safe_readiness_only";
    forbiddenStorageReminders: string[];
  };
  suggestedNextTask: {
    title: string;
    founderApprovalRequired: boolean;
    externalExecutionActive: false;
  };
  truth: {
    secretsStored: false;
    privateSensitiveDataStored: false;
    rawUserTrackingEnabled: false;
    surveillanceActive: false;
    fakeUsersStored: false;
    fakeRevenueStored: false;
    fakeMetricsStored: false;
    productionStorageActive: false;
    automaticExternalSync: false;
    launchAutomation: false;
  };
};

export function getProductMemoryDailySummarySnapshot(
  checkedAt = new Date().toISOString()
): ProductMemoryDailySummarySnapshot {
  const loop = getLocalDailyOperationsLoopSnapshot(checkedAt);
  const dailyReport = getLocalDailyOperationsReportSnapshot(checkedAt);
  const founderAcceptance = getFounderAcceptanceProductMemorySnapshot(checkedAt);
  const gaps = getProductGapMemorySnapshot(checkedAt);
  const validation = getValidationSummaryMemorySnapshot(checkedAt);
  const buildDecisions = getBuildDecisionMemorySnapshot(checkedAt);
  const localDay = getLocalDayMemorySnapshot(checkedAt);
  const memorySummary = getProductMemorySummarySnapshot(checkedAt);

  return {
    checkedAt,
    mode: "product_memory_daily_summary",
    status: "ready",
    dailyLoop: {
      totalStages: loop.summary.totalStages,
      memoryTouchpoints: loop.summary.memoryTouchpoints,
      codexTouchpoints: loop.summary.codexTouchpoints,
      automaticLaunch: false,
    },
    latestLocalDay: {
      dayNumber: dailyReport.dayNumber,
      readinessState: dailyReport.readiness.state,
      gitClean: dailyReport.gitClean,
      validationStatus: dailyReport.validation.status,
      launchForbiddenReminder: dailyReport.launchForbiddenReminder,
    },
    founderAcceptance: {
      supportedStates: loop.founderAcceptanceStates,
      categories: founderAcceptance.categories,
      recentDecisions: founderAcceptance.items.length,
      ahmadReviewRequired: true,
    },
    productGaps: {
      total: gaps.summary.total,
      open: gaps.summary.open,
      blockers: gaps.summary.blockers,
      safeSummaryOnly: true,
      topGaps: dailyReport.gaps.map((gap) => ({
        id: gap.id,
        category: gap.category,
        severity: gap.severity,
        summary: gap.summary,
        nextAction: gap.nextAction,
      })),
    },
    validation: {
      storagePolicy: "summary_only_no_raw_logs",
      commands: validation.commandStatuses.length,
      rawLogsStored: false,
      secretsStored: false,
      falsePassAllowed: false,
    },
    buildDecisions: {
      rememberedDecisions: buildDecisions.summary.rememberedDecisions,
      externalCodexCalls: false,
      codeExecutionTriggered: false,
    },
    localDayReports: {
      storedFields: localDay.storedFields,
      launchAutomation: false,
    },
    memoryStatus: {
      storageMode: memorySummary.storage.persistence,
      domains: memorySummary.domainSummary.length,
      safetyStatus: memorySummary.founderSummary.memorySafetyStatus,
      forbiddenStorageReminders:
        memorySummary.founderSummary.forbiddenStorageReminders,
    },
    suggestedNextTask: {
      title: dailyReport.nextTask.title,
      founderApprovalRequired: dailyReport.nextTask.founderApprovalRequired,
      externalExecutionActive: false,
    },
    truth: {
      secretsStored: false,
      privateSensitiveDataStored: false,
      rawUserTrackingEnabled: false,
      surveillanceActive: false,
      fakeUsersStored: false,
      fakeRevenueStored: false,
      fakeMetricsStored: false,
      productionStorageActive: false,
      automaticExternalSync: false,
      launchAutomation: false,
    },
  };
}
