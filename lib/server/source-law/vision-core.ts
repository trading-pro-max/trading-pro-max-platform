import type { AhmadVisionCore, SourceAlignmentReview, SourceLawTarget } from "./types";

export const AHMAD_VISION_CORE: AhmadVisionCore = {
  sourceId: "ahmad_vision_core",
  privateFounderSource: true,
  vision:
    "Pro Max should become worthy of world-class status by building a truthful, safe, Earth-native financial intelligence and trading command platform for real humans.",
  founderOwnsAlkon: true,
  founderFinalAuthority: true,
  noPublicDoctrine: true,
  noImagesUnlessExplicit: true,
  noPublicNumberOneClaim: true,
};

export function evaluateVisionCore(target: SourceLawTarget): SourceAlignmentReview {
  const reviewId = `${target.targetId ?? "source_target"}_vision`;

  if (target.publicVisible && target.exposesAlkonPublicly) {
    return {
      reviewId,
      visionAlignment: "blocked",
      founderReviewNeeded: true,
      reason:
        "Public exposure of private Founder doctrine violates the Source Law boundary.",
    };
  }

  if (
    target.involvesLiveExecution ||
    target.involvesRealMoney ||
    target.involvesBrokerFeed ||
    target.involvesBilling
  ) {
    return {
      reviewId,
      visionAlignment: "blocked",
      founderReviewNeeded: true,
      reason:
        "The target tries to use Vision Core to justify unsafe activation, which Source Law forbids.",
    };
  }

  if (target.expandsFutureWorld && !target.improvesPrimeWorld) {
    return {
      reviewId,
      visionAlignment: "partial",
      founderReviewNeeded: true,
      reason:
        "Future-world expansion can be remembered privately, but Prime World closure remains the source priority.",
    };
  }

  if (target.servesHuman || target.supportsFounderOperation || target.improvesPrimeWorld) {
    return {
      reviewId,
      visionAlignment: "aligned",
      founderReviewNeeded:
        Boolean(target.requiresFounderReview) ||
        Boolean(target.isVisualAcceptanceSensitive),
      reason:
        "The target serves Pro Max through human value, Founder operation, or Prime World protection.",
    };
  }

  return {
    reviewId,
    visionAlignment: "misaligned",
    founderReviewNeeded: false,
    reason:
      "The target has not shown enough connection to Ahmad vision, human value, or Pro Max Trading reality.",
  };
}
