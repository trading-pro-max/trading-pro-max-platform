import "server-only";

import type { TrustGovernorDecision } from "./types";

const blockedPatterns = [
  "guaranteed profit",
  "win-rate",
  "risk-free",
  "live trading active",
  "billing active",
  "real money enabled",
  "official partner",
  "sharia certified",
  "vip active",
  "institutional available",
  "fake users",
  "fake revenue",
  "fake metrics",
];

export function evaluateTrustGovernorText(
  text: string,
  checkedAt = new Date().toISOString()
): TrustGovernorDecision {
  const normalized = text.toLowerCase();
  const reasons = blockedPatterns.filter((pattern) => normalized.includes(pattern));

  if (reasons.length > 0) {
    return {
      checkedAt,
      outcome: "blocked",
      reasons,
      safeAlternative:
        "Use truthful readiness language, remove performance/activation/partnership claims, and route for review.",
      requiredReviews: ["Guardian", "Legal", "Product Truth"],
    };
  }

  if (normalized.includes("pricing") || normalized.includes("partnership")) {
    return {
      checkedAt,
      outcome: "founder_approval_required",
      reasons: ["sensitive commercial or partnership language"],
      safeAlternative: "Keep wording internal and mark as future review only.",
      requiredReviews: ["Legal", "Guardian", "Founder"],
    };
  }

  if (normalized.includes("ai") || normalized.includes("assistant")) {
    return {
      checkedAt,
      outcome: "review_required",
      reasons: ["assistant/AI wording must avoid certainty and advice claims"],
      safeAlternative: "Describe bounded platform guidance only.",
      requiredReviews: ["Guardian", "Legal"],
    };
  }

  return {
    checkedAt,
    outcome: "safe",
    reasons: ["truthful readiness-oriented wording"],
    safeAlternative: "Keep concise and avoid pressure to trade.",
    requiredReviews: [],
  };
}

export function getTrustGovernorSnapshot(checkedAt = new Date().toISOString()) {
  return {
    checkedAt,
    mode: "ethics_trust_governor_readiness" as const,
    checks: [
      "is it truthful?",
      "is it manipulative?",
      "does it imply guaranteed profit?",
      "does it hide a fee?",
      "does it pressure trading?",
      "does it expose private data?",
      "does it use fake scarcity?",
      "does it overclaim AI?",
      "does it misuse Swiss identity?",
      "does it imply partnership without contract?",
      "does it respect user plan truth?",
    ],
    samples: {
      guaranteedProfit: evaluateTrustGovernorText("Guaranteed profit and win-rate", checkedAt),
      safeAssistant: evaluateTrustGovernorText("TPM Assistant explains paper-safe readiness", checkedAt),
      partnership: evaluateTrustGovernorText("Swiss precision partnership concept", checkedAt),
    },
    integrations: [
      "Guardian",
      "Legal",
      "Product Truth",
      "Content Factory",
      "Assistant",
      "Growth Intelligence",
      "Codex Task Compiler",
    ],
    truth: {
      privateDataExposureAllowed: false,
      hiddenFeesAllowed: false,
      pressureToTradeAllowed: false,
      fakePartnershipAllowed: false,
    },
  };
}
