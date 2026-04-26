import "server-only";

import type { BetaReadinessSnapshot } from "./types";

export function getBetaReadinessSnapshot(
  checkedAt = new Date().toISOString()
): BetaReadinessSnapshot {
  return {
    checkedAt,
    status: "not_ready",
    betaType: "future_private_paper_beta",
    requiredBeforeBeta: [
      "local day pass",
      "visual acceptance",
      "code audit done",
      "cleanup done",
      "security readiness",
      "support readiness",
      "legal readiness",
      "budget readiness",
      "staging readiness",
      "waitlist readiness",
      "rollback plan",
      "Founder final decision",
    ],
    noRealMoney: true,
    noLiveExecution: true,
    noPublicLaunch: true,
  };
}
