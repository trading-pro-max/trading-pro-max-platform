import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluateMarketGate(seed: AlkonWorldSeed): AlkonGenesisGateResult {
  if (
    seed.relationshipToPrime === "distracts_from_prime_world" ||
    seed.relationshipToPrime === "weakens_prime_world"
  ) {
    return {
      gateId: "market_gate",
      status: "delay",
      reason: "The seed risks brand confusion or separate marketing/support load before Prime World readiness.",
      evidenceNeeded: ["adjacency proof", "brand clarity proof", "support load estimate"],
      requiredReview: ["Founder review"],
      safeAlternative: "Keep it future-only until Pro Max Trading acceptance is stable.",
    };
  }

  if (seed.category === "future_unknown") {
    return {
      gateId: "market_gate",
      status: "needs_review",
      reason: "The audience and market are unclear.",
      evidenceNeeded: ["audience hypothesis", "market hypothesis", "relationship to Pro Max Trading"],
      requiredReview: ["Founder review"],
      safeAlternative: "Evaluate the audience before any prototype.",
    };
  }

  return {
    gateId: "market_gate",
    status: seed.hasMarketProof ? "pass" : "needs_review",
    reason: seed.hasMarketProof
      ? "Market hypothesis proof exists in readiness form."
      : "The market is plausible but not proven; no fake market claims are allowed.",
    evidenceNeeded: ["market hypothesis proof"],
    requiredReview: seed.hasMarketProof ? [] : ["Founder review"],
    safeAlternative: "Keep market claims internal and unadvertised.",
  };
}
