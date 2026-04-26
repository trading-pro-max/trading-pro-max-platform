import { evaluatePublicClaimFirewall } from "./public-claim-firewall";
import type { NorthStarResult, NumberOneEvaluationTarget } from "./types";

export const PRO_MAX_INTERNAL_NORTH_STAR: NorthStarResult["northStar"] =
  "Make Pro Max worthy of becoming the world's #1 Earth-native financial intelligence and trading command platform.";

export function evaluateNorthStar(
  target: NumberOneEvaluationTarget
): NorthStarResult {
  const claimFirewall = evaluatePublicClaimFirewall(target);

  if (target.publicVisible && !claimFirewall.allowed) {
    return {
      northStar: PRO_MAX_INTERNAL_NORTH_STAR,
      publicClaimForbidden: true,
      northStarAlignment: "blocked",
      reason:
        "The target tries to move an internal #1 standard into public claim territory.",
      missingEvidence: [
        "independent proof",
        "legal review",
        "Founder approval",
        "public claims review",
      ],
      nextSafeAction:
        "Replace the public claim with truthful paper-safe, planned, inactive, future, or readiness language.",
    };
  }

  if (target.servesHumanNeed && target.improvesPrimeWorld) {
    return {
      northStar: PRO_MAX_INTERNAL_NORTH_STAR,
      publicClaimForbidden: true,
      northStarAlignment: "aligned",
      reason:
        "The target serves a real human and strengthens Pro Max Trading without making a public #1 claim.",
      missingEvidence: target.hasFunctionalProof && target.hasTests ? [] : [
        "functional proof",
        "regression or route proof",
      ],
      nextSafeAction:
        "Continue as private quality alignment and collect proof before acceptance.",
    };
  }

  if (target.servesHumanNeed || target.improvesPrimeWorld) {
    return {
      northStar: PRO_MAX_INTERNAL_NORTH_STAR,
      publicClaimForbidden: true,
      northStarAlignment: "partial",
      reason:
        "The target has some alignment, but the human value or Prime World contribution is incomplete.",
      missingEvidence: [
        "clear human value",
        "Prime World benefit",
        "proof of closure",
      ],
      nextSafeAction: "Improve purpose and proof before it receives priority.",
    };
  }

  return {
    northStar: PRO_MAX_INTERNAL_NORTH_STAR,
    publicClaimForbidden: true,
    northStarAlignment: "misaligned",
    reason:
      "The target does not yet prove human value or Prime World contribution.",
    missingEvidence: ["human need", "Prime World value", "time/cost justification"],
    nextSafeAction: "Delay, review, or archive until a real need is shown.",
  };
}
