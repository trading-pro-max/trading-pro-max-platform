import "server-only";

import type {
  ResultTribunalInput,
  ResultTribunalReport,
  TaskPassport,
  TribunalDecision,
} from "./types";

function check(key: string, pass: boolean, detail: string) {
  return { key, pass, detail };
}

function changedFilesWithinPassport(passport: TaskPassport, changedFiles: string[]) {
  return changedFiles.every((file) =>
    passport.allowedFiles.some(
      (allowed) => file === allowed || file.startsWith(`${allowed.replace(/\/$/, "")}/`)
    )
  );
}

function forbiddenFilesUntouched(passport: TaskPassport, changedFiles: string[]) {
  return changedFiles.every(
    (file) =>
      !passport.forbiddenFiles.some(
        (forbidden) =>
          file === forbidden || file.startsWith(`${forbidden.replace(/\/$/, "")}/`)
      )
  );
}

function decisionFromChecks(input: {
  passport: TaskPassport;
  changedFilesInScope: boolean;
  forbiddenUntouched: boolean;
  validationPass: boolean;
  screenshotsPass: boolean;
  productTruthPass: boolean;
  secretsPass: boolean;
  fakeActivationPass: boolean;
  boundaryPass: boolean;
}): TribunalDecision {
  if (!input.passport.valid) return "blocked";
  if (!input.secretsPass || !input.forbiddenUntouched) return "security_violation";
  if (!input.changedFilesInScope) return "scope_violation";
  if (!input.productTruthPass || !input.fakeActivationPass) {
    return "product_truth_violation";
  }
  if (!input.boundaryPass) return "public_boundary_violation";
  if (!input.screenshotsPass) return "visual_review_required";
  if (input.passport.founderApprovalRequired) return "founder_review_required";
  if (!input.validationPass) return "needs_fix";
  return "accepted";
}

export function judgeResult(
  passport: TaskPassport,
  input: ResultTribunalInput,
  checkedAt = new Date().toISOString()
): ResultTribunalReport {
  const changedFilesInScope = changedFilesWithinPassport(
    passport,
    input.changedFiles
  );
  const forbiddenUntouched = forbiddenFilesUntouched(passport, input.changedFiles);
  const validationPass =
    input.validation.tsc &&
    input.validation.eslint &&
    input.validation.build &&
    input.validation.prisma &&
    input.validation.regression &&
    input.validation.smoke &&
    input.validation.gitClean;
  const screenshotsPass =
    passport.screenshotRequirements.length === 0 ||
    passport.screenshotRequirements.every((path) => input.screenshots.includes(path));

  const decision = decisionFromChecks({
    passport,
    changedFilesInScope,
    forbiddenUntouched,
    validationPass,
    screenshotsPass,
    productTruthPass: input.productTruthPreserved,
    secretsPass: input.noSecrets,
    fakeActivationPass: input.noFakeActivation,
    boundaryPass: input.publicPrivateSeparationPreserved,
  });

  return {
    checkedAt,
    taskId: passport.taskId,
    decision,
    checks: [
      check("tsc", input.validation.tsc, "TypeScript validation must pass."),
      check("eslint", input.validation.eslint, "ESLint must pass with zero warnings."),
      check("build", input.validation.build, "Next build must pass."),
      check("prisma", input.validation.prisma, "Prisma validation must pass."),
      check("regression", input.validation.regression, "Regression tests must pass."),
      check("smoke", input.validation.smoke, "Smoke routes must pass."),
      check("git_clean", input.validation.gitClean, "Git must be clean after commit."),
      check("pushed", input.validation.pushed, "Push status must be reported."),
      check("changed_files_match_passport", changedFilesInScope, "Changed files must match allowed files."),
      check("forbidden_files_untouched", forbiddenUntouched, "Forbidden files must not be touched."),
      check("product_truth_preserved", input.productTruthPreserved, "Product Truth must remain intact."),
      check("no_secrets", input.noSecrets, "No secrets may appear in code, docs, logs, prompts, or memory."),
      check("no_fake_activation", input.noFakeActivation, "No fake activation is allowed."),
      check(
        "public_private_separation_preserved",
        input.publicPrivateSeparationPreserved,
        "Public users must not see internal autonomy systems."
      ),
      check("screenshots_present", screenshotsPass, "Screenshots are required for visual work."),
    ],
    nextSafeAction:
      decision === "accepted"
        ? "Record accepted pattern in Product Memory and archive the task."
        : "Return a focused fix task through the same passport and policy gates.",
  };
}

export function getResultTribunalSamples(
  passports: TaskPassport[],
  checkedAt = new Date().toISOString()
) {
  const passport = passports.find((candidate) => candidate.valid) ?? passports[0];
  if (!passport) return [];

  return [
    judgeResult(
      passport,
      {
        changedFiles: passport.allowedFiles.slice(0, 1),
        validation: {
          tsc: true,
          eslint: true,
          build: true,
          prisma: true,
          regression: true,
          smoke: true,
          gitClean: true,
          pushed: false,
        },
        screenshots: passport.screenshotRequirements,
        productTruthPreserved: true,
        noSecrets: true,
        noFakeActivation: true,
        publicPrivateSeparationPreserved: true,
      },
      checkedAt
    ),
    judgeResult(
      passport,
      {
        changedFiles: [".env.production.local"],
        validation: {
          tsc: true,
          eslint: true,
          build: true,
          prisma: true,
          regression: true,
          smoke: true,
          gitClean: false,
          pushed: false,
        },
        screenshots: [],
        productTruthPreserved: true,
        noSecrets: false,
        noFakeActivation: true,
        publicPrivateSeparationPreserved: true,
      },
      checkedAt
    ),
  ];
}
