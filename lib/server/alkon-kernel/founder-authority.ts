import type { FounderFinalAuthority } from "./types";

const sensitiveDecisions = [
  "visual acceptance",
  "identity/logo",
  "launch",
  "billing",
  "money",
  "legal direction",
  "security risk",
  "public claims",
  "future worlds",
  "deletion of protected systems",
  "Local Day One start",
];

export function getFounderFinalAuthority(action = "sensitive_action"): FounderFinalAuthority {
  const sensitive = sensitiveDecisions.some((decision) =>
    action.toLowerCase().includes(decision.toLowerCase())
  );

  return {
    founderDecisionRequired: sensitive || action === "sensitive_action",
    reason:
      sensitive || action === "sensitive_action"
        ? "Ahmad is final authority for sensitive, visual, public, legal, money, and Local Day One decisions."
        : "Routine documentation, deterministic tests, and safe reports may proceed under existing command scope.",
    allowedWithoutFounder: [
      "read-only audits",
      "deterministic tests",
      "docs updates within an active command",
      "public-safe Product Truth summaries",
      "private readiness snapshots",
    ],
    blockedUntilFounder: sensitiveDecisions,
  };
}
