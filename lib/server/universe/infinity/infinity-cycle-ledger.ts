import "server-only";

import type { InfinityCycleLedgerEntry } from "./types";

export function getInfinityCycleLedger(): InfinityCycleLedgerEntry[] {
  return [
    {
      id: "phase_1_preparation_closed",
      phase: "Infinity Mode Preparation",
      result: "closed_ready_for_controlled_activation",
      evidence: [
        "Wake State exists.",
        "Daily Work Loop exists.",
        "Product Truth controls every cycle.",
        "No uncontrolled infinite loop.",
      ],
      blocked: [
        "public launch",
        "money",
        "broker",
        "legal claims",
        "external accounts",
      ],
    },
    {
      id: "phase_2_controlled_activation_closed",
      phase: "Infinity Mode controlled activation",
      result: "closed_controlled_internal_active",
      evidence: [
        "Infinity Mode is active only for private internal cycles.",
        "Safe internal cycles only.",
        "No background daemon.",
        "Cycle stops and waits for safe trigger.",
      ],
      blocked: [
        "public automation",
        "money automation",
        "broker automation",
        "legal automation",
        "external account automation",
      ],
    },
  ];
}
