import "server-only";

import { getAlKawnActionSelector } from "./action-selector";
import type { IntelligenceReport } from "./types";

export function getAlKawnIntelligenceReport(): IntelligenceReport {
  const selected = getAlKawnActionSelector();

  return {
    path: "reports/intelligence/al-kawn-living-autonomous-intelligence.md",
    cycleReportPath: "reports/intelligence/al-kawn-intelligence-cycle-report.md",
    selectedActionPath: "reports/intelligence/al-kawn-intelligence-selected-action.md",
    nextActionPath: "reports/intelligence/al-kawn-intelligence-next-action.md",
    triggerSource: "model_safe_trigger",
    observedState: "Wake, Daily Work Loop, Desktop, Local Auth, Product Truth, Kernel, Infinity, Operator, Rights, and Total Existence are internally observable.",
    selectedAction: selected.title,
    validationResult: "Focused and full validation required before closure.",
    didNotDo: [
      "No public launch.",
      "No billing, payments, receiving money, withdrawals, bank transfers, real money, or broker execution.",
      "No legal approval, FINMA approval, or licensed/regulated claim.",
      "No external accounts, external uploads, hidden daemon, or uncontrolled loop.",
      "No secrets stored in Git or desktop bundle.",
    ],
  };
}
