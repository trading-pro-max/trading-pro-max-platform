import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getConstructionQueueSnapshot } from "@/lib/server/codex-construction";
import {
  getLocalDayOneReadinessSnapshot,
  getLocalDailyOperationsLoopSnapshot,
  getLocalDailyOperationsReportSnapshot,
  getLocalOperationsFinalReportSnapshot,
  getLocalOperationsReadinessSnapshot,
} from "@/lib/server/local-ops";
import {
  getProductMemoryDailySummarySnapshot,
  getProductMemorySummarySnapshot,
} from "@/lib/server/product-memory";
import { getProductRealityFinalScoreSnapshot } from "@/lib/server/product-reality";
import { getSovereignAutonomyReadinessSnapshot } from "@/lib/server/sovereign-autonomy";
import { getFounderToolingReadinessSnapshot } from "@/lib/server/integrations";
import { getFounderBuildRoomSnapshot } from "./build-room";
import type { FounderBriefing, MinistryReport } from "@/lib/server/planet-os/types";
import { getFounderCommandReportingSnapshot } from "./reporting";

export type FounderPersonalCompanionSnapshot = {
  checkedAt: string;
  mode: "founder_personal_companion";
  source: "founder_command_reporting";
  planetStatus: FounderBriefing["planetStatus"];
  priorityBriefing: string[];
  riskSummary: string[];
  opportunitySummary: string[];
  ministriesNeedingAttention: string[];
  approvalsSummary: string[];
  guardianSummary: string[];
  legalSummary: string[];
  mediaSummary: string[];
  engineeringSummary: string[];
  productGapSummary: string[];
  visualGapSummary: string[];
  planReadinessSummary: string[];
  userFacingRiskSummary: string[];
  treasurySummary: string[];
  engineeringPrioritySuggestions: string[];
  constructionIntelligenceSummary: string[];
  localOperationsSummary: string[];
  localDayOneSummary: string[];
  productMemorySummary: string[];
  buildRoomSummary: string[];
  sovereignAutonomySummary: string[];
  toolingSummary: string[];
  whatNotToApprove: string[];
  nextSafeDecisions: string[];
  whatNotToDo: string[];
  ministrySignals: Array<{
    ministryId: string;
    ministryName: string;
    status: MinistryReport["status"];
    riskLevel: MinistryReport["riskLevel"];
    nextAction: string;
  }>;
  boundaries: {
    canApproveActionsAlone: false;
    canPublishMedia: false;
    canEnableLiveExecution: false;
    canEnableRealMoney: false;
    canExposeSecrets: false;
    canOverrideCriticalBlocks: false;
    canFakeReadiness: false;
  };
};

