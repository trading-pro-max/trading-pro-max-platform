import { evaluatePublicClaimFirewall } from "./public-claim-firewall";
import type { DriftSignal, NumberOneEvaluationTarget } from "./types";

const NO_DRIFT: DriftSignal = {
  driftDetected: false,
  driftType: "weak_proof",
  severity: "none",
  affectedStation: "none",
  stopOrContinue: "continue",
  correction: "Continue with proof, Product Truth, and Prime World protection.",
};

export function detectDestinyDrift(
  target: NumberOneEvaluationTarget
): DriftSignal[] {
  const drifts: DriftSignal[] = [];
  const claim = evaluatePublicClaimFirewall(target);

  if (target.expandsFutureWorld && target.stationStatus !== "station_1_closed") {
    drifts.push({
      driftDetected: true,
      driftType: "prime_world_distraction",
      severity: "high",
      affectedStation: "station_1",
      stopOrContinue: "delay",
      correction:
        "Keep future worlds as private readiness only until Pro Max Trading closes Station 1 and Local Day One.",
    });
  }

  if (target.affectsChart && !target.improvesPrimeWorld) {
    drifts.push({
      driftDetected: true,
      driftType: "chart_not_king",
      severity: "critical",
      affectedStation: "prime_world",
      stopOrContinue: "block",
      correction: "Protect chart dominance; rebuild or delay any chart-weakening work.",
    });
  }

  if (target.addsClutter) {
    drifts.push({
      driftDetected: true,
      driftType: "visual_noise",
      severity: "medium",
      affectedStation: "prime_world",
      stopOrContinue: "continue_with_guard",
      correction: "Reduce controls, move secondary intent to Assistant, and keep the workspace chart-first.",
    });
  }

  if (!claim.allowed && target.publicVisible) {
    drifts.push({
      driftDetected: true,
      driftType: "public_claim_risk",
      severity: "critical",
      affectedStation: "public_claims",
      stopOrContinue: "block",
      correction: "Remove #1, best, global, regulated, guaranteed, profit, win-rate, and fake availability language.",
    });
  }

  if (target.involvesLegal || target.involvesRegulatedActivity) {
    drifts.push({
      driftDetected: true,
      driftType: "legal_risk",
      severity: target.hasLegalReview ? "medium" : "high",
      affectedStation: "prime_world",
      stopOrContinue: target.hasLegalReview ? "continue_with_guard" : "delay",
      correction: "Route to Legal/Guardian readiness before public or real-world movement.",
    });
  }

  if (target.involvesMoney || target.involvesBilling) {
    drifts.push({
      driftDetected: true,
      driftType: "treasury_risk",
      severity: "high",
      affectedStation: "prime_world",
      stopOrContinue: "delay",
      correction: "Keep money and billing readiness-only until treasury, accounting, support, refund, and Founder gates pass.",
    });
  }

  if (target.increasesFounderLoad) {
    drifts.push({
      driftDetected: true,
      driftType: "founder_energy_overload",
      severity: "high",
      affectedStation: "founder_energy",
      stopOrContinue: "delay",
      correction: "Reduce to one next critical Founder decision and delegate low-risk drafting.",
    });
  }

  if (!target.hasFunctionalProof || !target.hasTests) {
    drifts.push({
      driftDetected: true,
      driftType: "weak_proof",
      severity: "medium",
      affectedStation: "prime_world",
      stopOrContinue: "continue_with_guard",
      correction: "Do not mark complete until functional proof and tests exist.",
    });
  }

  return drifts.length > 0 ? drifts : [NO_DRIFT];
}
