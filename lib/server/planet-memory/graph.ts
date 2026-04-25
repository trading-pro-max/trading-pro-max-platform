import "server-only";

import type { PlanetMemoryGraphSnapshot, PlanetMemoryNode } from "./types";

const nodes: PlanetMemoryNode[] = [
  {
    id: "chart_dominance",
    type: "founder_preference",
    label: "Chart dominance",
    summary: "Workstation must keep chart as the primary visual center.",
    privateDataStored: false,
    secretsStored: false,
  },
  {
    id: "public_language",
    type: "risk",
    label: "Public language guard",
    summary: "Public UI must use Free / Pro / VIP / Institutional and avoid internal governance terms.",
    privateDataStored: false,
    secretsStored: false,
  },
  {
    id: "assistant_safety",
    type: "feature",
    label: "TPM Assistant safety",
    summary: "Assistant is linked to Product Truth, plan entitlements, state explanations, Guardian, and Legal.",
    privateDataStored: false,
    secretsStored: false,
  },
  {
    id: "visual_acceptance",
    type: "visual_acceptance_note",
    label: "Human visual acceptance",
    summary: "Ahmad human acceptance is required before final visual approval.",
    privateDataStored: false,
    secretsStored: false,
  },
  {
    id: "blocked_live",
    type: "blocked_state",
    label: "Live execution blocked",
    summary: "Live execution remains a hard blocked product-truth state.",
    privateDataStored: false,
    secretsStored: false,
  },
];

export function getPlanetMemoryGraphSnapshot(
  checkedAt = new Date().toISOString()
): PlanetMemoryGraphSnapshot {
  return {
    checkedAt,
    mode: "planet_memory_graph_readiness",
    nodes,
    edges: [
      { from: "chart_dominance", to: "visual_acceptance", relation: "requires proof" },
      { from: "public_language", to: "assistant_safety", relation: "constrains wording" },
      { from: "assistant_safety", to: "blocked_live", relation: "explains safely" },
      { from: "blocked_live", to: "public_language", relation: "must be public-safe" },
    ],
    truth: {
      privateUserDataStored: false,
      secretsStored: false,
      surveillance: "not_enabled",
      readinessOnly: true,
    },
  };
}
