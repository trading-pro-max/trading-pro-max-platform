import "server-only";

import type {
  CodexResultReportInput,
  CodexResultTribunalDecision,
  CodexTaskPassport,
} from "./types";

function patternMatchesPath(pattern: string, filePath: string) {
  const normalizedPattern = pattern.replace(/\\/g, "/");
  const normalizedFile = filePath.replace(/\\/g, "/");

  if (normalizedPattern === normalizedFile) return true;
  if (normalizedPattern === ".env.*") {
    return normalizedFile.split("/").pop()?.startsWith(".env.") ?? false;
  }
  if (normalizedPattern.startsWith("**/*")) {
    const token = normalizedPattern.replace("**/*", "").replace(/\*/g, "");

    if (token.startsWith(".")) return normalizedFile.endsWith(token);
    return token.length > 0 && normalizedFile.includes(token);
  }
  if (normalizedPattern.startsWith("**/")) {
    const token = normalizedPattern.replace("**/", "").replace(/\*/g, "");

    if (token.startsWith(".")) return normalizedFile.endsWith(token);
    return token.length > 0 && normalizedFile.includes(token);
  }
  if (normalizedPattern.endsWith("/**")) {
    return normalizedFile.startsWith(normalizedPattern.replace("/**", "/"));
  }
  if (normalizedPattern.endsWith("/**/*")) {
    return normalizedFile.startsWith(normalizedPattern.replace("/**/*", "/"));
  }
  if (normalizedPattern.includes("**")) {
    const prefix = normalizedPattern.split("**")[0];
    return normalizedFile.startsWith(prefix);
  }
  if (normalizedPattern.includes("*")) {
    return normalizedFile.startsWith(normalizedPattern.split("*")[0]);
  }

  return false;
}

function fileIsAllowed(passport: CodexTaskPassport, filePath: string) {
  return passport.allowedFiles.some((pattern) => patternMatchesPath(pattern, filePath));
}

function fileIsForbidden(passport: CodexTaskPassport, filePath: string) {
  return passport.forbiddenFiles.some((pattern) => patternMatchesPath(pattern, filePath));
}

export function judgeCodexResult(
  passport: CodexTaskPassport,
  report: CodexResultReportInput
): CodexResultTribunalDecision {
  const forbiddenFilesUntouched = !report.changedFiles.some((file) =>
    fileIsForbidden(passport, file)
  );
  const changedFilesMatchPassport = report.changedFiles.every((file) =>
    fileIsAllowed(passport, file)
  );
  const screenshotsPresentIfRequired =
    passport.screenshotRequirements.length === 0 || report.screenshotsPresent;
  const checks = {
    validationPassed: report.validationPassed,
    gitClean: report.gitClean,
    pushed: report.pushed,
    changedFilesMatchPassport,
    forbiddenFilesUntouched,
    forbiddenScopeNotViolated: !report.forbiddenScopeViolated,
    productTruthPreserved: report.productTruthPreserved,
    noPublicInternalTerminologyLeak: !report.publicInternalTerminologyLeak,
    noFakeActivation: !report.fakeActivationIncluded,
    noSecretsExposure: !report.secretsExposed,
    screenshotsPresentIfRequired,
    ahmadVisualReviewNeeded: report.ahmadVisualReviewNeeded,
  };

  if (report.secretsExposed) {
    return {
      reportId: report.reportId,
      taskId: passport.taskId,
      decision: "security_violation",
      reason: "The report indicates secret exposure.",
      checks,
      nextAction: "Reject, quarantine the report, and route to Security/Secrets review.",
    };
  }

  if (
    !forbiddenFilesUntouched ||
    !changedFilesMatchPassport ||
    report.forbiddenScopeViolated
  ) {
    return {
      reportId: report.reportId,
      taskId: passport.taskId,
      decision: "scope_violation",
      reason:
        "Changed files or reported work moved outside the task passport jurisdiction.",
      checks,
      nextAction:
        "Reject the result, restore scope, and require a new scoped passport.",
    };
  }

  if (
    !report.productTruthPreserved ||
    report.fakeActivationIncluded ||
    report.publicInternalTerminologyLeak
  ) {
    return {
      reportId: report.reportId,
      taskId: passport.taskId,
      decision: "product_truth_violation",
      reason:
        "The result violates Product Truth, fake activation rules, or public/private language separation.",
      checks,
      nextAction:
        "Reject the result and record a Product Truth lesson before retrying.",
    };
  }

  if (!screenshotsPresentIfRequired || report.ahmadVisualReviewNeeded) {
    return {
      reportId: report.reportId,
      taskId: passport.taskId,
      decision: "visual_review_required",
      reason: "Visual work requires screenshots and Ahmad review before acceptance.",
      checks,
      nextAction: "Hold for visual review and do not accept automatically.",
    };
  }

  if (passport.founderApprovalRequired) {
    return {
      reportId: report.reportId,
      taskId: passport.taskId,
      decision: "founder_review_required",
      reason: "The passport requires Founder approval before acceptance.",
      checks,
      nextAction: "Route result to Founder Command for manual review.",
    };
  }

  if (!report.validationPassed || !report.gitClean) {
    return {
      reportId: report.reportId,
      taskId: passport.taskId,
      decision: "needs_fix",
      reason: "Validation failed or Git is not clean.",
      checks,
      nextAction: "Fix validation or cleanup before another tribunal review.",
    };
  }

  return {
    reportId: report.reportId,
    taskId: passport.taskId,
    decision: "accepted",
    reason: "The result satisfies passport scope, validation, and Product Truth.",
    checks,
    nextAction: "Record accepted lesson in Product Memory and report to Founder Command.",
  };
}

