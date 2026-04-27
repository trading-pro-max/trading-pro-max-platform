import type { RealityProductionEvidenceChain } from "./types";

export function buildRealityProductionEvidenceChain(): RealityProductionEvidenceChain {
  const required = ["code contracts", "private APIs", "tests", "reports", "screenshots"];
  const present = ["code contracts", "private APIs", "reports"];

  return {
    evidenceId: "alkon_reality_production_evidence",
    required,
    present,
    missing: required.filter((item) => !present.includes(item)),
    canClose: false,
  };
}

