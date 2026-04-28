import type { BrandCandidate, BrandDecision, BrandRiskLevel } from "./types";

const blockedNamePattern =
  /pro\s*max|apple|dell|alcon|alkon|finma|regulated|licensed|bank|broker|guarantee|profit|winrate|win-rate/i;

export const brandTribunalCriteria = [
  "uniqueness",
  "trademark search readiness",
  "domain availability readiness",
  "visual distinctiveness",
  "phonetic distinctiveness",
  "language safety",
  "sector fit",
  "financial/technology trust",
  "Swiss/global suitability without legal implication",
  "future world scalability",
  "shortness",
  "memorability",
  "Ahmad fit",
  "Pro Max/Alkon continuity",
  "legal risk",
];

export function evaluateBrandCandidateName(name: string): {
  decision: BrandDecision;
  riskLevel: BrandRiskLevel;
  reasons: string[];
} {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      decision: "needs_search",
      riskLevel: "unknown",
      reasons: ["No candidate name supplied."],
    };
  }

  if (blockedNamePattern.test(trimmedName)) {
    return {
      decision: "reject",
      riskLevel: "critical",
      reasons: [
        "Candidate is generic, close to protected/conflicting families, or implies unsafe legal/financial claims.",
      ],
    };
  }

  if (trimmedName.length < 4 || trimmedName.length > 14) {
    return {
      decision: "needs_search",
      riskLevel: "medium",
      reasons: ["Candidate needs distinctiveness and memorability review."],
    };
  }

  return {
    decision: "needs_search",
    riskLevel: "unknown",
    reasons: ["Candidate is only eligible for manual clearance tasks; it is not adopted."],
  };
}

export function evaluateBrandCandidate(candidate: BrandCandidate) {
  const tribunal = evaluateBrandCandidateName(candidate.name);

  return {
    candidateId: candidate.id,
    name: candidate.name,
    criteria: brandTribunalCriteria,
    decision:
      candidate.decision === "accept_for_internal_use"
        ? candidate.decision
        : tribunal.decision,
    riskLevel:
      candidate.riskLevel === "critical" || candidate.riskLevel === "high"
        ? candidate.riskLevel
        : tribunal.riskLevel,
    reasons: [...candidate.reasons, ...tribunal.reasons],
    ahmadApprovalRequired: true,
    adopted: false,
  };
}
