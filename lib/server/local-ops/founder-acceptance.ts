import "server-only";

import type { FounderAcceptanceCategory, FounderAcceptanceRecord } from "./types";

const categories: FounderAcceptanceCategory[] = [
  "public_entry",
  "workstation",
  "chart",
  "execution",
  "assistant",
  "journal_coach",
  "settings",
  "diagnostics",
  "plan_clarity",
  "visual_identity",
  "local_operation",
];

export function getFounderAcceptanceMemorySnapshot(
  checkedAt = new Date().toISOString()
) {
  const records: FounderAcceptanceRecord[] = [];

  return {
    checkedAt,
    mode: "founder_acceptance_memory" as const,
    categories,
    allowedStates: [
      "accepted",
      "needs_polish",
      "confusing",
      "too_much",
      "missing",
      "blocked_by_design",
      "future",
    ] as const,
    records,
    currentSummary: {
      accepted: 0,
      needsPolish: 0,
      confusing: 0,
      missing: 0,
      blockedByDesign: 0,
      future: 0,
    },
    preferenceRules: [
      "no images unless explicitly requested",
      "public UI must stay simple",
      "Free is familiar and premium",
      "Pro/VIP carry differentiation",
      "Founder terms remain internal",
      "chart-first",
      "no clutter",
      "no fake claims",
      "no launch pressure",
    ],
    truth: {
      storesPersonalSensitiveData: false,
      storesSecrets: false,
      fakeAcceptanceRecords: false,
      launchApprovalRecorded: false,
    },
  };
}
