import type { AlkonJudgment, AlkonJudgmentInput } from "./types";

const DEFAULT_VALIDATION_INPUT: Required<AlkonJudgmentInput> = {
  signalId: "alkon_judgment_default",
  tscPassed: true,
  eslintPassed: true,
  buildPassed: true,
  prismaPassed: true,
  regressionPassed: true,
  smokePassed: true,
  gitClean: true,
  pushed: false,
  changedFilesInScope: true,
  forbiddenFilesTouched: false,
  publicInternalTermsFound: false,
  secretsFound: false,
  fakeActivationFound: false,
  rasterAssetsFound: false,
  visualProofRequired: false,
  visualProofProvided: false,
};

export function judgeAlkonResult(input: AlkonJudgmentInput = {}): AlkonJudgment {
  const result = { ...DEFAULT_VALIDATION_INPUT, ...input };
  const validationFailed =
    !result.tscPassed ||
    !result.eslintPassed ||
    !result.buildPassed ||
    !result.prismaPassed ||
    !result.regressionPassed ||
    !result.smokePassed;

  if (result.secretsFound) {
    return {
      signalId: result.signalId,
      outcome: "security_violation",
      reason: "Secrets or secret-like values were detected.",
      nextAction: "Quarantine result, remove secret exposure, and request Security review.",
      memoryLesson: "Secrets must never be stored, exposed, or sent through Alkon reports.",
      founderReviewNeeded: true,
    };
  }

  if (result.publicInternalTermsFound) {
    return {
      signalId: result.signalId,
      outcome: "public_boundary_violation",
      reason: "Public output contains internal Alkon or governance terms.",
      nextAction: "Block acceptance and add public leak-prevention proof.",
      memoryLesson: "Public users only see Trading Pro Max product language.",
      founderReviewNeeded: true,
    };
  }

  if (result.fakeActivationFound) {
    return {
      signalId: result.signalId,
      outcome: "product_truth_violation",
      reason: "The result suggests fake activation or false readiness.",
      nextAction: "Reject claim and restore Product Truth wording.",
      memoryLesson: "No fake users, revenue, metrics, downloads, plans, billing, live execution, or launch claims.",
      founderReviewNeeded: true,
    };
  }

  if (result.rasterAssetsFound) {
    return {
      signalId: result.signalId,
      outcome: "scope_violation",
      reason: "Images or raster assets were added without explicit approval.",
      nextAction: "Remove raster assets and use code-only visuals.",
      memoryLesson: "Ahmad does not want images unless explicitly requested.",
      founderReviewNeeded: true,
    };
  }

  if (result.forbiddenFilesTouched || !result.changedFilesInScope) {
    return {
      signalId: result.signalId,
      outcome: "scope_violation",
      reason: "Changed files did not match the allowed scope.",
      nextAction: "Review diff scope and remove unrelated changes.",
      memoryLesson: "Alkon accepts work only when file changes match the Task Passport.",
      founderReviewNeeded: true,
    };
  }

  if (validationFailed) {
    return {
      signalId: result.signalId,
      outcome: "needs_fix",
      reason: "One or more validation gates failed.",
      nextAction: "Fix validation failures before Founder acceptance.",
      memoryLesson: "Result Tribunal requires tsc, eslint, build, prisma, regression, smoke, diff check, and clean Git evidence.",
      founderReviewNeeded: false,
    };
  }

  if (result.visualProofRequired && !result.visualProofProvided) {
    return {
      signalId: result.signalId,
      outcome: "visual_review_required",
      reason: "Visual proof is required before acceptance.",
      nextAction: "Capture proof and request Ahmad visual review.",
      memoryLesson: "Chart, shell, logo, and visual identity work needs screenshots when requested.",
      founderReviewNeeded: true,
    };
  }

  return {
    signalId: result.signalId,
    outcome: "accepted",
    reason: "Validation and scope checks passed without public leaks, secrets, fake activation, or raster assets.",
    nextAction: result.pushed
      ? "Record the accepted lesson and continue with the next safe Founder-approved task."
      : "Record the tribunal result and push only after final validation if required.",
    memoryLesson: "Accepted work must preserve Product Truth, public/private boundaries, and local scope.",
    founderReviewNeeded: false,
  };
}

export function judgeAlkonResults(inputs: AlkonJudgmentInput[]) {
  return inputs.map(judgeAlkonResult);
}
