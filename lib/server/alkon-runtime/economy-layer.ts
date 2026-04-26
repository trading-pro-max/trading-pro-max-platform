import type {
  AlkonRuntimeEconomy,
  AlkonRuntimeInput,
  AlkonRuntimeLawDecision,
} from "./types";

export function evaluateAlkonRuntimeEconomy(
  input: AlkonRuntimeInput,
  law: AlkonRuntimeLawDecision
): AlkonRuntimeEconomy {
  const isEconomic =
    input.category === "invoice" ||
    input.category === "treasury_event" ||
    input.category === "tax_event" ||
    input.requestsPaymentExecution ||
    input.containsBankCardData;

  if (!isEconomic) {
    return {
      economyDecision: "not_applicable",
      fundingMode: "not_applicable",
      budgetImpact: "No treasury effect.",
      taxReserveNeed: "Not applicable.",
      accountantReviewNeeded: false,
      safeFinancialAction: "No financial action prepared.",
      paymentExecutionStatus: "disabled",
      bankCardDataStatus: "forbidden",
    };
  }

  if (
    law.lawDecision === "black_holed" ||
    input.requestsPaymentExecution ||
    input.containsBankCardData
  ) {
    return {
      economyDecision: "black_holed",
      fundingMode: "blocked",
      budgetImpact: "Blocked because payment execution or bank/card data is forbidden.",
      taxReserveNeed: "No tax action; block and report only.",
      accountantReviewNeeded: true,
      safeFinancialAction:
        "Create an invoice/budget/reserve readiness note; never execute payment from the app.",
      paymentExecutionStatus: "disabled",
      bankCardDataStatus: "forbidden",
    };
  }

  if (!input.hasInvoice || !input.hasBudget || !input.hasReserve) {
    return {
      economyDecision: "review_required",
      fundingMode: "founder_funded",
      budgetImpact: "Invoice, category, budget, and reserve evidence are incomplete.",
      taxReserveNeed: "Check whether tax reserve or VAT watch applies.",
      accountantReviewNeeded: true,
      safeFinancialAction:
        "Gather invoice, category, budget, reserve, and Founder review evidence.",
      paymentExecutionStatus: "disabled",
      bankCardDataStatus: "forbidden",
    };
  }

  return {
    economyDecision: "founder_approval_required",
    fundingMode: "founder_funded",
    budgetImpact: `${input.amount ?? 0} ${input.currency ?? "CHF"} requires Founder-controlled review.`,
    taxReserveNeed: "Reserve impact must be reviewed before any off-app payment.",
    accountantReviewNeeded: input.category === "tax_event",
    safeFinancialAction:
      "Prepare a private payment-readiness report; Founder handles any real payment outside the app.",
    paymentExecutionStatus: "disabled",
    bankCardDataStatus: "forbidden",
  };
}
