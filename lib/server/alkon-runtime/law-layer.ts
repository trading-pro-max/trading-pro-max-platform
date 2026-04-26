import type { AlkonRuntimeInput, AlkonRuntimeLawDecision } from "./types";

const dangerousCategories = new Set<AlkonRuntimeInput["category"]>([
  "billing_request",
  "live_request",
  "broker_feed_request",
  "real_money_request",
  "social_publish_request",
]);

function claimText(input: AlkonRuntimeInput) {
  return `${input.title} ${input.description} ${input.claimText ?? ""}`.toLowerCase();
}

export function decideAlkonRuntimeLaw(
  input: AlkonRuntimeInput
): AlkonRuntimeLawDecision {
  const text = claimText(input);
  const failedRules: string[] = [];
  const requiredReviews: string[] = [];

  if (dangerousCategories.has(input.category)) {
    failedRules.push("No Dangerous Activation Rule");
  }

  if (input.requiresSecrets || text.includes("raw secret") || text.includes("api key")) {
    failedRules.push("Secrets Authority Rule");
  }

  if (input.containsBankCardData || text.includes("cvv") || text.includes("card number")) {
    failedRules.push("No Payment Execution Rule");
  }

  if (input.requestsPaymentExecution) {
    failedRules.push("No Payment Execution Rule");
  }

  if (input.requestsTaxFilingAutomation) {
    failedRules.push("No Tax Filing Automation Rule");
    requiredReviews.push("accountant_review");
  }

  if (input.publicVisible && (text.includes("alkon") || text.includes("founder command"))) {
    failedRules.push("No Public Alkon Rule");
  }

  if (input.requestsImageGeneration && !input.explicitImageApproval) {
    failedRules.push("No Images Rule");
  }

  if (
    text.includes("guaranteed profit") ||
    text.includes("win-rate") ||
    text.includes("swiss company") ||
    text.includes("sharia certified") ||
    text.includes("app store download") ||
    text.includes("fake")
  ) {
    failedRules.push("No Fake Claims Rule");
    requiredReviews.push("legal_guardian_review");
  }

  if (failedRules.some((rule) =>
    [
      "No Dangerous Activation Rule",
      "Secrets Authority Rule",
      "No Payment Execution Rule",
      "No Public Alkon Rule",
    ].includes(rule)
  )) {
    return {
      lawDecision: "black_holed",
      failedRules,
      requiredReviews,
      safeAlternative:
        "Create a private readiness report, explain the block, and propose a safe local draft or Product Truth update.",
      blockedReason:
        "The request crosses a hard Alkon runtime law: dangerous activation, secrets, payment execution, or public private-system exposure.",
    };
  }

  if (failedRules.length > 0) {
    return {
      lawDecision: "blocked",
      failedRules,
      requiredReviews,
      safeAlternative:
        "Replace the request with code/docs/tests/readiness work that preserves Product Truth and public/private boundaries.",
      blockedReason: failedRules.join(", "),
    };
  }

  if (input.category === "invoice" || input.category === "media_message" || input.category === "claim_risk") {
    return {
      lawDecision: "review_required",
      failedRules,
      requiredReviews: [
        input.category === "invoice" ? "treasury_review" : "claims_firewall_review",
      ],
      safeAlternative: "Keep this as Founder/private readiness until review gates pass.",
      blockedReason: null,
    };
  }

  return {
    lawDecision: input.publicVisible ? "public_safe" : "readiness_only",
    failedRules,
    requiredReviews,
    safeAlternative: "Proceed as read-only local readiness with validation proof.",
    blockedReason: null,
  };
}
