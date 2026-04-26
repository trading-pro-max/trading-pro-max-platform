import "server-only";

import { getCodexAutoSubmitGovernance } from "./auto-submit";
import {
  allowedCodexWorkerLevelsNow,
  codexBlockedCategories,
  getCodexTaskConstitution,
} from "./constitution";
import { codexJurisdictions } from "./jurisdiction";
import { getCodexMemoryLessons } from "./memory-lessons";
import {
  codexSampleConstructionRequests,
  getCodexTaskParliamentDecisions,
} from "./parliament";
import {
  buildCodexTaskPassport,
  createCodexInvalidPassportSamples,
} from "./passport";
import { decideCodexExecutionPermit } from "./permit";
import { compileCodexTaskPrompt } from "./prompt-compiler";
import { getCodexResultTribunalSamples } from "./result-tribunal";
import type {
  CodexGovernanceSnapshot,
  CodexPresidencyReport,
} from "./types";

export function getCodexSovereigntySnapshot(
  checkedAt = new Date().toISOString()
): CodexGovernanceSnapshot {
  const constitution = getCodexTaskConstitution(checkedAt);
  const parliamentDecisions = getCodexTaskParliamentDecisions();
  const builtPassports = codexSampleConstructionRequests.map((request) =>
    buildCodexTaskPassport(request, checkedAt)
  );
  const taskPassports = [
    ...builtPassports,
    ...createCodexInvalidPassportSamples(builtPassports),
  ];
  const executionPermits = taskPassports.map(decideCodexExecutionPermit);
  const compiledPrompts = taskPassports
    .filter((passport) => passport.valid)
    .map((passport) => {
      const permit = executionPermits.find((entry) => entry.taskId === passport.taskId);

      return permit && permit.decision !== "permit_blocked"
        ? compileCodexTaskPrompt(passport, permit)
        : null;
    })
    .filter((prompt): prompt is NonNullable<typeof prompt> => Boolean(prompt));
  const autoSubmitGovernance = getCodexAutoSubmitGovernance(
    taskPassports,
    executionPermits,
    compiledPrompts,
    checkedAt
  );
  const resultTribunal = getCodexResultTribunalSamples(taskPassports);
  const memoryLessons = getCodexMemoryLessons();

  return {
    checkedAt,
    mode: "codex_sovereign_construction_state",
    status: "ready",
    constitutionReady: true,
    parliamentReady: parliamentDecisions.length > 0,
    jurisdictionReady: codexJurisdictions.length > 0,
    passportReady: taskPassports.some((passport) => passport.valid),
    permitReady: executionPermits.length > 0,
    promptCompilerReady: compiledPrompts.length > 0,
    autoSubmitReady: true,
    tribunalReady: resultTribunal.length > 0,
    memoryLessonsReady: memoryLessons.length > 0,
    constitution,
    sampleRequests: codexSampleConstructionRequests,
    parliamentDecisions,
    jurisdictions: codexJurisdictions,
    taskPassports,
    executionPermits,
    compiledPrompts,
    autoSubmitGovernance,
    resultTribunal,
    memoryLessons,
    blockedCategories: codexBlockedCategories,
    currentWorkerLevels: allowedCodexWorkerLevelsNow,
    allowedCurrentAutomationLevels: ["level_3_0", "level_3_1_readiness_only"],
    nextSafeActions: [
      "Use Founder Command to review blocked and Founder-approval-required tasks.",
      "Generate Codex-ready prompts only from valid task passports.",
      "Keep Level 3.1 as submission readiness only until an approved external runner exists.",
      "Run Result Tribunal checks before recording accepted lessons.",
    ],
    whatNotToAutomate: [
      "web app shell execution",
      "direct Codex calls",
      "secrets transfer",
      "billing activation",
      "broker/feed activation",
      "live execution",
      "real money routing",
      "social publishing",
      "public launch",
      "auth/security weakening",
      "Founder Command public exposure",
    ],
    truth: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      socialPublishingInactive: true,
      productionSecretsUntouched: true,
      authSecurityPreserved: true,
      noUncontrolledAutomation: true,
      noShellExecutionFromWebApp: true,
      noSecretsSentToCodex: true,
    },
  };
}

export function getCodexPresidencyReport(
  checkedAt = new Date().toISOString()
): CodexPresidencyReport {
  const snapshot = getCodexSovereigntySnapshot(checkedAt);

  return {
    checkedAt,
    mode: "codex_sovereign_presidency_report",
    readiness: "ready",
    constitutionStatus: snapshot.constitution.status,
    taskPassportsReady: snapshot.taskPassports.filter((passport) => passport.valid)
      .length,
    permits: snapshot.executionPermits.map((permit) => permit.decision),
    blockedTaskCategories: snapshot.blockedCategories,
    level3Status: {
      level30DraftOnly: true,
      level31ReadinessOnly: true,
      webAppExecution: false,
    },
    resultTribunalStatus: snapshot.resultTribunal.map((decision) => decision.decision),
    lessonsLearned: snapshot.memoryLessons.map((lesson) => lesson.futureRule),
    tasksWaitingFounderApproval: snapshot.executionPermits
      .filter((permit) => permit.decision === "permit_founder_review")
      .map((permit) => permit.taskId),
    autoSubmitEligibleCategories:
      snapshot.autoSubmitGovernance.eligibleLowRiskCategories,
    whatNotToAutomate: snapshot.whatNotToAutomate,
    truth: snapshot.truth,
  };
}

export function getCodexSovereigntyPublicSafeReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getCodexSovereigntySnapshot(checkedAt);

  return {
    checkedAt,
    key: "construction_governance",
    label: "Construction governance readiness",
    status: "ready" as const,
    summary:
      "Internal build review, scoped permissions, validation, and lessons are ready",
    detail:
      `${snapshot.taskPassports.filter((passport) => passport.valid).length} internal build packets are modeled. Public screens stay simple; shell execution, external calls, secrets, launch, billing, broker/feed, live execution, real money, and publishing remain inactive.`,
  };
}
