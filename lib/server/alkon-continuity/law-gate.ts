import type {
  AlkonEntityBirthCandidate,
  AlkonEntityBirthRequest,
  AlkonEntityIdentity,
  AlkonEntityLawOutcome,
  AlkonEntityLawReview,
} from "./types";

const HARD_BLACK_HOLE = [
  "live execution",
  "real money",
  "broker",
  "feed activation",
  "billing activation",
  "production secrets",
  "raw secret",
  "bank card",
  "card number",
  "cvv",
  "shell execution",
  "public alkon",
  "expose alkon",
];

const FAKE_CLAIM_PATTERNS = [
  "guaranteed profit",
  "win rate",
  "fake users",
  "fake revenue",
  "app store now",
  "swiss company certified",
  "sharia certified",
];

export function reviewAlkonContinuityLaw(
  candidate: AlkonEntityBirthCandidate,
  identity: AlkonEntityIdentity,
  request: AlkonEntityBirthRequest
): AlkonEntityLawReview {
  const text = request.text.toLowerCase();
  const reasons: string[] = [];
  const requiredReviews: string[] = [];
  let outcome: AlkonEntityLawOutcome = "allow";

  if (HARD_BLACK_HOLE.some((pattern) => text.includes(pattern))) {
    outcome = "black_holed";
    reasons.push("Dangerous activation, secret, payment, shell, or public Alkon request is forbidden.");
  }

  if (
    (request.requestsImageGeneration || text.includes("generate image") || text.includes("png")) &&
    !request.explicitImageApproval
  ) {
    outcome = outcome === "black_holed" ? outcome : "blocked";
    reasons.push("Image generation and raster asset creation are blocked unless Ahmad explicitly requests them.");
  }

  if (request.requiresSecrets) {
    outcome = "black_holed";
    reasons.push("Secrets are never required or exposed by continuity review.");
  }

  if (FAKE_CLAIM_PATTERNS.some((pattern) => text.includes(pattern))) {
    outcome = outcome === "black_holed" ? outcome : "blocked";
    reasons.push("Fake product, legal, financial, user, revenue, certification, or performance claims are blocked.");
  }

  if (identity.world === "private_alkon" && request.publicVisible) {
    outcome = outcome === "black_holed" ? outcome : "blocked";
    reasons.push("Private Alkon entities cannot become public user surfaces.");
  }

  if (identity.risk === "founder_approval_required") {
    outcome = outcome === "allow" ? "founder_approval_required" : outcome;
    requiredReviews.push("Founder final decision");
  }

  if (identity.category === "cleanup_candidate" || request.requestsDeletion) {
    outcome = outcome === "allow" ? "review_required" : outcome;
    requiredReviews.push("Dependency and rollback review");
  }

  if (identity.category === "treasury_system") requiredReviews.push("Treasury legitimacy review");
  if (identity.category === "media_system") requiredReviews.push("Media claims review");
  if (identity.category === "security_system") requiredReviews.push("Security review");

  return {
    entityId: identity.entityId,
    outcome,
    reasons: reasons.length ? reasons : ["Continuity birth preserves Product Truth, public/private boundaries, and Founder authority."],
    requiredReviews,
    safeAlternative:
      outcome === "black_holed" || outcome === "blocked"
        ? "Create a private report, keep the unsafe action inactive, and propose a safe readiness or documentation task instead."
        : "Proceed as a read-only continuity proposal with validation, memory, and Founder visibility.",
    productTruthPreserved: outcome !== "black_holed" && outcome !== "blocked",
    publicPrivateBoundaryPreserved: !(identity.world === "private_alkon" && request.publicVisible),
  };
}
