import type { AbsoluteCompletionCheck, NumberOneEvaluationTarget } from "./types";
import { evaluatePublicClaimFirewall } from "./public-claim-firewall";

export function evaluateAbsoluteCompletion(
  target: NumberOneEvaluationTarget
): AbsoluteCompletionCheck[] {
  const claim = evaluatePublicClaimFirewall(target);

  return [
    {
      checkId: "functional_completion",
      outcome: target.hasFunctionalProof ? "complete_with_notes" : "needs_polish",
      reason: target.hasFunctionalProof
        ? "The function has evidence, but proof remains bounded by local validation."
        : "Function is not complete without working behavior evidence.",
      requiredEvidence: ["functional proof", "route or regression evidence"],
    },
    {
      checkId: "visual_completion",
      outcome: target.hasVisualAcceptance ? "complete_with_notes" : "needs_polish",
      reason: target.hasVisualAcceptance
        ? "Visual acceptance evidence exists."
        : "Visual-sensitive work remains needs_review until Founder visual acceptance or screenshot proof.",
      requiredEvidence: ["visual proof", "Founder visual acceptance when required"],
    },
    {
      checkId: "truth_completion",
      outcome: claim.allowed ? "complete_with_notes" : "blocked",
      reason: claim.allowed
        ? "Public wording remains inside Product Truth."
        : "Public claim language violates Product Truth.",
      requiredEvidence: ["Product Truth check", "public claim firewall check"],
    },
    {
      checkId: "safety_completion",
      outcome: target.involvesSecurity && !target.hasSafetyProof ? "delay" : "complete_with_notes",
      reason: "Safety completion requires no auth weakening, no secrets, and no unsafe activation.",
      requiredEvidence: ["security proof", "no secrets proof"],
    },
    {
      checkId: "legal_completion",
      outcome:
        (target.involvesLegal || target.involvesRegulatedActivity) && !target.hasLegalReview
          ? "delay"
          : "complete_with_notes",
      reason: "Legal-sensitive or regulated work cannot be complete without review.",
      requiredEvidence: ["Legal/Guardian review when applicable"],
    },
    {
      checkId: "operational_completion",
      outcome: target.hasOperationalProof ? "complete_with_notes" : "needs_polish",
      reason: "Operational readiness needs support, rollback, monitoring, and route proof.",
      requiredEvidence: ["operational proof", "rollback plan if applicable"],
    },
    {
      checkId: "memory_completion",
      outcome: target.hasMemoryRule ? "complete_with_notes" : "needs_polish",
      reason: "Memory prevents repeated mistakes.",
      requiredEvidence: ["memory rule"],
    },
    {
      checkId: "cost_completion",
      outcome: target.hasCostJustification ? "complete_with_notes" : "needs_polish",
      reason: "Time and cost must be justified before priority is protected.",
      requiredEvidence: ["time/cost justification"],
    },
    {
      checkId: "stage_completion",
      outcome:
        target.expandsFutureWorld && target.stationStatus !== "station_1_closed"
          ? "future"
          : "complete_with_notes",
      reason: "Future-world expansion waits until Prime World closure.",
      requiredEvidence: ["Station 1 closure", "Prime World protection"],
    },
    {
      checkId: "founder_acceptance_completion",
      outcome: target.hasFounderAcceptance ? "complete_with_notes" : "needs_polish",
      reason: "Founder acceptance is the final sensitive completion layer.",
      requiredEvidence: ["Founder acceptance when sensitive or visual"],
    },
  ];
}
