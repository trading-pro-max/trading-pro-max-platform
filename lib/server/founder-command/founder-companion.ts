import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
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
