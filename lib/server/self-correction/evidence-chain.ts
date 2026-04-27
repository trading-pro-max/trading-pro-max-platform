import type { SelfCorrectionEvidenceChain } from "./types";

export function buildSelfCorrectionEvidenceChain(): SelfCorrectionEvidenceChain {
  const required = ["signals", "priority", "return to heart", "tests", "reports", "visual proof"];
  const present = ["signals", "priority", "return to heart", "reports"];

  return {
    evidenceId: "alkon_self_correction_evidence",
    required,
    present,
    missing: required.filter((item) => !present.includes(item)),
  };
}

