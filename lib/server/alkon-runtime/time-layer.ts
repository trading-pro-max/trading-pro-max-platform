import type { AlkonRuntimeInput, AlkonRuntimeTime } from "./types";

export function assignAlkonRuntimeTime(
  input: AlkonRuntimeInput
): AlkonRuntimeTime {
  if (
    input.category === "billing_request" ||
    input.category === "live_request" ||
    input.category === "broker_feed_request" ||
    input.category === "real_money_request" ||
    input.category === "social_publish_request"
  ) {
    return {
      cycle: "Launch Cycle",
      decision: "blocked_now",
      reason:
        "Dangerous activation is not valid in local/laptop planet scope and cannot move now.",
      readinessGate: "Product Truth and launch gate block",
    };
  }

  if (input.category === "invoice" || input.category === "treasury_event") {
    return {
      cycle: "Treasury Cycle",
      decision: input.hasInvoice ? "after_accounting_review" : "after_accounting_review",
      reason:
        "Financial work remains invoice, budget, reserve, accountant, and Founder review readiness only.",
      readinessGate: "Treasury/accounting readiness",
    };
  }

  if (input.category === "media_message" || input.category === "claim_risk") {
    return {
      cycle: "Media Cycle",
      decision: "after_legal_review",
      reason:
        "Public claims and media copy need claims firewall and Legal/Guardian review before any public use.",
      readinessGate: "Claims firewall and review gate",
    };
  }

  if (input.visualSensitive || input.category === "visual_rejection") {
    return {
      cycle: "Review Cycle",
      decision: "after_visual_acceptance",
      reason:
        "Visual-sensitive work can be drafted locally but needs human visual acceptance before reality admission.",
      readinessGate: "Visual acceptance",
    };
  }

  return {
    cycle: "Build Cycle",
    decision: "next_build_cycle",
    reason:
      "Safe local improvements may enter the next build cycle as draft/review work.",
    readinessGate: "Local validation and Product Truth",
  };
}
