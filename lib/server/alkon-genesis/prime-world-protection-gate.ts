import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluatePrimeWorldProtectionGate(
  seed: AlkonWorldSeed
): AlkonGenesisGateResult {
  if (
    seed.relationshipToPrime === "weakens_prime_world" ||
    seed.relationshipToPrime === "forbidden"
  ) {
    return {
      gateId: "prime_world_protection_gate",
      status: "reject",
      reason: "The seed would weaken Trading Pro Max or expose forbidden private systems.",
      evidenceNeeded: ["Prime World protection proof"],
      requiredReview: ["Founder review"],
      safeAlternative: "Reject or archive the seed.",
    };
  }

  if (
    seed.relationshipToPrime === "distracts_from_prime_world" ||
    seed.requiresExternalSpend ||
    seed.requiresRegulatoryReview
  ) {
    return {
      gateId: "prime_world_protection_gate",
      status: "delay",
      reason: "The seed may consume attention, legal, media, treasury, or support capacity before Station 1 closure.",
      evidenceNeeded: ["Station 1 closure", "Local Day One acceptance", "no-harm proof"],
      requiredReview: ["Founder review"],
      safeAlternative: "Delay until Prime World acceptance is stable.",
    };
  }

  return {
    gateId: "prime_world_protection_gate",
    status: "pass",
    reason: "The seed is safe-adjacent to Trading Pro Max in private readiness scope.",
    evidenceNeeded: ["no-harm proof before birth"],
    requiredReview: [],
    safeAlternative: "Keep the seed private and scoped.",
  };
}
