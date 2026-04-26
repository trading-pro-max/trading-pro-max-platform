import { createLegitimacyReview } from "./dimensions";
import type {
  AlkonFinancialLegitimacyResult,
  AlkonLegitimacyRequest,
} from "./types";

const FINANCIAL_CATEGORIES = new Set([
  "treasury_payment",
  "founder_reimbursement",
  "tax_reserve_adjustment",
  "budget_change",
  "ad_spend",
  "billing_activation",
]);

export function reviewFinancialLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonFinancialLegitimacyResult {
  const isFinancial = FINANCIAL_CATEGORIES.has(request.actionCategory);
  const requestsPaymentExecution =
    /pay now|execute payment|charge card|autopay now|bank transfer/i.test(
      `${request.title} ${request.description}`
    );
  const requestsCardBankSecret =
    /card number|cvv|bank password|iban secret|payment credential|api key|token/i.test(
      `${request.title} ${request.description}`
    );
  const overCap = (request.amount ?? 0) > 250;
  const missingInvoice = isFinancial && !request.hasInvoice;
  const outcome = requestsCardBankSecret || requestsPaymentExecution
    ? "black_holed"
    : request.actionCategory === "billing_activation"
      ? "black_holed"
      : overCap
        ? "founder_approval_required"
        : missingInvoice
          ? "review_required"
          : isFinancial
            ? "review_required"
            : "pass";
  const review = createLegitimacyReview(
    request,
    "financial_legitimacy",
    outcome,
    outcome === "black_holed"
      ? "Payment execution or bank/card/secret handling from code is forbidden."
      : missingInvoice
        ? "Financial action needs invoice/category/budget evidence before approval."
        : overCap
          ? "Requested amount exceeds the 250 CHF initial monthly cap."
          : isFinancial
            ? "Financial action remains readiness/review-only."
            : "No financial execution or treasury risk is present.",
    {
      evidenceNeeded: ["invoice/category", "budget cap", "reserve/tax check", "Founder approval note"],
      requiredReview:
        outcome === "pass" ? [] : ["Founder treasury review", "accountant review if tax/VAT relevant"],
      safeAlternative: "Record invoice/category/readiness and pay manually outside the web app after review.",
      memoryLesson: "The product may model treasury readiness but never execute payments or store card/bank data.",
    }
  );

  return {
    ...review,
    fundingMode: request.fundingMode,
    reserveImpact: isFinancial ? "review" : "none",
    monthlyBurnImpact: overCap ? "over_cap" : isFinancial ? "within_cap" : "none",
    revenueCoverageImpact:
      request.fundingMode === "revenue_funded" ? "covered" : isFinancial ? "not_covered" : "not_required",
    taxReserveRequired:
      request.actionCategory === "tax_reserve_adjustment" ||
      /tax|vat|invoice/i.test(`${request.title} ${request.description}`),
    accountantReviewRequired:
      request.actionCategory === "tax_reserve_adjustment" ||
      /tax|vat|legal accounting/i.test(`${request.title} ${request.description}`),
    safePaymentPath:
      "Manual Founder review outside the app; no payment execution, no card data, no bank credentials.",
  };
}
