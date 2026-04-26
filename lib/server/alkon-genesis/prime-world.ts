import type { PrimeWorldSnapshot } from "./types";

export function getPrimeWorldSnapshot(): PrimeWorldSnapshot {
  return {
    worldId: "pro_max_trading_prime_world",
    name: "Pro Max Trading",
    motherBrand: "Pro Max",
    legacyProjectName: "Trading Pro Max",
    status: "prime_world_protected",
    localDayOneRequired: true,
    livingMarketCoreReadinessRequired: true,
    assistantReadinessRequired: true,
    visualAcceptanceRequired: true,
    realityAuditRequired: true,
    safeCleanupRequired: true,
    productTruthStableRequired: true,
    alkonPrivateBoundaryStableRequired: true,
    testsPassingRequired: true,
    gitCleanRequired: true,
    currentBlockers: [
      "Local Day One and acceptance remain the protected near-term focus.",
      "Living Market Core and chart-first workspace quality remain protected.",
      "Human visual acceptance is still required before final visual claims.",
      "New worlds must remain seed/prototype-readiness only until Prime World acceptance is established.",
    ],
    protectedPriorities: [
      "Local Day One",
      "Living Market Core readiness",
      "Pro Max Assistant readiness",
      "visual acceptance",
      "Reality Audit",
      "Safe Cleanup",
      "Product Truth stability",
      "Alkon private boundary stability",
      "tests passing",
      "Git clean",
    ],
    newWorldLimit: "seed_or_prototype_readiness_only",
  };
}
