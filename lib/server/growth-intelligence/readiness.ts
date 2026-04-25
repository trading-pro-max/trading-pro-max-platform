import "server-only";

import type { GrowthReadinessSignal } from "./types";

export function getGrowthIntelligenceReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const signals: GrowthReadinessSignal[] = [
    {
      key: "free_to_pro",
      label: "Free to Pro conversion readiness",
      status: "partial",
      noRealMetrics: true,
      noDarkPattern: true,
      safeNextAction: "Clarify Pro value without billing activation or fake entitlement.",
    },
    {
      key: "pro_to_vip",
      label: "Pro to VIP value readiness",
      status: "planned",
      noRealMetrics: true,
      noDarkPattern: true,
      safeNextAction: "Keep VIP value as premium planned capability until entitlement support exists.",
    },
    {
      key: "assistant_engagement",
      label: "TPM Assistant engagement readiness",
      status: "partial",
      noRealMetrics: true,
      noDarkPattern: true,
      safeNextAction: "Improve usefulness through safe explanations, not pressure or predictions.",
    },
    {
      key: "journal_retention",
      label: "Journal retention readiness",
      status: "planned",
      noRealMetrics: true,
      noDarkPattern: true,
      safeNextAction: "Add persistence later without storing sensitive private data unnecessarily.",
    },
  ];

  return {
    checkedAt,
    mode: "growth_intelligence_readiness" as const,
    signals,
    truth: {
      realAnalytics: "not_present" as const,
      fakeConversionMetrics: false,
      manipulationAllowed: false,
      pressureToTradeAllowed: false,
      valuePrinciple: "usefulness_clarity_trust_safety_education_premium_experience",
    },
  };
}
