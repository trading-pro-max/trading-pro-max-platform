import type { TreasuryDiscipline } from "./types";

export function getTreasuryDiscipline(): TreasuryDiscipline {
  return {
    treasuryStatus: "readiness_only",
    bankCardDataInCode: false,
    paymentExecutionFromApp: false,
    ahmadApprovalRequiredForPayment: true,
    rules: [
      "no money without invoice",
      "no invoice without category",
      "no category without budget",
      "no payment without Ahmad approval",
      "no bank/card data in code",
      "no payment execution from app",
      "tax reserve readiness only",
      "VAT watch readiness only",
      "founder-funded / revenue-funded states remain readiness until gates pass",
    ],
  };
}
