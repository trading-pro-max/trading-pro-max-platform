import "server-only";

import type { DesktopDistributionGateCheck } from "./types";

export function getDistributionPreviousReportCheck(): DesktopDistributionGateCheck {
  return {
    id: "distribution_previous_report_check",
    label: "Previous desktop gates",
    state: "ready_with_notes",
    status: "Packaging Gate, Local Auth Gate, Packaging Preparation, and Local Build Dry Run reports exist.",
    checks: [
      "reports/al-kawn-private-desktop-packaging-gate.md exists.",
      "reports/al-kawn-local-packaged-auth-gate.md exists.",
      "reports/al-kawn-private-desktop-packaging-preparation.md exists.",
      "reports/al-kawn-private-desktop-local-build-dry-run.md exists.",
      "Previous gates do not approve distribution.",
    ],
    evidence: [
      "reports/al-kawn-private-desktop-packaging-gate.md",
      "reports/al-kawn-local-packaged-auth-gate.md",
      "reports/al-kawn-private-desktop-packaging-preparation.md",
      "reports/al-kawn-private-desktop-local-build-dry-run.md",
    ],
    risk: "Distribution can be defined as a gate, but no installer or release may be created.",
    nextAction: "Use prior reports as blockers before any future distribution method.",
  };
}

export function getPrivateDistributionReadiness(): DesktopDistributionGateCheck {
  return {
    id: "private_distribution_readiness",
    label: "Private distribution readiness",
    state: "needs_ahmad_decision",
    status: "Distribution is private Ahmad-only, but the transfer method is not selected.",
    checks: [
      "Private Ahmad-only distribution path defined: yes, as policy.",
      "Local-only artifact policy defined: yes.",
      "Manual transfer path defined: future gate.",
      "No public release.",
      "No private distribution artifact exists.",
    ],
    evidence: [
      "Private Desktop Local Build Dry Run report.",
      "Product Truth desktop panels.",
      "No artifact-producing package script exists.",
    ],
    risk: "A distribution method must not be chosen without Ahmad approval, local auth, artifact audit, and secret review.",
    nextAction: "Ahmad decision required for any future private transfer path.",
  };
}
