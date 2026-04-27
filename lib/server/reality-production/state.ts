import { runRealityProduction } from "./engine";
import type { RealityProductionSnapshot } from "./types";

export function getRealityProductionSnapshot(
  checkedAt = new Date().toISOString()
): RealityProductionSnapshot {
  return {
    checkedAt,
    mode: "alkon_reality_production",
    status: "ready_with_notes",
    visibility: "private_founder_only",
    founderOnly: true,
    readOnly: true,
    publicExposure: false,
    codexIsBuilderNotLeader: true,
    ...runRealityProduction(),
    productTruth: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedInactive: true,
      billingInactive: true,
      publicLaunchInactive: true,
      noPublicAlkonExposure: true,
      noShellExecutionFromWebApp: true,
      noCodexExecutionFromWebApp: true,
      noSecretsExposed: true,
    },
  };
}

export function getRealityProductionReadiness(
  checkedAt = new Date().toISOString()
) {
  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noExternalCalls: true,
    noSecrets: true,
    snapshot: getRealityProductionSnapshot(checkedAt),
  };
}
