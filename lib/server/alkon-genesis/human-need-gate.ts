import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluateHumanNeedGate(
  seed: AlkonWorldSeed
): AlkonGenesisGateResult {
  const needText = `${seed.purposeHypothesis} ${seed.intendedAudience} ${seed.possibleValue}`;
  const hasNeed =
    /support|learning|readiness|review|ops|invoice|privacy|security|content|command|trust|audience|users|learners|Founder/i.test(
      needText
    );

  if (!hasNeed || /vanity|brand stunt/i.test(seed.possibleValue)) {
    return {
      gateId: "human_need_gate",
      status: "reject",
      reason: "No real human, Founder, business, support, learning, or operational need is proven.",
      evidenceNeeded: ["human pain", "Founder need", "business or support need"],
      requiredReview: ["Founder review"],
      safeAlternative: "Do not create a world; keep it as an idea note.",
    };
  }

  return {
    gateId: "human_need_gate",
    status: "pass",
    reason: "The seed maps to a plausible human, Founder, business, support, learning, or operational need.",
    evidenceNeeded: ["need proof before birth"],
    requiredReview: [],
    safeAlternative: "Keep evaluation private and evidence-based.",
  };
}
