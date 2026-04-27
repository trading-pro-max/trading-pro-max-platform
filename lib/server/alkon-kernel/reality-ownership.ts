import type { RealityOwnershipClassification } from "./types";

export function getRealityOwnershipClassification(): RealityOwnershipClassification {
  return {
    status: "classified",
    layers: [
      {
        layer: "public_pro_max_reality",
        publicVisible: true,
        rule:
          "The world sees only public-safe Pro Max and Pro Max Trading surfaces.",
        surfaces: [
          "Home",
          "Trading Workspace",
          "Markets",
          "Plans",
          "Apps",
          "Support",
          "Pro Max Assistant",
          "Settings",
          "Diagnostics",
          "Journal / Coach",
        ],
      },
      {
        layer: "private_alkon_universe",
        publicVisible: false,
        rule:
          "Ahmad alone commands Alkon, Founder Command, Kernel, runtime, memory, legal gates, treasury discipline, and stations.",
        surfaces: [
          "Founder Command",
          "Alkon Kernel",
          "Creator Runtime",
          "Genesis",
          "Treasury",
          "Legal Gates",
          "Memory",
          "Stations",
          "Reality Production",
          "Self-Correction",
          "Source Law",
        ],
      },
      {
        layer: "invisible_operating_layer",
        publicVisible: false,
        rule:
          "Internal truth becomes sanitized readiness states and never exposes doctrine or private control surfaces.",
        surfaces: [
          "Product Truth translation",
          "Readiness states",
          "Plan states",
          "Safe summaries",
          "Public/private boundaries",
        ],
      },
    ],
    mixedRealityWithoutGate: "needs_review_or_blocked",
    publicReceivesSanitizedTruthOnly: true,
  };
}
