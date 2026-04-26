import { createLegitimacyReview } from "./dimensions";
import type {
  AlkonLegalGuardianLegitimacyResult,
  AlkonLegitimacyRequest,
} from "./types";

export function reviewLegalGuardianLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonLegalGuardianLegitimacyResult {
  const text = `${request.title} ${request.description} ${request.claimText ?? ""}`;
  const blocked =
    /financial advice|legal advice|tax filing|guaranteed profit|sharia certified|swiss company|official partner/i.test(
      text
    );
  const reviewRequired =
    blocked ||
    ["legal_claim", "partnership_claim", "media_content", "ad_spend", "support_response"].includes(
      request.actionCategory
    );
  const review = createLegitimacyReview(
    request,
    "legal_guardian_legitimacy",
    blocked ? "blocked" : reviewRequired ? "review_required" : "pass",
    blocked
      ? "Claim creates legal, tax, certification, partnership, or advice risk."
      : reviewRequired
        ? "Public claim or support promise needs Legal/Guardian review."
        : "No Legal/Guardian claim risk is detected.",
    {
      evidenceNeeded: ["risk disclosure", "privacy check", "claim source", "review note"],
      requiredReview: reviewRequired ? ["Legal review", "Guardian review"] : [],
      safeAlternative: "Use educational/readiness wording and avoid final legal/tax/financial authority.",
      memoryLesson: "Legal/Guardian legitimacy blocks advice, fake status, and unsafe public promises.",
    }
  );

  return {
    ...review,
    legalReviewRequired: reviewRequired,
    guardianReviewRequired: reviewRequired,
    safeWording:
      "Trading Pro Max is paper-safe/readiness-only; legal, tax, and financial decisions require qualified human review.",
    blockedReason: blocked ? "Unsafe legal, tax, financial, status, certification, or partnership claim." : undefined,
  };
}
