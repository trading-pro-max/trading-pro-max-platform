import type {
  AlkonRuntimeGravity,
  AlkonRuntimeInput,
  AlkonRuntimeLawDecision,
} from "./types";

export function assignAlkonRuntimeGravity(
  input: AlkonRuntimeInput,
  law: AlkonRuntimeLawDecision
): AlkonRuntimeGravity {
  if (law.lawDecision === "black_holed") {
    return {
      gravity: "black_hole",
      reason: "The runtime must isolate forbidden activation, secrets, payment, fake claim, or public Alkon exposure.",
      urgency: "Immediate private block",
      escalationTarget: "Founder Command private risk report",
      nextSafeAction: law.safeAlternative,
    };
  }

  if (
    input.category === "secret_risk" ||
    input.category === "security_risk" ||
    input.category === "build_result" ||
    input.category === "validation_result" ||
    input.category === "claim_risk"
  ) {
    return {
      gravity: "P0_critical",
      reason: "Security, validation, build, and fake-claim risks can damage trust or Product Truth.",
      urgency: "Same review cycle",
      escalationTarget: "Defense / Product Truth / Result Tribunal",
      nextSafeAction: "Prepare a private review report and block reality admission until proof exists.",
    };
  }

  if (
    input.category === "chart_issue" ||
    input.category === "visual_rejection" ||
    input.category === "shell_issue" ||
    input.category === "assistant_issue" ||
    input.category === "support_gap" ||
    input.category === "apps_gap"
  ) {
    return {
      gravity: "P1_high",
      reason: "This affects clarity, chart comfort, Assistant trust, support, or public product acceptance.",
      urgency: "Next safe build",
      escalationTarget: "Relevant product orbit",
      nextSafeAction: "Draft a scoped fix with proof and public leak regression.",
    };
  }

  if (input.currentStage === "production") {
    return {
      gravity: "blocked",
      reason: "Production-stage activation is outside local/laptop planet scope.",
      urgency: "Blocked",
      escalationTarget: "Launch Gate",
      nextSafeAction: "Return to local readiness and audit gates.",
    };
  }

  return {
    gravity: "P2_standard",
    reason: "Safe local polish, docs, tests, readiness, or monitoring work.",
    urgency: "Normal build queue",
    escalationTarget: "Founder Command",
    nextSafeAction: "Keep as local readiness with validation.",
  };
}
