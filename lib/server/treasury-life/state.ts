import type { TreasuryLifeSnapshot } from "./types";

export function getTreasuryLifeSnapshot(): TreasuryLifeSnapshot {
  return {
    snapshotId: "treasury_life_system_readiness",
    visibility: "private_founder_only",
    status: "readiness_only",
    fundingMode: "founder_funded",
    founderFundedStatus: "active_readiness",
    revenueFundedStatus: "future",
    hybridStatus: "planned",
    monthlyBurn: {
      currentKnownChf: 0,
      monthlyCapChf: 250,
      valuesArePlaceholders: true,
    },
    budgetCap: {
      currency: "CHF",
      initialCap: 250,
      founderMayChangeLater: true,
    },
    invoiceRegistryReadiness: "planned_manual_evidence",
    taxReserveReadiness: "readiness_only",
    vatThresholdWatch: "watch_only_no_status_claim",
    accountantReviewNeeded: true,
    autopayReadiness: "planned_disabled",
    paymentExecutionStatus: "disabled",
    bankCardSecretStatus: "forbidden",
    noBankCardDataStored: true,
    noPaymentExecution: true,
    noTaxFilingAutomation: true,
    nextSafeFinancialAction:
      "Keep invoices, budget categories, tax reserve notes, and payment decisions as manual Founder review outside the web app.",
    publicExposure: false,
    productTruth: {
      billingActivationBlocked: true,
      paymentProviderInactive: true,
      noInvoicesSent: true,
      noSubscriptionsActive: true,
      noBankCardData: true,
    },
  };
}

export function getTreasuryLifeReadiness() {
  const snapshot = getTreasuryLifeSnapshot();

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noPayments: true,
    noBankCardData: true,
    noSecrets: true,
    snapshot,
  };
}
