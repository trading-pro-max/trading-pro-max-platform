import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluateFounderGate(seed: AlkonWorldSeed): AlkonGenesisGateResult {
  if (seed.founderApproval === "rejected") {
    return {
      gateId: "founder_gate",
      status: "reject",
      reason: "Founder rejected this seed.",
      evidenceNeeded: ["Founder decision record"],
      requiredReview: ["Founder review"],
      safeAlternative: "Archive the seed with memory.",
    };
  }

  if (seed.founderApproval === "approved_birth") {
    return {
      gateId: "founder_gate",
      status: "pass",
      reason: "Founder birth approval exists in private readiness state.",
      evidenceNeeded: ["birth permit"],
      requiredReview: [],
      safeAlternative: "Birth can only proceed after all gates pass.",
    };
  }

  if (seed.founderApproval === "approved_prototype") {
    return {
      gateId: "founder_gate",
      status: "pass",
      reason: "Founder approved prototype-readiness only; world birth still requires separate final approval.",
      evidenceNeeded: ["Founder birth approval before birth"],
      requiredReview: [],
      safeAlternative: "Allow mock/read-only prototype work only.",
    };
  }

  return {
    gateId: "founder_gate",
    status: "needs_review",
    reason: "Founder final authority is required for world birth.",
    evidenceNeeded: ["Founder approval"],
    requiredReview: ["Founder final approval"],
    safeAlternative: "Allow seed evaluation or prototype-readiness only.",
  };
}
