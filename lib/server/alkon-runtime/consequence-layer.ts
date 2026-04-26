import type {
  AlkonRealityAdmission,
  AlkonRuntimeConsequence,
  AlkonRuntimeInput,
  AlkonRuntimeLawDecision,
} from "./types";

export function evaluateAlkonRuntimeConsequence(
  input: AlkonRuntimeInput,
  law: AlkonRuntimeLawDecision,
  reality: AlkonRealityAdmission
): AlkonRuntimeConsequence {
  if (law.lawDecision === "black_holed") {
    return {
      consequenceSummary:
        "Forbidden action is isolated before reality contact; consequence is private block, report, and memory.",
      riskCreated: "Repeated request risk if not remembered.",
      valueCreated: "Protects public trust, secrets, money, and Product Truth.",
      costCreated: "Requires private review attention only.",
      supportCreated: "No public support burden.",
      memoryNeeded: true,
      nextFateRecommendation: "black_hole",
    };
  }

  if (reality.founderDecisionRequired) {
    return {
      consequenceSummary:
        "Sensitive readiness may create money, security, reputation, or trust consequences and needs Founder responsibility.",
      riskCreated: "Premature reality admission could confuse users or create operational burden.",
      valueCreated: "Private review creates safer timing and clearer next steps.",
      costCreated: "Founder review and audit proof are required.",
      supportCreated: input.publicVisible ? "Support copy may be needed." : "No public support burden yet.",
      memoryNeeded: true,
      nextFateRecommendation: "tribunal_review",
    };
  }

  return {
    consequenceSummary:
      "Safe local readiness can improve clarity, usefulness, proof, or memory without activating real-world systems.",
    riskCreated: "Low risk if validation and public leak checks pass.",
    valueCreated: "Improves the product while preserving Product Truth.",
    costCreated: "Normal validation and maintenance.",
    supportCreated: input.publicVisible ? "Public explanation may be needed." : "No public support burden.",
    memoryNeeded: true,
    nextFateRecommendation: input.category === "product_gap" ? "draft_task" : "monitor",
  };
}
