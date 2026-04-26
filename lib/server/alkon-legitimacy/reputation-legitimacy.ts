import { createLegitimacyReview } from "./dimensions";
import type {
  AlkonLegitimacyRequest,
  AlkonReputationLegitimacyResult,
} from "./types";

export function reviewReputationLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonReputationLegitimacyResult {
  const text = `${request.title} ${request.description} ${request.claimText ?? ""}`;
  const riskyClaim =
    /profit|signal|win[-\s]?rate|guarantee|casino|launch now|billing active|mobile available|download now/i.test(
      text
    );
  const mediaRisk =
    request.actionCategory === "media_content" ||
    request.actionCategory === "social_publishing" ||
    request.actionCategory === "ad_spend";
  const outcome = request.actionCategory === "social_publishing"
    ? "blocked"
    : riskyClaim
      ? "blocked"
      : mediaRisk
        ? "review_required"
        : "pass";
  const review = createLegitimacyReview(
    request,
    "reputation_legitimacy",
    outcome,
    outcome === "pass"
      ? "No risky hype, signal bait, false availability, or reputation hazard detected."
      : "Public communication needs claims firewall and reputation review.",
    {
      requiredReview: outcome === "pass" ? [] : ["Claims firewall", "Media review", "Guardian review"],
      safeAlternative: "Use factual readiness language and keep publishing inactive.",
      memoryLesson: "Reputation is protected by truthful public claims and inactive publishing gates.",
    }
  );

  return {
    ...review,
    publicTrustRisk: outcome === "pass" ? "low" : "high",
    claimsReviewRequired: outcome !== "pass",
  };
}
