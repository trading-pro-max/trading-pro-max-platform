import type {
  AlkonRealityAdmission,
  AlkonRuntimeDefense,
  AlkonRuntimeEconomy,
  AlkonRuntimeInput,
  AlkonRuntimeLawDecision,
} from "./types";

export function decideAlkonRealityAdmission(
  input: AlkonRuntimeInput,
  law: AlkonRuntimeLawDecision,
  economy: AlkonRuntimeEconomy,
  defense: AlkonRuntimeDefense
): AlkonRealityAdmission {
  if (law.lawDecision === "black_holed") {
    return {
      realityAdmission: "black_hole_forbidden",
      allowedStage: "No reality admission.",
      missingGates: ["Product Truth", "Founder authority", "safety law"],
      rollbackRequired: true,
      supportRequired: false,
      founderDecisionRequired: true,
    };
  }

  if (law.lawDecision === "blocked") {
    return {
      realityAdmission: "blocked_until_cleared",
      allowedStage: "Private review only.",
      missingGates: law.failedRules,
      rollbackRequired: true,
      supportRequired: false,
      founderDecisionRequired: true,
    };
  }

  if (
    input.category === "invoice" ||
    economy.economyDecision === "founder_approval_required" ||
    defense.defenseDecision === "founder_approval_required"
  ) {
    return {
      realityAdmission: "readiness_only",
      allowedStage: "Founder/private readiness report.",
      missingGates: ["Founder decision", "audit proof", "off-app real-world handling"],
      rollbackRequired: true,
      supportRequired: false,
      founderDecisionRequired: true,
    };
  }

  if (input.publicVisible) {
    return {
      realityAdmission: "public_safe",
      allowedStage: "Public copy/UI after validation and leak check.",
      missingGates: ["visual or route proof", "regression proof"],
      rollbackRequired: true,
      supportRequired: true,
      founderDecisionRequired: false,
    };
  }

  return {
    realityAdmission: "internal_only",
    allowedStage: "Private Alkon readiness.",
    missingGates: ["Founder review if sensitive"],
    rollbackRequired: input.hasRollback !== true,
    supportRequired: false,
    founderDecisionRequired: false,
  };
}
