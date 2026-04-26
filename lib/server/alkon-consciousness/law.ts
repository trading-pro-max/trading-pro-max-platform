import type { AlkonLawDecision, AlkonMeaning, AlkonSignal } from "./types";

const HARD_BLOCKED_SIGNALS = new Set([
  "billing_request",
  "live_request",
  "broker_feed_request",
  "social_publish_request",
  "launch_request",
  "secret_risk",
]);

function isImageRequestWithoutApproval(signal: AlkonSignal) {
  return (
    !signal.explicitImageApproval &&
    /image|raster|png|jpg|jpeg|webp|gif|video|صور|صورة/i.test(signal.rawSummary)
  );
}

export function decideAlkonLaw(
  signal: AlkonSignal,
  meaning: AlkonMeaning
): AlkonLawDecision {
  if (signal.type === "public_private_leak") {
    return {
      signalId: signal.signalId,
      outcome: "quarantined",
      reason:
        "Public/private boundary law quarantines any Alkon, Founder Command, Codex, secrets, or internal memory exposure.",
      safeAlternative:
        "Translate internal readiness into public-safe Trading Pro Max language and add leak-prevention validation.",
      requiredReviews: ["Founder review", "Security review", "Public boundary review"],
      blockedReason: "Internal private systems cannot be public user surfaces.",
      productTruthPreserved: true,
      noSecrets: true,
      noPublicExposure: true,
    };
  }

  if (HARD_BLOCKED_SIGNALS.has(signal.type) || isImageRequestWithoutApproval(signal)) {
    return {
      signalId: signal.signalId,
      outcome: "black_hole",
      reason:
        "Product Truth, Security, Legal, Guardian, Trust, and Founder preference law hard-block this request in local scope.",
      safeAlternative:
        "Prepare a readiness note, review-only task, or truthful blocked-state explanation without activation or unsafe output.",
      requiredReviews: ["Founder review"],
      blockedReason:
        "Hard blocked: no live execution, real money, broker/feed, billing now, public launch, social publishing, secrets exposure, fake claims, or unapproved images/raster assets.",
      productTruthPreserved: true,
      noSecrets: true,
      noPublicExposure: true,
    };
  }

  if (
    meaning.category === "visual_pain" ||
    signal.type === "shell_duplication" ||
    signal.type === "assistant_gap"
  ) {
    return {
      signalId: signal.signalId,
      outcome: "founder_approval_required",
      reason:
        "High-impact product experience changes need Ahmad acceptance before being treated as closed.",
      safeAlternative:
        "Prepare a scoped task passport, visual review, and regression proof for Founder decision.",
      requiredReviews: ["Founder visual review", "Product Truth review"],
      blockedReason: null,
      productTruthPreserved: true,
      noSecrets: true,
      noPublicExposure: true,
    };
  }

  if (meaning.category === "legal_risk" || meaning.category === "public_trust_risk") {
    return {
      signalId: signal.signalId,
      outcome: "review_required",
      reason: "Trust and legal impact require review before action.",
      safeAlternative: "Prepare a public-safe review note and blocked-state wording.",
      requiredReviews: ["Legal/Guardian review", "Trust review"],
      blockedReason: null,
      productTruthPreserved: true,
      noSecrets: true,
      noPublicExposure: true,
    };
  }

  return {
    signalId: signal.signalId,
    outcome: "allowed",
    reason: "The signal can be prepared as safe local/private readiness work.",
    safeAlternative: "Proceed with report-only or task-passport preparation.",
    requiredReviews: ["Result Tribunal"],
    blockedReason: null,
    productTruthPreserved: true,
    noSecrets: true,
    noPublicExposure: true,
  };
}

export function decideAlkonLaws(signals: AlkonSignal[], meanings: AlkonMeaning[]) {
  return signals.map((signal) => {
    const meaning = meanings.find((item) => item.signalId === signal.signalId);

    if (!meaning) {
      throw new Error(`Missing meaning for signal ${signal.signalId}.`);
    }

    return decideAlkonLaw(signal, meaning);
  });
}
