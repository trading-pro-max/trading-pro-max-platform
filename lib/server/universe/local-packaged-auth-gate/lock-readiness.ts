import "server-only";

import type { LocalPackagedAuthReadiness } from "./types";

export function getPackagedAppLockReadiness(): LocalPackagedAuthReadiness {
  return {
    id: "packaged_app_lock_readiness",
    label: "Packaged-app lock readiness",
    state: "ready_with_notes",
    status: "Local route lock is implemented; native packaged-app lock remains future-gated until a native package exists.",
    checks: [
      "Local route lock exists: yes.",
      "Native packaged app lock exists: no native package yet.",
      "Do not claim production-grade packaged auth.",
      "No external identity provider is connected.",
    ],
    evidence: [
      "Current shell type is next_route_only.",
      "AlKawnLocalAuthGate protects /desktop/kawn locally.",
    ],
    risk: "A future native app must preserve this local lock or replace it with an Ahmad-approved stronger local method.",
    nextAction: "Preserve the local lock during future packaging preparation.",
  };
}
