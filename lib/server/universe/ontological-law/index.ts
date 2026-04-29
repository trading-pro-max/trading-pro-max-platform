import "server-only";

import { getExistenceContract as readExistenceContract } from "./existence-contract";

export { getExistenceContract, getExistenceContracts } from "./existence-contract";
export { getImpactMemoryRules } from "./impact-memory";
export { getLayerBelongingRules } from "./layer-belonging";
export { getAlKawnOntologicalLaw } from "./ontological-law";
export { getOntologicalReport } from "./ontological-report";
export {
  getOntologicalExecutionVerdict,
  getOntologicalExecutionVerdictRules,
} from "./execution-verdict";
export { getProtectionStateRules } from "./protection-state";
export { getRollbackExplanationRules } from "./rollback-explanation";
export { getTruthSourceRules } from "./truth-source";
export type {
  ExistenceContract,
  ExistenceContractStatus,
  ExecutionVerdictRule,
  ImpactMemoryRule,
  LayerBelongingRule,
  OntologicalActionInput,
  OntologicalEntityType,
  OntologicalExecutionVerdict,
  OntologicalLayer,
  OntologicalLaw,
  ProductTruthImpact,
  ProtectionState,
  ProtectionStateRule,
  RollbackExplanationRule,
  TruthSourceRule,
  TruthSourceType,
} from "./types";

export function explainWhyEntityExists(entityId: string): string {
  const contract = readExistenceContract(entityId);

  return `${contract.technicalLabel} exists because ${contract.reasonForExistence}`;
}

export function explainEntityFromInfinityToZero(entityId: string): string {
  const contract = readExistenceContract(entityId);

  return [
    "∞ إلى 0 يعني تفسير الكون والرجوع إلى الأصل.",
    `Entity: ${contract.technicalLabel}.`,
    `Layer: ${contract.parentLayer} -> ${contract.ownerLayer}.`,
    `Truth source: ${contract.truthSource}.`,
    `Execution verdict: ${contract.executionVerdict}.`,
    `Return to origin: ${contract.rollbackExplanationPath}`,
  ].join(" ");
}
