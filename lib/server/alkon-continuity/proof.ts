import type {
  AlkonEntityIdentity,
  AlkonEntityIntegration,
  AlkonEntityLawReview,
  AlkonEntityProof,
} from "./types";

export function proveAlkonEntityContinuity(
  identity: AlkonEntityIdentity,
  lawReview: AlkonEntityLawReview,
  integration: AlkonEntityIntegration
): AlkonEntityProof {
  const proofTypes: AlkonEntityProof["proofTypes"] = [
    "typescript",
    "eslint",
    "build",
    "regression",
    "product_truth_check",
    "public_leak_check",
  ];

  if (identity.category === "api") proofTypes.push("api_safety_check");
  if (identity.world === "public_earth") proofTypes.push("screenshot");
  if (identity.category === "visual_identity") proofTypes.push("visual_acceptance");
  if (identity.category === "treasury_system") proofTypes.push("treasury_review");
  if (identity.category === "media_system") proofTypes.push("legal_guardian_review");
  if (identity.risk === "founder_approval_required") proofTypes.push("founder_review");
  if (identity.category === "cleanup_candidate") proofTypes.push("rollback_proof");

  const missingProof = [
    integration.completeness !== "complete" ? "integration completeness" : "",
    lawReview.outcome === "blocked" || lawReview.outcome === "black_holed" ? "law approval" : "",
  ].filter(Boolean);

  return {
    entityId: identity.entityId,
    status: missingProof.length
      ? "missing_validation"
      : lawReview.outcome === "review_required" || lawReview.outcome === "founder_approval_required"
        ? "review_required"
        : "proven",
    proofTypes,
    missingProof,
    cannotBeAccepted: missingProof.length > 0,
  };
}
