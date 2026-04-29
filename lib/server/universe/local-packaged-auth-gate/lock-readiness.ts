import "server-only";

import type { LocalPackagedAuthReadiness } from "./types";

export function getPackagedAppLockReadiness(): LocalPackagedAuthReadiness {
  return {
    id: "packaged_app_lock_readiness",
    label: "Packaged-app lock readiness",
    state: "future_gate",
    status: "Packaged-app lock is not implemented because no native package exists yet.",
    checks: [
      "Packaged app lock exists: no.",
      "Packaged app lock future gate if not implemented.",
      "Do not claim ready if not implemented.",
      "No bypass or weak fake lock is accepted.",
    ],
    evidence: [
      "Current shell type is next_route_only.",
      "No Electron/Tauri package exists.",
    ],
    risk: "A packaged app without a lock could expose the private desktop command environment locally.",
    nextAction: "Implement lock only after native shell path and Ahmad-approved auth method are chosen.",
  };
}
