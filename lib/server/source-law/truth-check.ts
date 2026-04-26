import type { SourceLawTarget, TruthCheck } from "./types";

const blockedClaimPatterns: Array<[RegExp, string]> = [
  [/#1|number one|world'?s best|best in the world/i, "fake number-one or best claim"],
  [/global financial center/i, "global financial center claim"],
  [/licensed|regulated|FINMA approved|officially certified/i, "unproven regulated or licensed claim"],
  [/guaranteed profit|profit promise|highest win rate|win-rate/i, "profit or win-rate claim"],
  [/Swiss company|Swiss legal status|Sharia certified|Islamic certification/i, "unproven legal or certification claim"],
  [/official partnership|partnered with/i, "unproven partnership claim"],
  [/download now|app store|available on iOS|available on Android/i, "fake app availability claim"],
  [/live trading active|real money active|broker connected|billing active/i, "fake activation claim"],
];

export function evaluateTruthCheck(target: SourceLawTarget): TruthCheck {
  const text = `${target.title} ${target.description} ${target.claimText ?? ""}`;
  const falseClaimRisk = blockedClaimPatterns
    .filter(([pattern]) => pattern.test(text))
    .map(([, reason]) => reason);

  if (target.involvesFakeClaim) {
    falseClaimRisk.push("explicit fake claim");
  }

  if (target.involvesFakeNumberOneClaim) {
    falseClaimRisk.push("public number-one claim");
  }

  if (target.involvesLiveExecution) {
    falseClaimRisk.push("fake or premature live execution");
  }

  if (target.involvesRealMoney) {
    falseClaimRisk.push("fake or premature real-money routing");
  }

  if (target.involvesBrokerFeed) {
    falseClaimRisk.push("fake or premature broker/feed activation");
  }

  if (target.involvesBilling) {
    falseClaimRisk.push("fake or premature billing activation");
  }

  if (falseClaimRisk.length > 0) {
    return {
      truthStatus: "blocked",
      falseClaimRisk,
      safeAlternative:
        "Use paper-safe, planned, inactive, future, readiness, AI-guided, learning-first, or transparent wording.",
      decision: "block",
    };
  }

  if (!target.hasTruthProof && target.publicVisible) {
    return {
      truthStatus: "needs_review",
      falseClaimRisk: [],
      safeAlternative:
        "Keep public wording compact and Product Truth checked before closure.",
      decision: "needs_proof",
    };
  }

  return {
    truthStatus: "true",
    falseClaimRisk: [],
    safeAlternative:
      "Truth preserved: no fake activation, public number-one claim, profit promise, or unproven status.",
    decision: "aligned_now",
  };
}
