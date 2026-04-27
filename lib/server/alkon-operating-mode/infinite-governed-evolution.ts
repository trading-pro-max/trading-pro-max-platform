import type {
  AlkonOperatingModeOptions,
  InfiniteGovernedEvolutionStatus,
  OperatingModeStatus,
} from "./types";
import { decideAlkonActivation, getAlkonActivationGates } from "./activation-gates";
import { getZeroTruthAudit } from "./zero-truth-audit";

export const ALKON_ALLOWED_EVOLUTION = [
  "detect gaps",
  "classify gaps",
  "create command passports",
  "validate results",
  "update memory",
  "improve UX",
  "improve Assistant",
  "improve Workspace",
  "improve documentation",
  "improve tests",
  "improve safety",
  "improve evidence",
  "improve visual balance when accepted or rejected",
];

export const ALKON_GATED_EVOLUTION = [
  "Local Day One",
  "public beta",
  "production deployment",
  "billing",
  "broker/feed",
  "live execution",
  "real-money routing",
  "regulated financial services",
  "social publishing",
];

export const ALKON_FORBIDDEN_EVOLUTION_WITHOUT_GATES = [
  "public launch",
  "payment execution",
  "billing activation",
  "broker/feed activation",
  "live execution",
  "real money",
  "social publishing",
  "regulated financial services",
  "production activation",
  "secrets exposure",
  "bank/card data exposure",
  "public Alkon exposure",
  "uncontrolled automation",
];

export function getInfiniteGovernedEvolutionStatus(
  checkedAt = new Date().toISOString(),
  options: AlkonOperatingModeOptions = {}
): InfiniteGovernedEvolutionStatus {
  const audit = getZeroTruthAudit(checkedAt, options);
  const gates = getAlkonActivationGates(checkedAt, options, audit);
  const activation = decideAlkonActivation(gates);
  const evolutionStatus: OperatingModeStatus =
    activation.status === "blocked" ? "blocked" : "active_with_notes";

  return {
    evolutionStatus,
    allowedGrowth: ALKON_ALLOWED_EVOLUTION,
    gatedGrowth: ALKON_GATED_EVOLUTION,
    forbiddenGrowth: ALKON_FORBIDDEN_EVOLUTION_WITHOUT_GATES,
    nextSafeEvolution:
      evolutionStatus === "blocked"
        ? "Fix the blocking Product Truth, boundary, validation, Git, or Wake Report issue."
        : "Continue evidence-led UX, Workspace, Assistant, documentation, tests, safety, and memory improvements while waiting for Ahmad gates.",
    productTruthPreserved: true,
    publicExposure: false,
  };
}
