import type { HumanValueCheck, SourceLawTarget } from "./types";

export function evaluateHumanValue(target: SourceLawTarget): HumanValueCheck {
  const valueSignals = [
    target.servesHuman,
    target.improvesClarity,
    target.improvesTrust,
    target.improvesSafePractice,
    target.improvesLearning,
    target.reducesConfusion,
    target.supportsFounderOperation,
    target.protectsBeginners,
    target.reducesClutter,
    target.improvesPrimeWorld,
    target.affectsChart,
    target.improvesAssistant,
  ].filter(Boolean).length;
  const penalty = target.addsComplexity && !target.reducesClutter ? 2 : 0;
  const humanValueScore = Math.max(0, Math.min(10, valueSignals - penalty));
  const affectedHuman = target.servesHuman
    ? target.protectsBeginners
      ? "beginner"
      : "public_user"
    : target.supportsFounderOperation
      ? "founder"
      : target.improvesPrimeWorld
        ? "operator"
        : "none";

  if (humanValueScore <= 0) {
    return {
      humanValueScore,
      affectedHuman,
      userBenefit: "No clear human benefit has been proven.",
      founderBenefit: "No operational benefit has been proven.",
      decision: target.theoryOnly ? "archive" : "delay",
    };
  }

  return {
    humanValueScore,
    affectedHuman,
    userBenefit: target.servesHuman
      ? "Improves clarity, trust, safe practice, learning, or reduced confusion for real users."
      : "Indirect public benefit depends on Founder operation or Prime World protection.",
    founderBenefit: target.supportsFounderOperation
      ? "Improves Ahmad's ability to operate Pro Max safely."
      : "Founder benefit is secondary to public user and Prime World value.",
    decision: humanValueScore >= 5 ? "aligned_now" : "aligned_later",
  };
}
