import "server-only";

import { codexBlockedCategories } from "./constitution";
import { getCodexJurisdiction } from "./jurisdiction";
import { decideCodexTaskRequest } from "./parliament";
import type {
  CodexConstructionRequest,
  CodexTaskCategory,
  CodexTaskPassport,
  CodexWorkerLevel,
} from "./types";

const productTruthRequirements = [
  "Do not enable live execution, real money, broker/feed, billing, social publishing, or public launch.",
  "Do not fake users, revenue, metrics, Pro/VIP/Institutional activation, Swiss company status, or Islamic/Sharia certification.",
  "Do not introduce guaranteed profit, guaranteed win-rate, copy-trading, funding, or real-order claims.",
  "Keep public plan names honest: Free is paper-safe, Pro/VIP/Institutional remain planned or inactive unless real entitlement work is separately approved.",
];

const publicLanguageRules = [
  "Normal users must see simple product language only.",
  "Do not expose Founder Command, Presidency, Codex Sovereign Construction State, Task Parliament, Task Passport, Execution Permit, Result Tribunal, Construction Queue, secrets authority, or internal governance terms to public UI.",
  "Use Trading Pro Max, Trading Workspace, Markets, Plans, Apps / Platforms, Academy, Community, Support, Journal, Coach, Settings, Diagnostics, Readiness, Paper-safe, Planned, Inactive, and Future for public-facing language.",
];

const forbiddenScope = [
  "No shell execution from the web app.",
  "No direct Codex calls from the web app.",
  "No secrets, tokens, credentials, private keys, or production env values.",
  "No billing, broker/feed, live execution, real money, social publishing, public launch, account creation, or external publishing activation.",
  "No auth/security weakening, Founder Command public exposure, fake metrics, fake plan activation, fake legal/company status, or fake certification.",
  "Do not expand scope beyond allowed files and allowed surfaces.",
];

const finalReportFormat = [
  "Summary of changes",
  "Files changed",
  "Validation commands and pass/fail",
  "Screenshots if required",
  "Product Truth preserved",
  "Forbidden scope untouched",
  "Remaining risks or Founder review needed",
];

const secretPattern =
  /(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|password\s*=|token\s*=|secret_present_marker|private_key)/i;

function containsSecretMaterial(passport: CodexTaskPassport) {
  const text = JSON.stringify({
    title: passport.title,
    mission: passport.mission,
    reason: passport.reason,
    expectedCommitMessage: passport.expectedCommitMessage,
  });

  return secretPattern.test(text);
}

function workerLevelForRequest(
  request: CodexConstructionRequest,
  blocked: boolean
): CodexWorkerLevel {
  if (blocked) return "restricted";
  if (request.riskLevel === "critical") return "restricted";
  if (
    request.category === "docs_update" ||
    request.category === "test_update" ||
    request.category === "lint_cleanup" ||
    request.category === "type_cleanup"
  ) {
    return "builder_low";
  }
  if (request.category === "copy_cleanup" && request.riskLevel === "low") {
    return "builder_low";
  }

  return "drafter";
}

function screenshotRequirementsForCategory(category: CodexTaskCategory) {
  if (category === "visual_polish" || category === "css_polish") {
    return [
      "Capture the affected public surface in dark mode.",
      "Confirm chart-first hierarchy remains intact.",
      "Attach screenshot paths in the final report.",
    ];
  }

  if (category === "logo_identity" || category === "public_ui") {
    return [
      "Capture public entry and affected public surface in dark mode.",
      "Flag Ahmad visual review as required before acceptance.",
    ];
  }

  return [];
}

export function validateCodexTaskPassport(passport: CodexTaskPassport) {
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
  if (containsSecretMaterial(passport)) {
    invalidReasons.push("passport appears to contain secret material");
  }
  if (codexBlockedCategories.includes(passport.category)) {
    invalidReasons.push("critical blocked category cannot receive a valid passport");
  }
  if (
    passport.allowedFiles.length === 0 ||
    passport.forbiddenFiles.length === 0 ||
    passport.allowedSurfaces.length === 0 ||
    passport.forbiddenSurfaces.length === 0
  ) {
    invalidReasons.push("public/private boundary or file jurisdiction is unclear");
  }

  return {
    valid: invalidReasons.length === 0,
    invalidReasons,
  };
}

export function buildCodexTaskPassport(
  request: CodexConstructionRequest,
  checkedAt = new Date().toISOString()
): CodexTaskPassport {
  const parliament = decideCodexTaskRequest(request);
  const jurisdiction = getCodexJurisdiction(request.category);
  const blocked =
    parliament.decision === "block" || jurisdiction.blockedByDefault ||
    codexBlockedCategories.includes(request.category);
  const workerLevel = workerLevelForRequest(request, blocked);

  const passport: CodexTaskPassport = {
    taskId: `codex_task_${request.requestId.replace(/^codex_req_/, "")}`,
    title: request.title,
    mission:
      blocked
        ? `Record ${request.title} as blocked readiness only.`
        : `Complete the scoped ${request.title} task without expanding authority.`,
    reason: request.reason,
    category: request.category,
    riskLevel: request.riskLevel,
    workerLevel,
    ownerMinistryOrArea: parliament.ownerArea,
    allowedFiles: jurisdiction.allowedFiles,
    forbiddenFiles: jurisdiction.forbiddenFiles,
    allowedSurfaces: jurisdiction.allowedSurfaces,
    forbiddenSurfaces: jurisdiction.forbiddenSurfaces,
    requiredReviews: parliament.requiredReviews,
    founderApprovalRequired: parliament.founderReviewNeeded,
    legalReviewRequired: parliament.legalReviewNeeded,
    guardianReviewRequired: parliament.guardianReviewNeeded,
    securityReviewRequired: parliament.securityReviewNeeded,
    productTruthRequirements,
    publicLanguageRules,
    forbiddenScope,
    validationCommands: jurisdiction.validationRequired,
    screenshotRequirements: screenshotRequirementsForCategory(request.category),
    rollbackRule: jurisdiction.rollbackRule,
    finalReportFormat,
    expectedCommitMessage:
      blocked
        ? "record blocked codex construction request"
        : `build ${request.title.toLowerCase()}`,
    createdAt: checkedAt,
    valid: true,
    invalidReasons: [],
  };
  const validation = validateCodexTaskPassport(passport);

  return {
    ...passport,
    valid: validation.valid,
    invalidReasons: validation.invalidReasons,
  };
}

export function createCodexInvalidPassportSamples(
  passports: CodexTaskPassport[]
): CodexTaskPassport[] {
  const base = passports.find((passport) => passport.category === "docs_update") ??
    passports.find((passport) => passport.valid);
  if (!base) return [];

  const missingValidation: CodexTaskPassport = {
    ...base,
    taskId: `${base.taskId}_missing_validation`,
    validationCommands: [],
  };
  const missingValidationResult = validateCodexTaskPassport(missingValidation);

  const secretLike: CodexTaskPassport = {
    ...base,
    taskId: `${base.taskId}_secret_rejected`,
    reason: "Do not include password=redacted in any construction task.",
  };
  const secretLikeResult = validateCodexTaskPassport(secretLike);

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
