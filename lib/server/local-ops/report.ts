import "server-only";

import { getProductTruthSnapshot } from "@/lib/server/product";
import { getLocalDayCycleSnapshot } from "./day-cycle";
import { getLocalDigitalTwinSnapshot } from "./digital-twin";
import { getFounderAcceptanceMemorySnapshot } from "./founder-acceptance";
import { getLocalReadinessLawSnapshot } from "./readiness-law";
import type { LocalOperationsReport } from "./types";

export function getLocalOperationsReportSnapshot(
  checkedAt = new Date().toISOString()
): LocalOperationsReport {
  const productTruth = getProductTruthSnapshot(checkedAt);
  const readinessLaw = getLocalReadinessLawSnapshot(checkedAt, 0);

  return {
    checkedAt,
    mode: "local_operations_report",
    date: checkedAt.slice(0, 10),
    localDayNumber: 0,
    readinessState: readinessLaw.readinessState,
    completedStages: [],
    failedStages: [],
    visualAcceptance: "needs_human_acceptance",
    productTruthStatus:
      productTruth.summary.liveExecution === "blocked" &&
      productTruth.summary.realMoneyRouting === "blocked" &&
      productTruth.summary.billing === "inactive" &&
      productTruth.summary.publicLaunch === "inactive"
        ? "local_truth_visible"
        : "blocked_truth_required",
    assistantStatus: "ready_for_local_review",
    journalCoachStatus: "ready_for_local_review",
    diagnosticsStatus: "ready_for_local_review",
    gitStatus: "not_evaluated_by_snapshot",
    validationStatus: "not_run_for_today",
    blockers: [
      "No completed local day has been recorded in this deterministic snapshot.",
      "Human Founder visual acceptance is required.",
      "Global launch remains forbidden until a future explicit approval phase.",
    ],
    nextActions: [
      "Run the Local Day Cycle from public entry through end-of-day report.",
      "Record Founder acceptance notes without private data or secrets.",
      "Run validation before committing local refinements.",
    ],
    founderDecisionNeeded: true,
    launchForbiddenReminder:
      "Local maturity does not authorize public launch, production activation, billing, broker/feed activation, live execution, real-money routing, or social publishing.",
    truth: {
      localOnly: true,
      paperSafe: true,
      productionAction: "blocked",
      launchAction: "blocked",
      billingAction: "blocked",
      brokerFeedAction: "blocked",
      realMoneyAction: "blocked",
      socialPublishingAction: "blocked",
      fakeUsersMetricsRevenue: "not_allowed",
    },
  };
}

export function getLocalOperationsReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const dayCycle = getLocalDayCycleSnapshot(checkedAt);
  const readinessLaw = getLocalReadinessLawSnapshot(checkedAt, 0);
  const digitalTwin = getLocalDigitalTwinSnapshot(checkedAt);
  const founderAcceptance = getFounderAcceptanceMemorySnapshot(checkedAt);
  const report = getLocalOperationsReportSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "local_sovereign_operations_readiness" as const,
    doctrine: {
      localCapital: "Ahmad's device",
      operation: "closed local universe",
      purpose: "testing, observation, refinement, and Founder acceptance",
      globalLaunchForbidden: true,
    },
    dayCycle: {
      totalStages: dayCycle.summary.totalStages,
      stages: dayCycle.stages.map((stage) => ({
        id: stage.id,
        order: stage.order,
        name: stage.name,
      })),
      launchCriteriaIncluded: dayCycle.summary.launchCriteriaIncluded,
    },
    readinessLaw: {
      state: readinessLaw.readinessState,
      successfulLocalDays: readinessLaw.successfulLocalDays,
      thresholds: readinessLaw.thresholds,
      automaticLaunch: readinessLaw.truth.automaticLaunch,
    },
    digitalTwin: {
      profileCount: digitalTwin.summary.profileCount,
      testPersonaOnly: digitalTwin.summary.testPersonaOnly,
      fakeUsersIncluded: digitalTwin.summary.fakeUsersIncluded,
    },
    founderAcceptance: {
      categories: founderAcceptance.categories,
      records: founderAcceptance.records.length,
      storesSecrets: founderAcceptance.truth.storesSecrets,
      fakeAcceptanceRecords: founderAcceptance.truth.fakeAcceptanceRecords,
    },
    report,
    safety: report.truth,
  };
}
