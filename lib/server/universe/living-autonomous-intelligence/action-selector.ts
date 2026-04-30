import "server-only";

import type { SelectedIntelligentAction } from "./types";

export function getAlKawnActionSelector(): SelectedIntelligentAction {
  return {
    id: "living_intelligence_report_refresh",
    title: "Refresh living intelligence report and private desktop summary",
    layer: "Living Autonomous Intelligence",
    reason:
      "Selected because Product Truth and privacy are first, and the safest valuable action is an internal report/UI truth refresh.",
    risk: "low",
    verdict: "execute_internal",
    validationPlan: [
      "Run TypeScript.",
      "Run ESLint.",
      "Run focused living autonomous intelligence regression.",
      "Run full regression.",
      "Run smoke routes.",
    ],
    reportPath: "reports/intelligence/al-kawn-living-autonomous-intelligence.md",
    nextAction: "Ahmad reviews /desktop/kawn and decides whether to start Local Day One.",
  };
}
