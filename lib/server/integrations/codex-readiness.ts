import "server-only";

import type { CodexReadinessSnapshot } from "./types";

export function getCodexReadinessSnapshot(
  checkedAt = new Date().toISOString()
): CodexReadinessSnapshot {
  return {
    checkedAt,
    mode: "codex_operating_model_readiness",
    localCodexCli: "configured_by_user_environment",
    codexCloud: "external_setup_planned",
    githubReviewViaCodex: "optional_future_workflow",
    agentsGuidelines: "recommended_future_hardening",
    productCanDraftPrompts: true,
    productCanSendPromptsAutomatically: false,
    productCanExecuteCodex: false,
    productCanExposeSecretsToCodex: false,
    productCanRequestBlockedActivation: false,
    safeWorkflow: [
      "Observe local product state.",
      "Classify gaps and risk.",
      "Draft Codex-ready task text.",
      "Wait for Ahmad manual approval.",
      "Codex executes separately outside the product.",
      "Validation result is recorded as a safe summary.",
      "Product memory updates without secrets.",
    ],
    forbiddenScope: [
      "production secrets",
      "live execution activation",
      "real-money routing",
      "broker/feed activation",
      "billing activation",
      "social publishing",
      "public launch claims",
      "uncontrolled automation",
    ],
  };
}
