import "server-only";

import { getLocalOperationsReportSnapshot } from "@/lib/server/local-ops";
import { createProductMemoryDraft } from "./store";
import type { ProductMemoryItem } from "./types";

export function getLocalDayMemoryItems(
  checkedAt = new Date().toISOString()
): ProductMemoryItem[] {
  const report = getLocalOperationsReportSnapshot(checkedAt);
  const result = createProductMemoryDraft(
    {
      domain: "local_day_report",
      title: `Local day ${report.localDayNumber} readiness report`,
      summary:
        `State ${report.readinessState}; completed ${report.completedStages.length}; failed ${report.failedStages.length}; validation ${report.validationStatus}; next action ${report.nextActions[0]}.`,
      status: report.localDayNumber > 0 ? "draft" : "future",
      tags: ["local-ops", "day-cycle", report.readinessState],
      source: "local-operations-report",
      relatedArea: "local operation",
      sensitivity: "internal",
      visibility: "founder_only",
      productTruthImpact: "preserves_truth",
      founderDecisionImpact: report.founderDecisionNeeded ? "decision_needed" : "none",
    },
    checkedAt
  );

  return result.ok ? [result.item] : [];
}

export function getLocalDayMemorySnapshot(
  checkedAt = new Date().toISOString()
) {
  const report = getLocalOperationsReportSnapshot(checkedAt);
  const items = getLocalDayMemoryItems(checkedAt);

  return {
    checkedAt,
    mode: "local_day_report_memory_readiness" as const,
    report,
    items,
    storedFields: [
      "localDayNumber",
      "completed stages",
      "failed stages",
      "visual acceptance",
      "product truth",
      "Assistant status",
      "Journal/Coach status",
      "Diagnostics status",
      "validation status",
      "next actions",
      "Founder decision",
    ],
    truth: {
      launchAutomation: false,
      productionAction: false,
      fakeUsersStored: false,
      fakeMetricsStored: false,
    },
  };
}
