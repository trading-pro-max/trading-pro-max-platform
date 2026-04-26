import "server-only";

import { issueCodexLicense } from "./codex-license";
import { getCodexSubmitReadiness } from "./codex-submit-readiness";
import { getFounderIdeaIntakeSamples } from "./founder-idea-intake";
import { getMemoryLawSamples } from "./memory-law";
import { routeSovereignEvent } from "./owner-router";
import {
  allowedAutonomyLevelsNow,
  blockedAutonomyLevelsNow,
  evaluateSovereignPolicyGates,
} from "./policy-gates";
import { getResultTribunalSamples } from "./result-tribunal";
import { buildTaskPassport, validateTaskPassport } from "./task-passport";
import type {
  SovereignAutonomyReadinessSnapshot,
  TaskPassport,
} from "./types";

export const sovereignCoreLoop = [
  "Observe",
  "Understand",
  "Classify",
  "Route",
  "Decide",
  "Draft",
  "Permit",
  "Execute externally if allowed",
  "Validate",
  "Judge",
  "Learn",
  "Report",
];

export const sovereignBlockedSystems = [
  "live execution",
  "real money",
  "billing activation",
  "broker/feed activation",
  "production secrets",
  "social publishing",
  "public launch",
  "fake users/revenue/metrics",
  "fake Pro/VIP/Institutional activation",
  "fake Swiss legal/company status",
  "fake Islamic/Sharia certification",
  "web app shell execution",
  "direct Codex execution from web app",
];

function createInvalidPassportSamples(passports: TaskPassport[]) {
  const base = passports.find((passport) => passport.valid) ?? passports[0];
  if (!base) return [];

  const missingValidation: TaskPassport = {
    ...base,
    taskId: `${base.taskId}_missing_validation`,
    validationCommands: [],
  };
  const missingValidationResult = validateTaskPassport(missingValidation);

  const secretLike: TaskPassport = {
    ...base,
    taskId: `${base.taskId}_secret_rejected`,
    reason: "secret_present_marker should never appear in a valid passport",
  };
  const secretLikeResult = validateTaskPassport(secretLike);

  return [
    {
      ...missingValidation,
      valid: missingValidationResult.valid,
      invalidReasons: missingValidationResult.invalidReasons,
    },
    {
      ...secretLike,
      valid: secretLikeResult.valid,
      invalidReasons: secretLikeResult.invalidReasons,
    },
  ];
}

export function getSovereignAutonomyReadinessSnapshot(
  checkedAt = new Date().toISOString()
): SovereignAutonomyReadinessSnapshot {
  const intakeResults = getFounderIdeaIntakeSamples(checkedAt);
  const sampleFounderIdeas = intakeResults.map((result) => result.idea);
  const sampleEvents = intakeResults.map((result) => result.event);
  const ownerRoutes = sampleEvents.map(routeSovereignEvent);
  const policyEvaluations = sampleEvents.map((event) =>
    evaluateSovereignPolicyGates(event, checkedAt)
  );
  const builtPassports = sampleEvents.map((event) =>
    buildTaskPassport(event, checkedAt)
  );
  const taskPassports = [
    ...builtPassports,
    ...createInvalidPassportSamples(builtPassports),
  ];
  const codexLicenses = taskPassports.map((passport) =>
    issueCodexLicense(passport, checkedAt)
  );
  const codexSubmitReadiness = getCodexSubmitReadiness(taskPassports, checkedAt);
  const tribunalReports = getResultTribunalSamples(taskPassports, checkedAt);
  const memoryLessons = getMemoryLawSamples(
    sampleEvents,
    tribunalReports,
    checkedAt
  );

  return {
    checkedAt,
    mode: "sovereign_autonomy_operating_civilization",
    operatingMode: "local_readiness_only",
    autonomyLevelsAllowedNow: allowedAutonomyLevelsNow,
    autonomyLevelsBlockedNow: blockedAutonomyLevelsNow,
    coreLoop: sovereignCoreLoop,
    ideaIntakeReady: true,
    eventSystemReady: true,
    codexDraftingReady: true,
    founderCommandReady: true,
    blockedSystems: sovereignBlockedSystems,
    nextSafeActions: [
      "Use Founder Command to review incoming ideas and blocked events.",
      "Generate Task Passports and Codex-ready drafts only after policy gates.",
      "Keep all sensitive activation requests blocked as readiness records.",
      "Run validation and Result Tribunal checks before accepting work into Product Memory.",
    ],
    sampleFounderIdeas,
    sampleEvents,
    ownerRoutes,
    policyEvaluations,
    taskPassports,
    codexLicenses,
    codexSubmitReadiness,
    tribunalReports,
    memoryLessons,
    truth: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      socialPublishingInactive: true,
      productionSecretsUntouched: true,
      noUncontrolledAutomation: true,
      noShellExecutionFromWebApp: true,
      noSecretsSentToCodex: true,
      publicInternalTerminologyLeakAllowed: false,
    },
  };
}

export function getSovereignAutonomyPublicSafeReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getSovereignAutonomyReadinessSnapshot(checkedAt);

  return {
    checkedAt,
    key: "operating_readiness",
    label: "System operating readiness",
    status: "ready" as const,
    summary:
      "Local review, safety checks, build drafting, validation, and learning are ready",
    detail:
      `${snapshot.sampleEvents.length} internal review events are modeled. Public surfaces remain simple; live execution, real money, broker/feed, billing, launch, social publishing, shell execution, and secret transfer remain inactive.`,
  };
}
