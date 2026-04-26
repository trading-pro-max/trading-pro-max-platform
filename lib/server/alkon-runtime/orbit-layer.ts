import type {
  AlkonRuntimeGravity,
  AlkonRuntimeInput,
  AlkonRuntimeLawDecision,
  AlkonRuntimeOrbit,
  AlkonRuntimeOrbitId,
} from "./types";

function orbitFor(input: AlkonRuntimeInput, law: AlkonRuntimeLawDecision): AlkonRuntimeOrbitId {
  if (law.lawDecision === "black_holed") return "black_hole_orbit";
  if (input.category === "chart_issue") return "market_workspace_orbit";
  if (input.category === "assistant_issue") return "assistant_orbit";
  if (input.category === "visual_rejection") return "earth_identity_orbit";
  if (input.category === "environment_signal") return "environment_orbit";
  if (input.category === "invoice" || input.category === "treasury_event" || input.category === "tax_event") return "treasury_orbit";
  if (input.category === "media_message" || input.category === "claim_risk") return "media_reality_orbit";
  if (input.category === "security_risk") return "security_orbit";
  if (input.category === "secret_risk") return "secrets_orbit";
  if (input.category === "codex_result" || input.category === "build_result" || input.category === "validation_result") return "codex_construction_orbit";
  if (input.category === "launch_request") return "launch_readiness_orbit";
  if (input.category === "legal_question") return "legal_guardian_orbit";
  if (input.category === "cleanup_candidate") return "cleanup_orbit";
  return "public_earth_orbit";
}

export function routeAlkonRuntimeOrbit(
  input: AlkonRuntimeInput,
  law: AlkonRuntimeLawDecision,
  gravity: AlkonRuntimeGravity
): AlkonRuntimeOrbit {
  const orbit = orbitFor(input, law);
  const blackHoled = orbit === "black_hole_orbit";

  return {
    orbit,
    owner: blackHoled
      ? "Alkon Defense / Product Truth"
      : orbit.replace(/_/g, " ").replace(/\b\w/g, (value) => value.toUpperCase()),
    requiredChecks: [
      "Product Truth",
      "Public/private boundary",
      blackHoled ? "Black-hole block" : "Validation proof",
      gravity.gravity === "P0_critical" ? "Founder review" : "Readiness review",
    ],
    requiredProof: blackHoled
      ? ["private blocked-action report", "memory lesson"]
      : ["TypeScript", "ESLint", "build", "regression", "public leak check"],
    allowedActions: blackHoled
      ? ["report", "block", "memory_update"]
      : ["report", "draft_task", "review", "memory_update"],
    forbiddenActions: [
      "shell execution",
      "direct Codex execution",
      "payment execution",
      "deletion execution",
      "external publishing",
      "secret exposure",
    ],
    reportTarget: "Founder Command private runtime report",
    memoryRule: "Record safe lessons only; no secrets or private sensitive data.",
  };
}
