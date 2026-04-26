import "server-only";

import type { BillingReadinessSnapshot } from "./types";

export function getBillingReadinessSnapshot(
  checkedAt = new Date().toISOString()
): BillingReadinessSnapshot {
  return {
    checkedAt,
    status: "blocked",
    provider: "future_only",
    checkoutActive: false,
    subscriptionsActive: false,
    invoicesActive: false,
    paymentCredentialsStored: false,
    planPricingDraft: "future",
    legalReviewRequired: true,
    founderApprovalRequired: true,
    performanceFeePublicUi: false,
  };
}
