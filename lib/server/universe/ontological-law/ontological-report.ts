import "server-only";
import { getExistenceContracts } from "./existence-contract";
import { getAlKawnOntologicalLaw } from "./ontological-law";
import { getOntologicalExecutionVerdictRules } from "./execution-verdict";
import { getLayerBelongingRules } from "./layer-belonging";
import { getTruthSourceRules } from "./truth-source";

export function getOntologicalReport() {
  const contracts = getExistenceContracts();

  return {
    status: "active",
    law: getAlKawnOntologicalLaw(),
    contractCount: contracts.length,
    contracts,
    layerBelongingRules: getLayerBelongingRules(),
    truthSourceRules: getTruthSourceRules(),
    executionVerdictRules: getOntologicalExecutionVerdictRules(),
    kernelConnection:
      "Kernel enforces the ontological law of الكون. No entity enters الكون without an Existence Contract.",
    productTruth:
      "Product Truth هو قانون الحقيقة الأعلى. Product Truth is the highest law.",
  };
}
