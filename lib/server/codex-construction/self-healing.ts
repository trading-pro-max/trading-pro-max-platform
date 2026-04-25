import "server-only";

import { getValidationInterpreterReadinessSnapshot } from "./validation-interpreter";

export function getSelfHealingPipelineSnapshot(
  checkedAt = new Date().toISOString()
) {
  return {
    checkedAt,
    mode: "self_healing_pipeline_readiness" as const,
    pipeline: [
      "detect",
      "classify",
      "safe cleanup task",
      "Codex repair draft",
      "validation plan",
      "result interpretation",
      "Founder report",
    ],
    supportedFailures: [
      "lint_failed",
      "typecheck_failed",
      "build_failed",
      "regression_failed",
      "smoke_failed",
      "dirty_repo",
      "screenshot_missing",
      "public_language_leak",
      "product_truth_violation",
    ],
    interpreter: getValidationInterpreterReadinessSnapshot(checkedAt).samples,
    truth: {
      automaticRepairExecution: "not_enabled" as const,
      lowRiskDocsAutoFix: "future_only" as const,
      dangerousActionsBlocked: true,
    },
  };
}
