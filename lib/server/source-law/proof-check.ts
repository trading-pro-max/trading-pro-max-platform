import type { ProofCheck, SourceLawTarget } from "./types";

export function evaluateProofCheck(target: SourceLawTarget): ProofCheck {
  const missingProof: string[] = [];
  const requiredEvidence = [
    "TypeScript",
    "ESLint",
    "build",
    "prisma validate",
    "regression tests",
    "smoke routes",
    "Product Truth checks",
    "public leak checks",
    "git clean",
    "commit hash",
    "pushed status",
  ];

  if (!target.hasValidationProof) {
    missingProof.push("validation proof");
  }

  if (!target.hasTruthProof) {
    missingProof.push("Product Truth proof");
  }

  if (!target.hasSafetyProof) {
    missingProof.push("safety proof");
  }

  if (target.publicVisible && !target.hasPublicLeakCheck) {
    missingProof.push("public leak check");
  }

  if (target.publicVisible && !target.hasProductTruthCheck) {
    missingProof.push("public Product Truth check");
  }

  if (
    (target.type === "page" ||
      target.type === "component" ||
      target.type === "workspace" ||
      target.type === "visual_identity") &&
    !target.hasScreenshots
  ) {
    missingProof.push("screenshot or public visual proof");
  }

  if (target.isVisualAcceptanceSensitive && !target.hasFounderVisualAcceptance) {
    missingProof.push("Founder visual acceptance");
  }

  if (!target.hasGitProof) {
    missingProof.push("git proof");
  }

  if (target.involvesLiveExecution || target.involvesRealMoney) {
    return {
      proofStatus: "blocked",
      missingProof: ["dangerous activation cannot be proven safe in local scope"],
      requiredEvidence,
      canClose: false,
    };
  }

  if (missingProof.includes("Founder visual acceptance")) {
    return {
      proofStatus: "needs_founder_review",
      missingProof,
      requiredEvidence,
      canClose: false,
    };
  }

  if (missingProof.length > 0) {
    return {
      proofStatus: "needs_proof",
      missingProof,
      requiredEvidence,
      canClose: false,
    };
  }

  return {
    proofStatus: "proven",
    missingProof,
    requiredEvidence,
    canClose: true,
  };
}
