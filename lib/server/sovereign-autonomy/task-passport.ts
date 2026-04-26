import "server-only";

import { sovereignForbiddenScope } from "./event-state";
import { evaluateSovereignPolicyGates } from "./policy-gates";
import type {
  CodexWorkerLevel,
  SovereignEvent,
  TaskPassport,
} from "./types";

export const sovereignValidationCommands = [
  "npx tsc --noEmit",
  "npx eslint app modules tests --max-warnings=0",
  "npm run build",
  "npm run prisma:validate",
  "npm run test:regression",
  "npm run smoke:routes",
  "git diff --check",
  "git status --short",
];

const forbiddenFiles = [
  ".env",
  ".env.local",
  ".env.production.local",
  ".env.production",
  "prisma/dev.db",
  "lib/db/generated",
  ".next",
  "node_modules",
];

function workerLevelForEvent(event: SovereignEvent): CodexWorkerLevel {
  if (event.status === "blocked" || event.riskLevel === "critical") return "restricted";
  if (
    event.type === "safe_docs_update_needed" ||
    event.type === "safe_test_update_needed" ||
    event.type === "safe_copy_cleanup_needed"
  ) {
    return "builder_low";
  }
  if (event.riskLevel === "medium" || event.riskLevel === "high") return "drafter";
  return "drafter";
}

function allowedFilesForEvent(event: SovereignEvent) {
  if (event.affectedFiles.length) return event.affectedFiles;

  if (event.type === "safe_docs_update_needed") return ["docs/product", "docs/security"];
  if (event.type === "safe_test_update_needed") return ["tests/regression"];
  if (event.type === "chart_quality_low") {
    return ["modules/shell/components/TradingWorkstation.tsx", "modules/chart"];
  }
  if (event.type === "logo_rejection_detected") {
    return ["modules/brand/components", "public/brand"];
  }

  return ["lib/server/sovereign-autonomy", "docs/product", "tests/regression"];
}

export function validateTaskPassport(passport: TaskPassport) {
  const invalidReasons: string[] = [];

  if (passport.validationCommands.length === 0) {
    invalidReasons.push("validation commands are required");
  }

  if (passport.forbiddenScope.length === 0) {
    invalidReasons.push("forbidden scope is required");
  }

  if (passport.productTruthRequirements.length === 0) {
    invalidReasons.push("Product Truth requirements are required");
  }

  const serialized = JSON.stringify(passport);
  if (
    /(api[_-]?key|secret_value|password|token)\s*[:=]/i.test(serialized) ||
    serialized.includes("secret_present_marker")
  ) {
    invalidReasons.push("passport appears to contain secret material");
  }

  if (passport.riskLevel === "critical" || passport.workerLevel === "restricted") {
    invalidReasons.push("critical blocked category cannot receive a valid passport");
  }

  if (
    passport.affectedWorld === "public_user_world" &&
    passport.forbiddenSurfaces.length === 0
  ) {
    invalidReasons.push("public/private boundary is unclear");
  }

  return {
    valid: invalidReasons.length === 0,
    invalidReasons,
  };
}

export function buildTaskPassport(
  event: SovereignEvent,
  checkedAt = new Date().toISOString()
): TaskPassport {
  const policy = evaluateSovereignPolicyGates(event, checkedAt);
  const founderApprovalRequired =
    policy.overallDecision === "founder_approval_required" ||
    event.requiredReviews.includes("founder");

  const draft: TaskPassport = {
    taskId: `task_${event.type}_${checkedAt.replace(/\D/g, "").slice(0, 14)}`,
    eventId: event.eventId,
    title: event.title,
    mission: "Convert a governed Sovereign Autonomy event into a safe local construction task.",
    reason: event.suggestedNextAction,
    category: event.type,
    riskLevel: event.riskLevel,
    affectedWorld: event.affectedWorld,
    affectedSurface: event.affectedSurface,
    ownerArea: event.suggestedOwner,
    workerLevel: workerLevelForEvent(event),
    allowedFiles: allowedFilesForEvent(event),
    forbiddenFiles,
    allowedSurfaces: [event.affectedSurface],
    forbiddenSurfaces:
      event.affectedWorld === "public_user_world"
        ? [
            "Founder Command",
            "private governance",
            "secrets authority",
            "construction queue",
            "Codex draft surface",
          ]
        : ["public navigation", "public Home", "normal user Settings"],
    requiredReviews: event.requiredReviews,
    founderApprovalRequired,
    productTruthRequirements: [
      "live execution remains blocked",
      "real money remains blocked",
      "broker/feed activation remains blocked",
      "billing remains inactive",
      "public launch remains inactive",
      "social publishing remains inactive",
      "Pro/VIP/Institutional activation is not faked",
      "no guaranteed profit or win-rate claims",
    ],
    publicLanguageRules: [
      "Normal users may see Trading Pro Max, Trading Workspace, Markets, Plans, Apps / Platforms, Academy, Community, Support, TPM Assistant, Journal, Coach, Settings, Diagnostics, Readiness, Paper-safe, Planned, Inactive, and Future.",
      "Normal users must not see Founder Command, ministries, councils, presidency, construction queue, Codex task drafts, secrets authority, treasury controls, Product Memory internals, or local operations internals.",
    ],
    forbiddenScope: sovereignForbiddenScope,
    validationCommands: sovereignValidationCommands,
    screenshotRequirements:
      event.type === "visual_gap_detected" ||
      event.type === "logo_rejection_detected" ||
      event.type === "chart_quality_low"
        ? [
            "test-results/sovereign-autonomy/public-entry-dark.png",
            "test-results/sovereign-autonomy/workstation-dark.png",
            "test-results/sovereign-autonomy/diagnostics.png",
          ]
        : [],
    rollbackRule:
      "Do not revert user work. If validation fails, report blockers and create a scoped cleanup task.",
    finalReportFormat: [
      "Sovereign Autonomy result",
      "Founder idea intake / event system summary",
      "Policy gates / owner routing summary",
      "Task passport / Codex license summary",
      "Verification",
      "Product truth preserved",
      "Git",
    ],
    expectedCommitMessage: "build sovereign autonomy operating civilization",
    valid: true,
    invalidReasons: [],
  };

  const validation = validateTaskPassport(draft);

  return {
    ...draft,
    valid: validation.valid,
    invalidReasons: validation.invalidReasons,
  };
}
