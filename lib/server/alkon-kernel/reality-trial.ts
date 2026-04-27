import type { RealityTrial, RealityTrialInput } from "./types";

const checkKeys: Array<keyof Required<RealityTrialInput>> = [
  "codeReality",
  "testsReality",
  "visualAcceptance",
  "humanValue",
  "productTruth",
  "safety",
  "law",
  "finance",
  "timing",
  "evidence",
  "memory",
  "founderApproval",
];

function buildChecks(input: RealityTrialInput) {
  return checkKeys.reduce(
    (checks, key) => ({
      ...checks,
      [key]: input[key] === true,
    }),
    {} as Record<keyof Required<RealityTrialInput>, boolean>
  );
}

export function runRealityTrial(input: RealityTrialInput = {}): RealityTrial {
  const checks = buildChecks(input);
  const missing = checkKeys.filter((key) => !checks[key]);

  let outcome: RealityTrial["outcome"] = "accepted";
  if (!checks.productTruth || !checks.safety || !checks.law || !checks.finance) {
    outcome = "blocked";
  } else if (!checks.evidence || !checks.testsReality || !checks.codeReality) {
    outcome = "needs_evidence";
  } else if (!checks.visualAcceptance) {
    outcome = "needs_visual_review";
  } else if (!checks.founderApproval) {
    outcome = "needs_founder_decision";
  } else if (missing.length > 0) {
    outcome = "accepted_with_notes";
  }

  return {
    trialId: "alkon_reality_trial",
    outcome,
    realityHasVetoPower: true,
    checks,
    missing,
    nextAction:
      outcome === "accepted"
        ? "Preserve evidence, memory, and Founder approval before admitting work into Pro Max reality."
        : "Return to the missing Reality Trial evidence before claiming closure.",
  };
}

export function getDefaultRealityTrial(): RealityTrial {
  return runRealityTrial({
    codeReality: true,
    testsReality: true,
    visualAcceptance: false,
    humanValue: true,
    productTruth: true,
    safety: true,
    law: true,
    finance: true,
    timing: true,
    evidence: false,
    memory: true,
    founderApproval: false,
  });
}
