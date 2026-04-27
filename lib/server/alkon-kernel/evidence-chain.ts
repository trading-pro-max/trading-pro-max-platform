import type { EvidenceChain } from "./types";

export const KERNEL_REQUIRED_EVIDENCE = [
  "tsc",
  "eslint",
  "build",
  "prisma validate",
  "regression tests",
  "smoke routes",
  "screenshots for UI/visual work",
  "public leak proof",
  "Product Truth proof",
  "commit hash",
  "pushed status",
  "clean Git",
  "Wake Report",
];

type EvidenceKey = (typeof KERNEL_REQUIRED_EVIDENCE)[number];

export function buildEvidenceChain(
  evidence: Partial<Record<EvidenceKey, boolean>> = {}
): EvidenceChain {
  const presentEvidence = KERNEL_REQUIRED_EVIDENCE.filter(
    (item) => evidence[item] === true
  );
  const missingEvidence = KERNEL_REQUIRED_EVIDENCE.filter(
    (item) => evidence[item] !== true
  );

  return {
    evidenceStatus:
      missingEvidence.length === 0
        ? "complete"
        : presentEvidence.length > 0
          ? "complete_with_notes"
          : "needs_proof",
    requiredEvidence: KERNEL_REQUIRED_EVIDENCE,
    presentEvidence,
    missingEvidence,
    closureAllowed: missingEvidence.length === 0,
    dirtyGitBlocksClosure: true,
    failedValidationBlocksClosure: true,
    publicLeakIsP0: true,
  };
}

export function getDefaultEvidenceChain(): EvidenceChain {
  return buildEvidenceChain({
    "Product Truth proof": true,
    "public leak proof": true,
  });
}
