import type {
  AlkonRuntimeDefense,
  AlkonRuntimeInput,
  AlkonRuntimeLawDecision,
} from "./types";

export function evaluateAlkonRuntimeDefense(
  input: AlkonRuntimeInput,
  law: AlkonRuntimeLawDecision
): AlkonRuntimeDefense {
  const requiresProtection =
    input.category === "security_risk" ||
    input.category === "secret_risk" ||
    input.requiresSecrets ||
    input.category === "device_event" ||
    law.lawDecision === "black_holed";

  if (law.lawDecision === "black_holed") {
    return {
      defenseDecision: "black_holed",
      requiredProtection: [
        "Owner Shield",
        "Secrets Authority",
        "Risk Belt",
        "Black Hole Zone",
        "Audit ledger readiness",
      ],
      lockdownRecommended:
        input.category === "secret_risk" || input.category === "security_risk",
      auditRequired: true,
      blockedReason: law.blockedReason,
    };
  }

  if (!requiresProtection) {
    return {
      defenseDecision: "readiness_only",
      requiredProtection: ["public/private boundary check"],
      lockdownRecommended: false,
      auditRequired: false,
      blockedReason: null,
    };
  }

  return {
    defenseDecision: "founder_approval_required",
    requiredProtection: [
      "trusted device readiness",
      "step-up confirmation readiness",
      "passkey readiness",
      "audit ledger readiness",
      "raw secret display blocked",
    ],
    lockdownRecommended: input.category === "security_risk",
    auditRequired: true,
    blockedReason: null,
  };
}
