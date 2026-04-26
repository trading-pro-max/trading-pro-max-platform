import { evaluateHumanValue } from "./human-value";
import { SOURCE_LAW_MEMORY_LESSONS } from "./memory";
import { decideOneCorrectAction } from "./one-correct-action";
import { evaluateProofCheck } from "./proof-check";
import { evaluateSafetyCheck } from "./safety-check";
import { detectSourceDrift } from "./source-drift";
import { evaluateTruthCheck } from "./truth-check";
import type { SourceDecision, SourceLawReport, SourceLawTarget } from "./types";
import { evaluateVisionCore } from "./vision-core";

export const SAMPLE_SOURCE_LAW_TARGETS: SourceLawTarget[] = [
  {
    targetId: "living_market_core_proof",
    title: "Close Living Market Core proof",
    description:
      "Prove the Pro Max Trading workspace is chart-first, calm, truthful, and useful for Local Day One.",
    type: "workspace",
    affectedSurface: "Trading Workspace",
    currentStation: "station_1_open",
    publicVisible: true,
    servesHuman: true,
    improvesClarity: true,
    improvesTrust: true,
    improvesSafePractice: true,
    reducesConfusion: true,
    supportsFounderOperation: true,
    protectsBeginners: true,
    reducesClutter: true,
    improvesPrimeWorld: true,
    affectsChart: true,
    hasTruthProof: true,
    hasSafetyProof: true,
    hasValidationProof: true,
    hasScreenshots: true,
    hasPublicLeakCheck: true,
    hasProductTruthCheck: true,
    hasGitProof: true,
    isVisualAcceptanceSensitive: true,
    hasFounderVisualAcceptance: false,
  },
  {
    targetId: "vanity_theory_layer",
    title: "Add a theory-only private layer",
    description:
      "Add more internal language without improving chart, Assistant, Local Day One, or user trust.",
    type: "idea",
    affectedSurface: "Private planning",
    currentStation: "station_1_open",
    publicVisible: false,
    addsComplexity: true,
    theoryOnly: true,
    hasTruthProof: false,
    hasSafetyProof: true,
    hasValidationProof: false,
    hasGitProof: false,
  },
  {
    targetId: "fake_public_claim",
    title: "Publish a public number-one claim",
    description:
      "Claim Pro Max is #1, regulated, live, and guarantees profit.",
    type: "public_copy",
    affectedSurface: "Home",
    currentStation: "station_1_open",
    publicVisible: true,
    servesHuman: false,
    involvesFakeClaim: true,
    involvesFakeNumberOneClaim: true,
    claimText:
      "Pro Max is #1, regulated, live, and has guaranteed profit with highest win rate.",
    hasTruthProof: false,
    hasSafetyProof: false,
    hasValidationProof: false,
    hasPublicLeakCheck: false,
    hasProductTruthCheck: false,
    hasGitProof: false,
  },
  {
    targetId: "future_world_seed",
    title: "Evaluate future Pro Max world",
    description:
      "Preserve a future-world seed as private memory while Pro Max Trading remains open.",
    type: "future_world",
    affectedSurface: "Private Genesis readiness",
    currentStation: "station_1_open",
    publicVisible: false,
    supportsFounderOperation: true,
    expandsFutureWorld: true,
    improvesPrimeWorld: false,
    hasTruthProof: true,
    hasSafetyProof: true,
    hasValidationProof: true,
    hasGitProof: true,
  },
  {
    targetId: "dangerous_activation",
    title: "Activate live trading and billing",
    description:
      "Enable live execution, broker/feed, real money, and billing from the web app.",
    type: "launch_step",
    affectedSurface: "Execution and billing",
    currentStation: "station_1_open",
    publicVisible: false,
    involvesLiveExecution: true,
    involvesRealMoney: true,
    involvesBrokerFeed: true,
    involvesBilling: true,
    involvesSecrets: true,
    hasTruthProof: false,
    hasSafetyProof: false,
    hasValidationProof: false,
    hasGitProof: false,
  },
];

