import type {
  AlkonLegitimacyDimension,
  AlkonLegitimacyRequest,
  AlkonLegitimacyReview,
  AlkonLegitimacyReviewOutcome,
} from "./types";

export const LEGITIMACY_DIMENSIONS: AlkonLegitimacyDimension[] = [
  "purpose_legitimacy",
  "truth_legitimacy",
  "user_legitimacy",
  "financial_legitimacy",
  "security_legitimacy",
  "timing_legitimacy",
  "reversibility_legitimacy",
  "reputation_legitimacy",
  "legal_guardian_legitimacy",
  "founder_responsibility",
];

export function createLegitimacyReview(
  request: AlkonLegitimacyRequest,
  dimension: AlkonLegitimacyDimension,
  outcome: AlkonLegitimacyReviewOutcome,
  reason: string,
  options: {
    evidenceNeeded?: string[];
    safeAlternative?: string;
    requiredReview?: string[];
    memoryLesson?: string;
  } = {}
): AlkonLegitimacyReview {
  return {
    dimension,
    outcome,
    reason,
    evidenceNeeded: options.evidenceNeeded ?? [
      "Product Truth status",
      "Founder intent summary",
      "public/private boundary check",
    ],
    safeAlternative:
      options.safeAlternative ??
      `Keep ${request.title} as read-only readiness or draft review until gates pass.`,
    requiredReview: options.requiredReview ?? [],
    memoryLesson:
      options.memoryLesson ??
      `${dimension} must be checked before ${request.actionCategory} can move forward.`,
  };
}

export function getDimensionsStatus() {
  return LEGITIMACY_DIMENSIONS.reduce(
    (status, dimension) => ({ ...status, [dimension]: "ready" as const }),
    {} as Record<AlkonLegitimacyDimension, "ready">
  );
}
