import "server-only";

import type { LocalReadinessState, LocalReadinessThreshold } from "./types";

export const localReadinessThresholds: LocalReadinessThreshold[] = [
  {
    successfulLocalDays: 1,
    state: "local_day_passed",
    meaning: "Initial local operation proof only.",
    automaticLaunch: false,
    founderApprovalRequired: true,
  },
  {
    successfulLocalDays: 3,
    state: "internal_beta_candidate",
    meaning: "Eligible for small internal beta planning discussion only.",
    automaticLaunch: false,
    founderApprovalRequired: true,
  },
  {
    successfulLocalDays: 7,
    state: "staging_discussion_candidate",
    meaning: "Eligible for staging preparation discussion only.",
    automaticLaunch: false,
    founderApprovalRequired: true,
  },
  {
    successfulLocalDays: 14,
    state: "launch_readiness_discussion_candidate",
    meaning: "Eligible for launch-readiness discussion only; no launch is automatic.",
    automaticLaunch: false,
    founderApprovalRequired: true,
  },
];

export function evaluateLocalReadinessState(
  successfulLocalDays: number,
  blocked = false
): LocalReadinessState {
  if (blocked) return "blocked";
  if (successfulLocalDays <= 0) return "not_started";
  if (successfulLocalDays === 1) return "local_day_passed";
  if (successfulLocalDays < 3) return "repeated_local_days";
  if (successfulLocalDays < 7) return "internal_beta_candidate";
  if (successfulLocalDays < 14) return "staging_discussion_candidate";
  return "launch_readiness_discussion_candidate";
}

export function getLocalReadinessLawSnapshot(
  checkedAt = new Date().toISOString(),
  successfulLocalDays = 0
) {
  const readinessState = evaluateLocalReadinessState(successfulLocalDays);

  return {
    checkedAt,
    mode: "local_readiness_law" as const,
    successfulLocalDays,
    readinessState,
    thresholds: localReadinessThresholds,
    states: [
      "not_started",
      "day_one_candidate",
      "local_day_passed",
      "repeated_local_days",
      "internal_beta_candidate",
      "staging_discussion_candidate",
      "launch_readiness_discussion_candidate",
      "blocked",
    ] as LocalReadinessState[],
    law: [
      "One successful local day proves initial local operation only.",
      "Three successful local days allow internal beta planning discussion only.",
      "Seven successful local days allow staging preparation discussion only.",
      "Fourteen successful local days allow launch-readiness discussion only.",
      "No threshold automatically launches the product.",
      "Founder approval, Legal review, Guardian review, and Product Truth still apply.",
    ],
    truth: {
      automaticLaunch: false,
      founderApprovalAlwaysRequired: true,
      legalGuardianProductTruthGatesRequired: true,
      launchActionIncluded: false,
      productionActionIncluded: false,
    },
  };
}
