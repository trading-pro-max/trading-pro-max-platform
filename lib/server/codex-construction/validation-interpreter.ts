import "server-only";

import type { ValidationInterpretation } from "./types";

export function interpretValidationReport(
  report: {
    text: string;
    changedFiles?: string[];
    commitHash?: string | null;
    pushed?: boolean;
    clean?: boolean;
  },
  checkedAt = new Date().toISOString()
): ValidationInterpretation {
  const text = report.text.toLowerCase();
  const blockers: string[] = [];
  const commandsRun = [
    "npx tsc --noEmit",
    "npx eslint app modules tests --max-warnings=0",
    "npm run build",
    "npm run prisma:validate",
    "npm run test:regression",
    "npm run smoke:routes",
    "git diff --check",
  ].filter((command) => text.includes(command.toLowerCase()));

  if (text.includes("dirty repo") || report.clean === false) blockers.push("dirty_repo");
  if (text.includes("eslint") && text.includes("fail")) blockers.push("lint_failed");
  if (text.includes("build") && text.includes("fail")) blockers.push("build_failed");
  if (text.includes("test") && text.includes("fail")) blockers.push("tests_failed");
  if (text.includes("smoke") && text.includes("fail")) blockers.push("smoke_failed");
  if (text.includes("screenshot missing")) blockers.push("screenshot_missing");
  if (text.includes("secret")) blockers.push("secrets_risk");
  if (text.includes("live execution enabled") || text.includes("billing active")) {
    blockers.push("fake_activation_risk");
  }
  if (text.includes("founder command visible") || text.includes("enterprise visible")) {
    blockers.push("public_language_leak");
  }

  const status: ValidationInterpretation["status"] =
    blockers.includes("secrets_risk") || blockers.includes("fake_activation_risk")
      ? "failed"
      : blockers.includes("lint_failed")
      ? "lint_failed"
      : blockers.includes("build_failed")
      ? "build_failed"
      : blockers.includes("tests_failed")
      ? "tests_failed"
      : blockers.includes("screenshot_missing")
      ? "screenshot_missing"
      : blockers.includes("dirty_repo")
      ? "dirty_repo"
      : blockers.length > 0
      ? "partial"
      : text.includes("pass")
      ? "ready_to_accept"
      : "partial";

  return {
    checkedAt,
    status,
    commandsRun,
    changedFiles: report.changedFiles ?? [],
    commitHash: report.commitHash ?? null,
    pushed: report.pushed ?? false,
    clean: report.clean ?? blockers.length === 0,
    blockers,
    recommendedNextAction:
      blockers.length > 0
        ? "Draft a focused cleanup task and rerun validation; do not accept as complete."
        : "Ready for Founder/human acceptance review; do not claim launch readiness.",
  };
}

export function getValidationInterpreterReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  return {
    checkedAt,
    mode: "validation_interpreter_readiness" as const,
    samples: {
      passed: interpretValidationReport(
        {
          text: "PASS npx tsc --noEmit npm run build npm run test:regression npm run smoke:routes",
          changedFiles: ["app/theme-localization.css"],
          commitHash: "example",
          pushed: true,
          clean: true,
        },
        checkedAt
      ),
      failed: interpretValidationReport(
        {
          text: "eslint fail and screenshot missing",
          changedFiles: ["modules/example.tsx"],
          pushed: false,
          clean: false,
        },
        checkedAt
      ),
      productTruthViolation: interpretValidationReport(
        {
          text: "live execution enabled and billing active",
          changedFiles: ["lib/server/product/truth.ts"],
          pushed: false,
          clean: false,
        },
        checkedAt
      ),
    },
    truth: {
      falsePassAllowed: false,
      fakeValidationAllowed: false,
      humanVisualAcceptanceRequired: true,
    },
  };
}