function chooseDecision(report: Omit<SourceLawReport, "decision" | "memoryLesson" | "nextSafeAction">): SourceDecision {
  if (report.truth.decision === "block" || report.safety.decision === "block") {
    return "block";
  }

  if (report.vision.visionAlignment === "blocked") {
    return "block";
  }

  if (
    report.driftSignals.some(
      (signal) =>
        signal.driftDetected &&
        (signal.driftType === "expansion_before_prime_world" ||
          signal.driftType === "local_day_one_delayed")
    )
  ) {
    return "return_to_prime_world";
  }

  if (report.humanValue.decision === "archive") {
    return "archive";
  }

  if (report.humanValue.decision === "delay") {
    return "delay";
  }

  if (report.proof.proofStatus === "needs_founder_review") {
    return "needs_founder_review";
  }

  if (report.proof.proofStatus === "needs_proof") {
    return "needs_proof";
  }

  if (report.vision.founderReviewNeeded || report.safety.decision === "needs_founder_review") {
    return "needs_founder_review";
  }

  return "aligned_now";
}

function nextSafeActionForDecision(decision: SourceDecision): string {
  switch (decision) {
    case "aligned_now":
      return "Proceed with the smallest proven action that improves Pro Max Trading.";
    case "aligned_later":
      return "Keep the target in readiness until Station 1 proof is stronger.";
    case "needs_proof":
      return "Collect validation, Product Truth, public leak, visual, Git, and route proof before closure.";
    case "needs_founder_review":
      return "Ask Ahmad for one Founder review decision and keep everything else as draft.";
    case "delay":
      return "Delay until the target has human value, Source Law alignment, and Station 1 relevance.";
    case "block":
      return "Block the target and use safe readiness wording or private memory only.";
    case "archive":
      return "Archive as future memory because it has no current product impact.";
    case "return_to_prime_world":
      return "Return build energy to Living Market Core, Pro Max Assistant clarity, Reality Audit, and Local Day One.";
  }
}

function lessonForDecision(decision: SourceDecision) {
  if (decision === "block") {
    return SOURCE_LAW_MEMORY_LESSONS.find((lesson) => lesson.lesson.includes("No truth")) ??
      SOURCE_LAW_MEMORY_LESSONS[0];
  }

  if (decision === "return_to_prime_world") {
    return (
      SOURCE_LAW_MEMORY_LESSONS.find((lesson) =>
        lesson.lesson.includes("future expansion")
      ) ?? SOURCE_LAW_MEMORY_LESSONS[0]
    );
  }

  if (decision === "needs_proof" || decision === "needs_founder_review") {
    return SOURCE_LAW_MEMORY_LESSONS.find((lesson) => lesson.lesson.includes("No safety")) ??
      SOURCE_LAW_MEMORY_LESSONS[0];
  }

  return SOURCE_LAW_MEMORY_LESSONS[0];
}

export function evaluateSourceLawTarget(target: SourceLawTarget): SourceLawReport {
  const vision = evaluateVisionCore(target);
  const humanValue = evaluateHumanValue(target);
  const truth = evaluateTruthCheck(target);
  const safety = evaluateSafetyCheck(target);
  const proof = evaluateProofCheck(target);
  const driftSignals = detectSourceDrift(target);
  const oneCorrectAction = decideOneCorrectAction({
    currentStation: target.currentStation,
    livingMarketCoreClosed: false,
    assistantFirstClosed: true,
    visualAcceptancePending: target.isVisualAcceptanceSensitive,
    target,
    driftSignals,
  });
  const partialReport = {
    reportId: `${target.targetId ?? "source_target"}_source_law_report`,
    target,
    vision,
    humanValue,
    truth,
    safety,
    proof,
    driftSignals,
    oneCorrectAction,
  };
  const decision = chooseDecision(partialReport);

  return {
    ...partialReport,
    decision,
    memoryLesson: lessonForDecision(decision),
    nextSafeAction: nextSafeActionForDecision(decision),
  };
}

export function evaluateSourceLawSamples(): SourceLawReport[] {
  return SAMPLE_SOURCE_LAW_TARGETS.map(evaluateSourceLawTarget);
}
