import "server-only";

import type { CodexLicense, CodexWorkerLevel, TaskPassport } from "./types";

export const codexWorkerLevels: CodexWorkerLevel[] = [
  "observer",
  "drafter",
  "builder_low",
  "builder_medium_review_required",
  "restricted",
];

export const allowedCodexWorkerLevelsNow: CodexWorkerLevel[] = [
  "observer",
  "drafter",
  "builder_low",
];

export function issueCodexLicense(
  passport: TaskPassport,
  checkedAt = new Date().toISOString()
): CodexLicense {
  const lowBuilderAllowed =
    passport.workerLevel === "builder_low" &&
    passport.riskLevel === "low" &&
    passport.valid &&
    passport.allowedFiles.every(
      (file) =>
        file.startsWith("docs/") ||
        file.startsWith("tests/") ||
        file.includes("sovereign-autonomy")
    );

  const permitted =
    passport.valid &&
    (passport.workerLevel === "observer" ||
      passport.workerLevel === "drafter" ||
      lowBuilderAllowed);

  const permitState: CodexLicense["permitState"] = !passport.valid
    ? "blocked"
    : passport.workerLevel === "observer"
    ? "observer_permitted"
    : passport.workerLevel === "drafter"
    ? "drafter_permitted"
    : lowBuilderAllowed
    ? "builder_low_permitted"
    : passport.workerLevel === "builder_medium_review_required"
    ? "review_required"
    : "restricted";

  return {
    licenseId: `license_${passport.taskId}_${checkedAt.replace(/\D/g, "").slice(0, 14)}`,
    taskId: passport.taskId,
    workerLevel: passport.workerLevel,
    permitted,
    permitState,
    allowedActions: permitted
      ? [
          "inspect code",
          "draft precise changes",
          "edit only allowed files when worker level permits",
          "run validation commands from terminal",
          "prepare final report",
        ]
      : ["observe blocked state", "draft safe alternative"],
    blockedActions: [
      "web app shell execution",
      "direct Codex execution from the app",
      "production secret access",
      "live execution",
      "real money",
      "billing activation",
      "broker/feed activation",
      "social publishing",
      "public launch",
      "unreviewed public/internal boundary changes",
    ],
    expiresWhen: "task_closed_or_scope_changes",
    noSecrets: true,
    noWebAppExecution: true,
  };
}
