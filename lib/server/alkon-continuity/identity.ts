import type {
  AlkonContinuityRiskLevel,
  AlkonEntityBirthCandidate,
  AlkonEntityBirthRequest,
  AlkonEntityIdentity,
} from "./types";

function normalizeId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 72);
}

function inferOwner(candidate: AlkonEntityBirthCandidate) {
  if (candidate.category === "treasury_system") return "Treasury Life";
  if (candidate.category === "media_system") return "Media Intelligence";
  if (candidate.category === "security_system") return "Security Sovereignty";
  if (candidate.category === "assistant_intent") return "TPM Assistant";
  if (candidate.category === "cleanup_candidate") return "Alkon Ontology";
  if (candidate.world === "private_alkon") return "Founder Command";
  if (candidate.world === "invisible_operating_layer") return "Invisible Operating Layer";
  return "Public Earth World";
}

function inferRisk(candidate: AlkonEntityBirthCandidate): AlkonContinuityRiskLevel {
  if (candidate.sensitiveFlags.includes("dangerous_activation_or_secret_request")) {
    return "black_hole";
  }
  if (candidate.sensitiveFlags.length > 0) return "blocked";
  if (candidate.world === "private_alkon") return "founder_approval_required";
  if (candidate.category === "cleanup_candidate") return "review_required";
  return "safe";
}

export function identifyAlkonEntity(
  candidate: AlkonEntityBirthCandidate,
  request: AlkonEntityBirthRequest
): AlkonEntityIdentity {
  const anonymous = !candidate.proposedName.trim();
  const owner = inferOwner(candidate);
  const risk = inferRisk(candidate);

  return {
    entityId: anonymous
      ? "anonymous_rejected"
      : `${candidate.world}_${normalizeId(candidate.proposedName)}`,
    name: anonymous ? "Anonymous entity rejected" : candidate.proposedName,
    category: candidate.category,
    world: candidate.world,
    owner,
    surface: request.surface ?? (candidate.world === "public_earth" ? "Public product" : "Founder Command"),
    status: anonymous ? "anonymous_rejected" : owner ? "identified" : "needs_owner",
    visibility:
      candidate.world === "public_earth"
        ? "public_user"
        : candidate.world === "private_alkon"
          ? "founder_private"
          : "internal_readiness",
    risk,
    lifecycleState:
      risk === "black_hole" ? "black_holed" : risk === "blocked" ? "blocked" : "reviewed",
    reportTarget:
      candidate.world === "public_earth"
        ? "Product Truth and Founder Command summary"
        : "Founder Command private continuity report",
    publicVisible: candidate.publicVisible && candidate.world === "public_earth",
    founderVisible: true,
  };
}
