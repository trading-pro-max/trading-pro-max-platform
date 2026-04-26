export type TreasuryFundingMode =
  | "founder_funded"
  | "hybrid_funded"
  | "revenue_funded"
  | "growth_mode"
  | "blocked";

export type TreasuryLifeSnapshot = {
  snapshotId: "treasury_life_system_readiness";
  visibility: "private_founder_only";
  status: "readiness_only";
  fundingMode: TreasuryFundingMode;
  founderFundedStatus: "active_readiness";
  revenueFundedStatus: "future";
  hybridStatus: "planned";
  monthlyBurn: {
    currentKnownChf: 0;
    monthlyCapChf: 250;
    valuesArePlaceholders: true;
  };
  budgetCap: {
    currency: "CHF";
    initialCap: 250;
    founderMayChangeLater: true;
  };
  invoiceRegistryReadiness: "planned_manual_evidence";
  taxReserveReadiness: "readiness_only";
  vatThresholdWatch: "watch_only_no_status_claim";
  accountantReviewNeeded: true;
  autopayReadiness: "planned_disabled";
  paymentExecutionStatus: "disabled";
  bankCardSecretStatus: "forbidden";
  noBankCardDataStored: true;
  noPaymentExecution: true;
  noTaxFilingAutomation: true;
  nextSafeFinancialAction: string;
  publicExposure: false;
  productTruth: {
    billingActivationBlocked: true;
    paymentProviderInactive: true;
    noInvoicesSent: true;
    noSubscriptionsActive: true;
    noBankCardData: true;
  };
};
