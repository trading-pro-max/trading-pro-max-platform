import type {
  AlkonRuntimeInput,
  AlkonRuntimeLawDecision,
  AlkonRuntimeLife,
  AlkonRuntimeOrbit,
} from "./types";

export function assignAlkonRuntimeLife(
  input: AlkonRuntimeInput,
  law: AlkonRuntimeLawDecision,
  orbit: AlkonRuntimeOrbit
): AlkonRuntimeLife {
  if (law.lawDecision === "black_holed") {
    return {
      lifecycleState: "black_holed",
      requiredProof: ["blocked action report", "memory update"],
      monitoringNeed: "Monitor repeated forbidden requests.",
      evolutionRule: "Strengthen prompt/task guard for this forbidden category.",
      deprecationRule: "Not applicable; forbidden request cannot live.",
      removalRule: "No deletion execution; archive the blocked report only.",
    };
  }

  const requiredProof = [...orbit.requiredProof];
  if (input.publicVisible) requiredProof.push("screenshot or route proof");
  if (input.category === "invoice") requiredProof.push("invoice/accounting readiness");
  if (input.category === "media_message") requiredProof.push("claims review");

  return {
    lifecycleState: law.lawDecision === "public_safe" ? "reviewed" : "identified",
    requiredProof,
    monitoringNeed:
      "Monitor usefulness, owner, proof, Product Truth, public boundary, clutter, and repeated Founder feedback.",
    evolutionRule:
      "Convert repeated mistakes into future guardrails and regression tests.",
    deprecationRule:
      "Deprecate if purpose, owner, proof, value, or boundary safety disappears.",
    removalRule:
      "Only mark removal candidate after dependency migration, rollback, report, and memory archive.",
  };
}