export function getFounderPersonalCompanionSnapshot(
  checkedAt = new Date().toISOString()
): FounderPersonalCompanionSnapshot {
  const reporting = getFounderCommandReportingSnapshot(checkedAt);
  const planEntitlements = getPlanEntitlementSnapshot("demo_free", checkedAt);
  const constructionQueue = getConstructionQueueSnapshot(checkedAt);
  const localOps = getLocalOperationsReadinessSnapshot(checkedAt);
  const localDailyLoop = getLocalDailyOperationsLoopSnapshot(checkedAt);
  const localDailyReport = getLocalDailyOperationsReportSnapshot(checkedAt);
  const localDayOne = getLocalDayOneReadinessSnapshot(checkedAt);
  const localFinalReport = getLocalOperationsFinalReportSnapshot(checkedAt);
  const productRealityFinalScore = getProductRealityFinalScoreSnapshot(checkedAt);
  const productMemory = getProductMemorySummarySnapshot(checkedAt);
  const productMemoryDailySummary =
    getProductMemoryDailySummarySnapshot(checkedAt);
  const buildRoom = getFounderBuildRoomSnapshot(checkedAt);
  const tooling = getFounderToolingReadinessSnapshot(checkedAt);
  const sovereignAutonomy = getSovereignAutonomyReadinessSnapshot(checkedAt);
  const decisionMinistries = reporting.ministries.filter(
    (report) => report.founderDecisionNeeded
  );
  const highRiskMinistries = reporting.ministries.filter(
    (report) => report.riskLevel === "high" || report.riskLevel === "critical"
  );
  const blockedOrDegradedMinistries = reporting.ministries.filter(
    (report) => report.status === "blocked" || report.status === "degraded"
  );

  return {
    checkedAt,
    mode: "founder_personal_companion",
    source: "founder_command_reporting",
    planetStatus: reporting.briefing.planetStatus,
    priorityBriefing: [
      `Planet status is ${reporting.briefing.planetStatus}.`,
      `${decisionMinistries.length} ministries need Founder attention.`,
      `${highRiskMinistries.length} ministries carry high or critical risk.`,
      "Live execution, real money, billing, broker/feed, public launch, and social publishing remain blocked or inactive.",
    ],
    riskSummary: reporting.briefing.topRisks,
    opportunitySummary: [
      "Companion, why-blocked, journal/coach, and plan truth can improve user confidence without launch work.",
      "Founder Command can become more actionable through read-only prioritization before approval execution exists.",
      "Plan value and VIP readiness can be clarified without billing or paid activation.",
      "State explanations can reduce confusion while preserving hard safety boundaries.",
      "Visual acceptance can keep public surfaces chart-first while internal Planet OS matures.",
    ],
    ministriesNeedingAttention: [
      ...decisionMinistries.map((report) => report.ministryName),
      ...blockedOrDegradedMinistries.map((report) => report.ministryName),
    ].filter((value, index, list) => list.indexOf(value) === index),
    approvalsSummary: reporting.briefing.approvalsNeeded,
    guardianSummary: reporting.briefing.guardianAlerts,
    legalSummary: reporting.briefing.legalWarnings,
    mediaSummary: reporting.briefing.mediaQueueReadiness,
    engineeringSummary: reporting.briefing.engineeringTasks,
    productGapSummary: reporting.briefing.productGaps,
    visualGapSummary: [
      "Human visual acceptance by Ahmad is still required before any final 10/10 claim.",
      "Chart-first hierarchy must be protected from diagnostics growth.",
      "Owner command native desktop/mobile visual shells remain planned.",
    ],
    planReadinessSummary: planEntitlements.plans.map(
      (plan) => `${plan.planName}: ${plan.truthState}`
    ),
    userFacingRiskSummary: [
      "Users must not see owner command as a plan feature.",
      "Assistant must not produce trading signals, profit claims, or execution instructions.",
      "Plan surfaces must not imply paid access while billing is inactive.",
    ],
    treasurySummary: [
      "Free is active as paper-safe evaluation.",
      "Pro and VIP remain planned/locked.",
      "Billing is inactive and current performance fee remains 0%.",
    ],
    engineeringPrioritySuggestions: [
      "Keep intelligence contracts deterministic and tested.",
      "Prefer compact diagnostics over workstation clutter.",
      "Add UI only where it clarifies product truth.",
    ],
    constructionIntelligenceSummary: [
      `${constructionQueue.summary.total} construction queue drafts are readiness-only.`,
      `${constructionQueue.summary.blocked} blocked construction items remain blocked.`,
      "Codex task drafts must not be sent or executed automatically.",
      "Validation interpretation is required before Founder acceptance.",
    ],
    localOperationsSummary: [
      `Local operations state is ${localOps.report.readinessState}.`,
      `${localOps.dayCycle.totalStages} local day cycle stages are defined.`,
      `${localDailyLoop.summary.totalStages} daily operating loop stages connect acceptance, gaps, Codex drafts, validation, and memory.`,
      `Latest daily report is day ${localDailyReport.dayNumber} with validation ${localDailyReport.validation.status} and Git ${localDailyReport.gitClean}.`,
      `${localOps.digitalTwin.profileCount} local test personas are readiness-only and do not represent real users.`,
      "Founder Local Command shell is read-only and owner-only until owner auth, device trust, and step-up gates exist.",
      localOps.report.launchForbiddenReminder,
    ],
    localDayOneSummary: [
      `Local Day One gate is ${localDayOne.gateStatus}.`,
      `Ready to start local review: ${localDayOne.readyToStartLocalDayOne ? "yes" : "no"}.`,
      `Product reality final score is ${productRealityFinalScore.overallScore}/10 with ${productRealityFinalScore.status}.`,
      `Ahmad human visual review required: ${localDayOne.ahmadHumanReviewRequired ? "yes" : "no"}.`,
      localFinalReport.launchForbiddenReminder,
    ],
    productMemorySummary: [
      `${productMemory.domainSummary.length} memory domains are modeled for safe local/internal readiness.`,
      `${productMemory.founderSummary.openProductGaps.length} open product gaps are visible for review.`,
      `Daily memory summary tracks ${productMemoryDailySummary.productGaps.open} open gaps, ${productMemoryDailySummary.validation.commands} validation commands, and the suggested next task: ${productMemoryDailySummary.suggestedNextTask.title}.`,
      productMemory.founderSummary.journalCoachReadiness,
      "Memory forbids secrets, raw private sensitive data, fake users, fake revenue, and fake metrics.",
    ],
    buildRoomSummary: [
      `Build Room is ${buildRoom.readinessStatus}.`,
      `${buildRoom.codexTaskDrafts.length} Codex-ready draft candidates are available for manual Ahmad review.`,
      `${buildRoom.topProductGaps.length} product gaps and ${buildRoom.topVisualGaps.length} visual gaps are highlighted.`,
      "No automatic external Codex sending, approval execution, launch, billing, broker/feed, live execution, real money, or social publishing is active.",
    ],
    sovereignAutonomySummary: [
      `Sovereign Autonomy is ${sovereignAutonomy.mode} in ${sovereignAutonomy.operatingMode}.`,
      `${sovereignAutonomy.sampleFounderIdeas.length} sample Founder ideas become ${sovereignAutonomy.sampleEvents.length} classified events.`,
      `${sovereignAutonomy.taskPassports.filter((passport) => passport.valid).length} Task Passports and ${sovereignAutonomy.codexSubmitReadiness.drafts.length} Codex-ready drafts are available for review.`,
      `Result Tribunal sample decision is ${sovereignAutonomy.tribunalReports[0]?.decision ?? "needs_fix"}.`,
      "The web app cannot execute shell commands, call Codex directly, send secrets, publish, launch, bill, trade live, or route real money.",
    ],
    toolingSummary: [
      `Essential tooling hub is ${tooling.status}.`,
      `${tooling.essentialIntegrations.p0_local_required.count} P0 local tools and ${tooling.essentialIntegrations.p1_soon.count} P1 readiness items are classified.`,
      "Codex and GitHub are governed as manual, external workflows; the product only drafts tasks and records safe summaries.",
      `${tooling.localRuntime.commands.length} local runtime commands are documented for terminal use only; the web app cannot execute shell commands.`,
      `Blocked now: ${tooling.whatNotToConnectNow.join(", ")}.`,
    ],
    whatNotToApprove: [
      "live execution activation",
      "real-money routing",
      "billing activation",
      "broker/feed activation",
      "social publishing",
      "public launch claims",
      "fake Pro/VIP claims",
      "fake Islamic/Sharia certification",
    ],
    nextSafeDecisions: reporting.briefing.nextSafeActions,
    whatNotToDo: reporting.briefing.whatNotToDoToday,
    ministrySignals: reporting.ministries.map((report) => ({
      ministryId: report.ministryId,
      ministryName: report.ministryName,
      status: report.status,
      riskLevel: report.riskLevel,
      nextAction:
        report.nextActions[0] ?? "Keep readiness truth visible and reviewed.",
    })),
    boundaries: {
      canApproveActionsAlone: false,
      canPublishMedia: false,
      canEnableLiveExecution: false,
      canEnableRealMoney: false,
      canExposeSecrets: false,
      canOverrideCriticalBlocks: false,
      canFakeReadiness: false,
    },
  };
}
