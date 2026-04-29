import "server-only";

import type { DesktopPackagingReadiness } from "./types";

export function getDesktopPackageReadiness(): DesktopPackagingReadiness {
  return {
    id: "desktop_package_readiness",
    label: "Packaging readiness",
    state: "future_gate",
    status: "Desktop packaging is not active and no release package target is defined.",
    checks: [
      "Packaging script exists: no.",
      "Packaging tool exists: no.",
      "Package target defined: no.",
      "Release packaging is not active.",
      "Packaging remains blocked/pending until native shell and auth gates close.",
    ],
    evidence: [
      "package.json includes desktop:check only.",
      "No signing/release/store script is declared by the desktop shell check.",
    ],
    risk: "Packaging without local auth and private distribution gates would create an unsafe app artifact.",
    nextAction: "Prepare packaging only after local packaged auth and private distribution decisions are approved.",
  };
}