export function getCodexResultTribunalSamples(passports: CodexTaskPassport[]) {
  const validPassport = passports.find((passport) => passport.valid);

  if (!validPassport) return [];

  const visualPassport =
    passports.find((passport) => passport.category === "visual_polish") ??
    validPassport;

  const acceptedReport: CodexResultReportInput = {
    reportId: "codex_report_accepted_docs",
    taskId: validPassport.taskId,
    validationPassed: true,
    gitClean: true,
    pushed: true,
    changedFiles: ["docs/product/codex-task-constitution.md"],
    forbiddenScopeViolated: false,
    productTruthPreserved: true,
    publicInternalTerminologyLeak: false,
    fakeActivationIncluded: false,
    secretsExposed: false,
    screenshotsPresent: true,
    ahmadVisualReviewNeeded: false,
  };
  const forbiddenReport: CodexResultReportInput = {
    reportId: "codex_report_scope_violation",
    taskId: validPassport.taskId,
    validationPassed: true,
    gitClean: true,
    pushed: false,
    changedFiles: [".env.local", "app/api/broker/state/route.ts"],
    forbiddenScopeViolated: true,
    productTruthPreserved: true,
    publicInternalTerminologyLeak: false,
    fakeActivationIncluded: false,
    secretsExposed: false,
    screenshotsPresent: true,
    ahmadVisualReviewNeeded: false,
  };
  const securityReport: CodexResultReportInput = {
    reportId: "codex_report_security_violation",
    taskId: validPassport.taskId,
    validationPassed: true,
    gitClean: true,
    pushed: false,
    changedFiles: ["docs/product/codex-task-constitution.md"],
    forbiddenScopeViolated: false,
    productTruthPreserved: true,
    publicInternalTerminologyLeak: false,
    fakeActivationIncluded: false,
    secretsExposed: true,
    screenshotsPresent: true,
    ahmadVisualReviewNeeded: false,
  };
  const visualReport: CodexResultReportInput = {
    reportId: "codex_report_visual_review",
    taskId: visualPassport.taskId,
    validationPassed: true,
    gitClean: true,
    pushed: false,
    changedFiles: ["app/globals.css"],
    forbiddenScopeViolated: false,
    productTruthPreserved: true,
    publicInternalTerminologyLeak: false,
    fakeActivationIncluded: false,
    secretsExposed: false,
    screenshotsPresent: false,
    ahmadVisualReviewNeeded: true,
  };

  return [
    judgeCodexResult(validPassport, acceptedReport),
    judgeCodexResult(validPassport, forbiddenReport),
    judgeCodexResult(validPassport, securityReport),
    visualPassport ? judgeCodexResult(visualPassport, visualReport) : null,
  ].filter((decision): decision is CodexResultTribunalDecision => Boolean(decision));
}
