import "server-only";

import type { DesktopDistributionGateCheck } from "./types";

export function getProductionSigningGate(): DesktopDistributionGateCheck {
  return {
    id: "production_signing_gate",
    label: "Production signing gate",
    state: "future_gate",
    status: "Production signing remains a future gate.",
    checks: [
      "Signing is not active.",
      "Signing certificates are absent/unknown.",
      "Signing requires Ahmad decision.",
      "No production signing script exists.",
      "No signed installer exists.",
    ],
    evidence: [
      "Private Desktop Packaging Gate.",
      "Private Desktop Local Build Dry Run.",
      "package.json scripts.",
    ],
    risk: "Signing can imply release readiness and must not be performed before Ahmad approves the path.",
    nextAction: "Keep signing blocked until a future signing gate is explicitly approved.",
  };
}
