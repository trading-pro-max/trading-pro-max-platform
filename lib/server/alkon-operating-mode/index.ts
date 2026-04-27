import { getAlkonActivationGates, decideAlkonActivation } from "./activation-gates";
import { getAlkonDailyOperatingLoop } from "./daily-loop";
import { getInfiniteGovernedEvolutionStatus } from "./infinite-governed-evolution";
import { getAlkonOperatingMemoryLessons } from "./memory";
import { getAlkonOneNextAction } from "./one-next-action";
import type {
  AlkonOperatingModeOptions,
  AlkonOperatingModeSnapshot,
} from "./types";
import { getZeroTruthAudit } from "./zero-truth-audit";

export function getAlkonOperatingModeSnapshot(
  checkedAt = new Date().toISOString(),
  options: AlkonOperatingModeOptions = {}
): AlkonOperatingModeSnapshot {
  const zeroTruthAudit = getZeroTruthAudit(checkedAt, options);
  const activationGates = getAlkonActivationGates(
    checkedAt,
    options,
    zeroTruthAudit
  );
  const activation = decideAlkonActivation(activationGates);
  const oneNextAction = getAlkonOneNextAction(
    checkedAt,
    options,
    zeroTruthAudit,
    activationGates
  );
  const dailyOperatingLoop = getAlkonDailyOperatingLoop(checkedAt, options);
  const infiniteGovernedEvolution =
    getInfiniteGovernedEvolutionStatus(checkedAt, options);
  const memoryLessons = getAlkonOperatingMemoryLessons();
  const visualAccepted = options.visualAcceptance === "accepted";
  const localDayOneStarted = options.localDayOneStarted === true;

  return {
    checkedAt,
    mode: "alkon_operating_mode",
    name: "Alkon Operating Mode",
    visibility: "private_founder_only",
    publicExposure: false,
    status: activation.status,
    activationDecision: activation.activationDecision,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    zeroTruthAudit,
    activationGates,
    dailyOperatingLoop,
    oneNextAction,
    infiniteGovernedEvolution,
    memoryLessons,
    founderDecisionNeeded: oneNextAction.founderDecisionNeeded,
    localDayOneGate: {
      readyToStart: visualAccepted && localDayOneStarted,
      blockedUntilAhmadVisualAcceptance: !visualAccepted,
      status:
        activation.status === "blocked"
          ? "blocked"
          : visualAccepted && localDayOneStarted
            ? "ready"
            : "waiting_ahmad_visual_acceptance",
    },
    productTruthStatus: {
      ...zeroTruthAudit.productTruthStatus,
      authSecurityPreserved: true,
      noUncontrolledAutomation: true,
      noPublicAlkonOperatingModeExposure: true,
      noZeroTruthPublicExposure: true,
    },
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
      publicOperatingModeLanguageVisible: false,
    },
  };
}

export function getAlkonOperatingModeReadiness(
  checkedAt = new Date().toISOString(),
  options: AlkonOperatingModeOptions = {}
) {
  const snapshot = getAlkonOperatingModeSnapshot(checkedAt, options);

  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noShellExecution: true,
    noPayments: true,
    noExternalCalls: true,
    noSecrets: true,
    noPublicApi: true,
    status: snapshot.status,
    activationDecision: snapshot.activationDecision,
    founderDecisionNeeded: snapshot.founderDecisionNeeded,
    oneNextAction: snapshot.oneNextAction.oneNextAction,
    productTruthStatus: snapshot.productTruthStatus,
    publicExposureStatus: snapshot.publicExposureStatus,
    snapshot,
  };
}

export {
  decideAlkonActivation,
  getAlkonActivationGates,
} from "./activation-gates";
export {
  ALKON_DAILY_OPERATING_LOOP_STEPS,
  getAlkonDailyOperatingLoop,
} from "./daily-loop";
export {
  ALKON_ALLOWED_EVOLUTION,
  ALKON_FORBIDDEN_EVOLUTION_WITHOUT_GATES,
  ALKON_GATED_EVOLUTION,
  getInfiniteGovernedEvolutionStatus,
} from "./infinite-governed-evolution";
export {
  ALKON_OPERATING_MEMORY_LESSONS,
  getAlkonOperatingMemoryLessons,
} from "./memory";
export { getAlkonOneNextAction } from "./one-next-action";
export type * from "./types";
export { getZeroTruthAudit } from "./zero-truth-audit";
