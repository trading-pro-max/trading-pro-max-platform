import "server-only";

import type { AutomationGovernorSnapshot, AutomationLevel } from "./types";

export const allowedAutomationLevels: AutomationLevel[] = [
  "level_1_detect",
  "level_2_draft",
  "level_3_0_codex_ready_task_draft_only",
  "level_3_1_docs_tests_submission_readiness_only",
];

export const disabledAutomationLevels: AutomationLevel[] = [
  "level_0_blocked",
  "level_4_future_low_risk_auto_fix_disabled",
  "level_5_forbidden_uncontrolled_autopilot",
];

export function isAutomationLevelAllowed(level: AutomationLevel): boolean {
  return allowedAutomationLevels.includes(level);
}

export function getAutomationGovernorSnapshot(): AutomationGovernorSnapshot {
  return {
    status: "ready",
    allowedLevels: allowedAutomationLevels,
    disabledLevels: disabledAutomationLevels,
    currentMaximumLevel: "level_3_1_docs_tests_submission_readiness_only",
    currentAllowed: [
      {
        level: "level_1_detect",
        allowed: true,
        boundary:
          "May detect gaps, risks, missing dependencies, and repeated issues.",
      },
      {
        level: "level_2_draft",
        allowed: true,
        boundary:
          "May draft proposals, readiness notes, and validation checklists.",
      },
      {
        level: "level_3_0_codex_ready_task_draft_only",
        allowed: true,
        boundary:
          "May create Codex-ready task drafts only; no direct Codex calls or shell execution.",
      },
      {
        level: "level_3_1_docs_tests_submission_readiness_only",
        allowed: true,
        boundary:
          "May prepare low-risk docs/tests submission readiness for Founder review.",
      },
      {
        level: "level_4_future_low_risk_auto_fix_disabled",
        allowed: false,
        boundary:
          "Future low-risk auto-fix remains disabled in this local product.",
      },
      {
        level: "level_5_forbidden_uncontrolled_autopilot",
        allowed: false,
        boundary:
          "Uncontrolled autopilot is forbidden and cannot bypass Founder authority.",
      },
    ],
    requiresFounderApproval: [
      "visual identity change",
      "chart rebuild",
      "assistant behavior change",
      "shell architecture change",
      "public plan wording",
      "VIP or Institutional claims",
      "launch readiness escalation",
      "security/auth/secrets work",
    ],
    blockedActions: [
      "shell execution from the web app",
      "direct Codex execution from the web app",
      "production secret handling",
      "real-world activation",
      "public launch activation",
      "billing activation",
      "broker/feed activation",
      "live execution",
      "real-money routing",
      "social publishing",
      "fake users, revenue, metrics, certification, or plan activation",
    ],
    truth: {
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noSecrets: true,
      noRealWorldActivation: true,
      noPublicLaunch: true,
      noBillingLiveBrokerSocial: true,
      level4DisabledNow: true,
      level5Forbidden: true,
    },
  };
}
