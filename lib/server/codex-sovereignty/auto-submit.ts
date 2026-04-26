import "server-only";

import { autoSubmitEligibleLowRiskCategories } from "./permit";
import type {
  CodexAutoSubmitGovernance,
  CodexCompiledPrompt,
  CodexExecutionPermit,
  CodexSubmitReadinessItem,
  CodexTaskPassport,
} from "./types";

function readinessForTask(
  passport: CodexTaskPassport,
  permit: CodexExecutionPermit,
  prompt: CodexCompiledPrompt | undefined
): CodexSubmitReadinessItem {
  if (permit.decision === "permit_blocked" || !passport.valid) {
    return {
      taskId: passport.taskId,
      status: "blocked",
      supportedModes: ["manual_only"],
      defaultMode: "manual_only",
      readinessLevel: "future_only",
      reason: permit.blockedReason ?? "Task is blocked by permit.",
      externalRunnerRequired: true,
      webAppCanExecuteShell: false,
      webAppCanCallCodex: false,
    };
  }

  if (permit.decision === "permit_founder_review") {
    return {
      taskId: passport.taskId,
      status: "waiting_founder",
      supportedModes: ["manual_only", "cli_exec_ready", "cloud_exec_ready", "github_comment_ready"],
      defaultMode: "manual_only",
      readinessLevel: "level_3_0",
      reason: "Founder/review approval is required before any external submission.",
      externalRunnerRequired: true,
      webAppCanExecuteShell: false,
      webAppCanCallCodex: false,
    };
  }

  if (
    permit.autoSubmitAllowed &&
    autoSubmitEligibleLowRiskCategories.includes(passport.category) &&
    prompt
  ) {
    return {
      taskId: passport.taskId,
      status: "eligible_low_risk",
      supportedModes: ["manual_only", "cli_exec_ready", "cloud_exec_ready", "github_comment_ready"],
      defaultMode: "manual_only",
      readinessLevel: "level_3_1_readiness_only",
      reason:
        "Low-risk docs/tests task is ready as Level 3.1 submission readiness only; an approved external runner is still required.",
      externalRunnerRequired: true,
      webAppCanExecuteShell: false,
      webAppCanCallCodex: false,
    };
  }

  return {
    taskId: passport.taskId,
    status: "draft_ready",
    supportedModes: ["manual_only", "cli_exec_ready", "cloud_exec_ready", "github_comment_ready"],
    defaultMode: "manual_only",
    readinessLevel: "level_3_0",
    reason:
      "Codex-ready draft exists for manual Founder/review handling only.",
    externalRunnerRequired: true,
    webAppCanExecuteShell: false,
    webAppCanCallCodex: false,
  };
}

export function getCodexAutoSubmitGovernance(
  passports: CodexTaskPassport[],
  permits: CodexExecutionPermit[],
  prompts: CodexCompiledPrompt[],
  checkedAt = new Date().toISOString()
): CodexAutoSubmitGovernance {
  const permitByTask = new Map(permits.map((permit) => [permit.taskId, permit]));
  const promptByTask = new Map(prompts.map((prompt) => [prompt.taskId, prompt]));
  const items = passports.map((passport) =>
    readinessForTask(
      passport,
      permitByTask.get(passport.taskId) ?? {
        permitId: `permit_missing_${passport.taskId}`,
        taskId: passport.taskId,
        decision: "permit_denied",
        reason: "Permit missing.",
        safeNextAction: "Regenerate the permit before drafting.",
        requiredReviews: passport.requiredReviews,
        blockedReason: "Permit missing.",
        autoSubmitAllowed: false,
        maxWorkerLevel: "restricted",
      },
      promptByTask.get(passport.taskId)
    )
  );

  return {
    checkedAt,
    supportedModes: ["manual_only", "cli_exec_ready", "cloud_exec_ready", "github_comment_ready"],
    defaultMode: "manual_only",
    allowedCurrentLevels: ["level_3_0", "level_3_1_readiness_only"],
    futureOnlyLevels: ["level_3_2_tiny_copy_after_review", "level_3_3_future", "level_4_future_low_risk_auto_fix", "level_5_forbidden"],
    items,
    eligibleLowRiskCategories: autoSubmitEligibleLowRiskCategories,
    truth: {
      webAppShellExecution: false,
      callsCodexDirectly: false,
      externalSubmissionActive: false,
      externalRunnerApproved: false,
      sendsSecretsToCodex: false,
    },
  };
}
