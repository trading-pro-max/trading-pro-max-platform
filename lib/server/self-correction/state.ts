import { runSelfCorrection } from "./engine";
import type { SelfCorrectionSnapshot } from "./types";

export function getSelfCorrectionSnapshot(
  checkedAt = new Date().toISOString()
): SelfCorrectionSnapshot {
  return {
    checkedAt,
    mode: "alkon_self_correction",
    status: "ready_with_notes",
    visibility: "private_founder_only",
    founderOnly: true,
    readOnly: true,
    publicExposure: false,
    ...runSelfCorrection(),
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

export function getSelfCorrectionReadiness(checkedAt = new Date().toISOString()) {
  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noExternalCalls: true,
    noSecrets: true,
    snapshot: getSelfCorrectionSnapshot(checkedAt),
  };
}
