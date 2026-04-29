import "server-only";
import { getNeverAloneActions } from "./never-alone-actions";
import { getSafeInternalActions } from "./safe-internal-actions";

export function getFounderDecisionMatrix() {
  const safeInternal = getSafeInternalActions();
  const neverAlone = getNeverAloneActions();

  return {
    safeInternalCount: safeInternal.length,
    approvalRequiredCount: neverAlone.length,
    neverAloneCount: neverAlone.length,
    categories: [
      "money_payment_receiving_funds",
      "real_trading_broker",
      "legal_official_claims",
      "public_launch_customers",
      "brand_domains_ownership",
      "personal_data_secrets_documents",
      "external_accounts_integrations",
      "irreversible_destructive_actions",
      "final_founder_decisions",
      "safe_internal_work",
    ] as const,
    productTruthOverride: true,
    universeKernelEnforced: true,
  };
}
