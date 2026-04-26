import { createLegitimacyReview } from "./dimensions";
import type { AlkonLegitimacyRequest, AlkonTruthLegitimacyResult } from "./types";

const HARD_TRUTH_BLOCKERS = [
  /fake\s+(activation|launch|users?|revenue|downloads?|metrics?|partnership)/i,
  /guaranteed?\s+(profit|win)|win[-\s]?rate/i,
  /sharia|islamic certification/i,
  /swiss (company|legal status)/i,
  /app store|play store|apk|ipa/i,
  /live execution|real money|broker|feed|billing active/i,
];

export function reviewTruthLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonTruthLegitimacyResult {
  const text = `${request.title} ${request.description} ${request.claimText ?? ""}`;
  const fakeClaim = HARD_TRUTH_BLOCKERS.some((pattern) => pattern.test(text));
  const blockedImpact = [
    "billing",
    "live",
    "broker_feed",
    "launch",
    "real_money",
  ].includes(request.productTruthImpact ?? "none");
  const blackHole =
    request.actionCategory === "live_execution_activation" ||
    request.actionCategory === "real_money_activation" ||
    request.actionCategory === "billing_activation" ||
    request.actionCategory === "broker_feed_activation" ||
    request.actionCategory === "production_activation";
  const outcome = blackHole
    ? "black_holed"
    : fakeClaim || blockedImpact
      ? "blocked"
      : "pass";
  const review = createLegitimacyReview(
    request,
    "truth_legitimacy",
    outcome,
    outcome === "pass"
      ? "No false activation, launch, revenue, legal, certification, app-store, or profit claim is present."
      : "The action conflicts with Product Truth or makes a false/premature claim.",
    {
      requiredReview: outcome === "pass" ? [] : ["Product Truth review"],
      safeAlternative:
        "Use public-safe wording: planned, inactive, future, paper-safe, readiness-only, or blocked.",
      memoryLesson: "Product Truth decides reality before authority can be used.",
    }
  );

  return {
    ...review,
    falseClaimRisk: outcome === "black_holed" ? "black_hole" : outcome === "blocked" ? "critical" : "low",
    productTruthImpact: request.productTruthImpact ?? "none",
    safePublicWording:
      "Paper-safe and readiness-only remain truthful; live, billing, broker/feed, production, and real money stay inactive.",
  };
}
