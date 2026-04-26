import "server-only";

import type { LegalReadinessSnapshot } from "./types";

export function getLegalReadinessSnapshot(
  checkedAt = new Date().toISOString()
): LegalReadinessSnapshot {
  return {
    checkedAt,
    status: "partial",
    requiredPages: [
      "privacy policy readiness",
      "terms readiness",
      "risk disclaimer readiness",
      "no financial advice policy",
      "no profit guarantee policy",
      "refund policy readiness",
      "trading risk disclosure",
    ],
    noFinancialAdvicePolicy: true,
    noProfitGuaranteePolicy: true,
    tradingRiskDisclosureRequired: true,
    swissCompanyStatusClaimAllowed: false,
    shariaCertificationClaimAllowed: false,
    partnershipClaimAllowedWithoutContract: false,
    legalReviewRequired: true,
  };
}
