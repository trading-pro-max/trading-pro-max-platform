import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluateMeaningGate(seed: AlkonWorldSeed): AlkonGenesisGateResult {
  const unclear =
    seed.category === "future_unknown" ||
    seed.purposeHypothesis.trim().length < 24 ||
    /exciting|cool|maybe|random/i.test(seed.purposeHypothesis);

  if (unclear) {
    return {
      gateId: "meaning_gate",
      status: "reject",
      reason: "A world seed needs a clear reason to exist, not excitement alone.",
      evidenceNeeded: ["clear problem", "served audience", "reason it supports or extends Prime World"],
      requiredReview: ["Founder review"],
      safeAlternative: "Keep the idea archived as a note until meaning is proven.",
    };
  }

  if (
    seed.relationshipToPrime === "distracts_from_prime_world" ||
    seed.relationshipToPrime === "weakens_prime_world"
  ) {
    return {
      gateId: "meaning_gate",
      status: "delay",
      reason: "The seed may create distraction or weaken Pro Max Trading.",
      evidenceNeeded: ["Prime World benefit", "scope limit"],
      requiredReview: ["Founder review"],
      safeAlternative: "Delay until the seed clearly supports the Prime World.",
    };
  }

  return {
    gateId: "meaning_gate",
    status: "pass",
    reason: "The seed has a meaningful purpose hypothesis.",
    evidenceNeeded: ["purpose proof before birth"],
    requiredReview: [],
    safeAlternative: "Continue evaluation without creating a product.",
  };
}
