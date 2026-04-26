import type { SourceDriftSignal, SourceLawTarget } from "./types";

const noDrift = (driftType: SourceDriftSignal["driftType"]): SourceDriftSignal => ({
  driftDetected: false,
  driftType,
  severity: "none",
  correction: "No correction needed.",
  returnToHeart: "Keep Pro Max Trading human value as the heart.",
});

export function detectSourceDrift(target: SourceLawTarget): SourceDriftSignal[] {
  const signals: SourceDriftSignal[] = [];

  if (target.addsComplexity && !target.servesHuman && !target.supportsFounderOperation) {
    signals.push({
      driftDetected: true,
      driftType: "complexity_without_user_value",
      severity: "high",
      correction:
        "Delay or archive the layer until it improves a user, Founder, chart, Assistant, or safety outcome.",
      returnToHeart: "Return to human value and Prime World usefulness.",
    });
  } else {
    signals.push(noDrift("complexity_without_user_value"));
  }

  if (target.theoryOnly && !target.improvesPrimeWorld) {
    signals.push({
      driftDetected: true,
      driftType: "theory_without_product_impact",
      severity: "medium",
      correction:
        "Store the theory as future memory unless it closes a Station 1 product gap now.",
      returnToHeart: "Use docs only when they guide action or proof.",
    });
  } else {
    signals.push(noDrift("theory_without_product_impact"));
  }

  if (
    target.expandsFutureWorld &&
    target.currentStation !== "station_1_closed"
  ) {
    signals.push({
      driftDetected: true,
      driftType: "expansion_before_prime_world",
      severity: "high",
      correction:
        "Keep future worlds as private readiness and return build energy to Pro Max Trading.",
      returnToHeart: "Prime World first: Living Market Core and Local Day One.",
    });
  } else {
    signals.push(noDrift("expansion_before_prime_world"));
  }

  if (target.type === "visual_identity" && !target.servesHuman && !target.improvesPrimeWorld) {
    signals.push({
      driftDetected: true,
      driftType: "beauty_without_function",
      severity: "medium",
      correction:
        "Reject visual polish that does not improve clarity, trust, chart focus, or accessibility.",
      returnToHeart: "Beauty must serve function.",
    });
  } else {
    signals.push(noDrift("beauty_without_function"));
  }

  if (!target.hasTruthProof && target.publicVisible) {
    signals.push({
      driftDetected: true,
      driftType: "feature_without_truth",
      severity: "high",
      correction: "Do not close public work until Product Truth is checked.",
      returnToHeart: "Truth before public movement.",
    });
  } else {
    signals.push(noDrift("feature_without_truth"));
  }

  if (!target.hasValidationProof) {
    signals.push({
      driftDetected: true,
      driftType: "action_without_proof",
      severity: "medium",
      correction: "Keep the target open until validation proof exists.",
      returnToHeart: "Proof before closure.",
    });
  } else {
    signals.push(noDrift("action_without_proof"));
  }

  if (target.requiresFounderReview && target.addsComplexity) {
    signals.push({
      driftDetected: true,
      driftType: "decision_without_founder_need",
      severity: "medium",
      correction:
        "Reduce the request to one Founder decision and draft everything else.",
      returnToHeart: "Ahmad should see one meaningful fork, not a pile of choices.",
    });
  } else {
    signals.push(noDrift("decision_without_founder_need"));
  }

  if (target.regulatedFinancialAction || target.involvesBilling || target.involvesRealMoney) {
    signals.push({
      driftDetected: true,
      driftType: "legal_or_financial_risk",
      severity: "critical",
      correction:
        "Block or delay until legal, treasury, accounting, privacy, and Founder gates are ready.",
      returnToHeart: "Money and regulated activity are governed, not improvised.",
    });
  } else {
    signals.push(noDrift("legal_or_financial_risk"));
  }

  if (
    (target.affectsChart && !target.improvesPrimeWorld) ||
    (target.type === "assistant_behavior" && !target.improvesAssistant)
  ) {
    signals.push({
      driftDetected: true,
      driftType: "assistant_or_chart_not_improved",
      severity: "high",
      correction:
        "Do not accept chart or Assistant work unless it clearly improves the user experience.",
      returnToHeart: "Chart is king and Assistant is user language.",
    });
  } else {
    signals.push(noDrift("assistant_or_chart_not_improved"));
  }

  if (target.delaysLocalDayOne) {
    signals.push({
      driftDetected: true,
      driftType: "local_day_one_delayed",
      severity: "high",
      correction:
        "Delay the target unless it directly protects Station 1 or resolves a P0 truth/security/build failure.",
      returnToHeart: "Local Day One before expansion.",
    });
  } else {
    signals.push(noDrift("local_day_one_delayed"));
  }

  return signals;
}
