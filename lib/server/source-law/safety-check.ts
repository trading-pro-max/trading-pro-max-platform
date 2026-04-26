import type { SafetyCheck, SourceLawTarget } from "./types";

export function evaluateSafetyCheck(target: SourceLawTarget): SafetyCheck {
  const blockedReasons: string[] = [];
  const requiredReview: string[] = [];

  if (target.involvesSecrets) blockedReasons.push("secrets exposure risk");
  if (target.involvesBankCardData) blockedReasons.push("bank or card data risk");
  if (target.involvesShellExecution) blockedReasons.push("web shell execution request");
  if (target.involvesDirectCodexExecution) {
    blockedReasons.push("direct Codex execution from web app");
  }
  if (target.exposesAlkonPublicly) blockedReasons.push("public Alkon exposure");
  if (target.involvesLiveExecution) blockedReasons.push("live execution activation");
  if (target.involvesRealMoney) blockedReasons.push("real-money activation");
  if (target.involvesBrokerFeed) blockedReasons.push("broker/feed activation");
  if (target.involvesBilling) blockedReasons.push("billing activation");
  if (target.weakensSecurity) blockedReasons.push("auth or security weakening");
  if (target.violatesPrivacy) blockedReasons.push("privacy violation");
  if (target.preciseHiddenTracking) blockedReasons.push("precise hidden tracking");

  if (target.regulatedFinancialAction) {
    requiredReview.push("legal/regulatory review");
  }

  if (blockedReasons.length > 0) {
    return {
      safetyStatus: "blocked",
      blockedReasons,
      requiredReview,
      decision: "block",
    };
  }

  if (requiredReview.length > 0) {
    return {
      safetyStatus: "review_required",
      blockedReasons,
      requiredReview,
      decision: "needs_founder_review",
    };
  }

  return {
    safetyStatus: "safe",
    blockedReasons,
    requiredReview,
    decision: "aligned_now",
  };
}
