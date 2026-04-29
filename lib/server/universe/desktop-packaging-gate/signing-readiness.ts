import "server-only";

import type { DesktopPackagingReadiness } from "./types";

export function getDesktopSigningReadiness(): DesktopPackagingReadiness {
  return {
    id: "desktop_signing_readiness",
    label: "Signing readiness",
    state: "needs_ahmad_decision",
    status: "Signing is not active and certificates are not configured.",
    checks: [
      "Signing certificates exist: unknown / future gate.",
      "Signing is not active.",
      "Signing requires Ahmad decision.",
      "Signing remains future gate.",
    ],
    evidence: [
      "No public release/signing/store script is declared.",
      "Desktop Shell Finalization kept signing as a future gate.",
    ],
    risk: "Signing implies distribution intent and must not happen without Ahmad approval.",
    nextAction: "Ahmad must approve signing method, certificate handling, and private distribution purpose.",
  };
}
