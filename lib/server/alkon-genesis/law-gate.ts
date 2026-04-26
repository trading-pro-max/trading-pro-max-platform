import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluateLawGate(seed: AlkonWorldSeed): AlkonGenesisGateResult {
  if (seed.requiresRegulatoryReview) {
    return {
      gateId: "law_gate",
      status: "blocked",
      reason: "Financial services or regulated activity requires Swiss legal/regulatory review before prototype or birth.",
      evidenceNeeded: ["legal review", "FINMA/regulatory analysis if applicable", "Product Truth proof"],
      requiredReview: ["legal/regulatory review", "Founder review"],
      safeAlternative: "Keep as internal regulatory readiness notes only.",
    };
  }

  if (seed.requiresUserData || seed.requiresMediaClaims) {
    return {
      gateId: "law_gate",
      status: "needs_review",
      reason: "User data, support promises, media claims, or public claims require law, privacy, and claims review.",
      evidenceNeeded: ["privacy review", "claims review", "legal/guardian review"],
      requiredReview: ["privacy review", "claims review"],
      safeAlternative: "Keep the seed private and readiness-only.",
    };
  }

  return {
    gateId: "law_gate",
    status: seed.hasLegalProof ? "pass" : "needs_review",
    reason: seed.hasLegalProof
      ? "Legal readiness proof exists in private form."
      : "Legal proof is still required before world birth.",
    evidenceNeeded: ["legal readiness proof"],
    requiredReview: seed.hasLegalProof ? [] : ["legal/guardian review"],
    safeAlternative: "Continue only as private evaluation.",
  };
}
