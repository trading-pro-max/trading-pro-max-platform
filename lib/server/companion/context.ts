import "server-only";

import type { CompanionContextInput, CompanionContextSnapshot } from "./types";

export function getCompanionContextSnapshot(
  input: CompanionContextInput = {},
  checkedAt = new Date().toISOString()
): CompanionContextSnapshot {
  return {
    checkedAt,
    mode: "companion_context_engine",
    source: input.sessionState === "authenticated_safe" ? "authenticated_safe" : "default_safe",
    route: input.route ?? "/en",
    selectedAsset: input.selectedAsset ?? "EUR/USD",
    timeframe: input.timeframe ?? "1m",
    marketFeedState: "fallback_first",
    executionTruth: {
      paperMode: "available",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked",
      feedActivation: "blocked",
    },
    account: {
      sessionState: input.sessionState ?? "anonymous",
      planTier: input.planTier ?? "demo_free",
      accountType: "standard",
    },
    preferences: {
      language: input.language ?? "en",
      theme: input.theme ?? "system",
      skillLevel: "unknown",
    },
    diagnostics: {
      readiness: "ready",
      feedbackState: "available_guarded",
      aiIqContextQuality: "bounded",
    },
    safety: {
      secretsIncluded: false,
      privateSensitiveDataIncluded: false,
      brokerCredentialsIncluded: false,
      rawTokensIncluded: false,
      canExecuteTrades: false,
      canActivateLive: false,
      guaranteeClaimsAllowed: false,
      winRateClaimsAllowed: false,
    },
    guidanceBoundaries: [
      "Explain platform state and safe next steps.",
      "Do not execute trades or enable live execution.",
      "Do not activate broker/feed or billing.",
      "Do not claim guaranteed signals, win rates, or financial advice.",
      "Do not bypass auth, entitlement, or safety boundaries.",
    ],
  };
}
