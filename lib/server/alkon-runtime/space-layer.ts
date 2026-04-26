import type { AlkonRuntimeInput, AlkonRuntimeSpace } from "./types";

const privateCategories = new Set<AlkonRuntimeInput["category"]>([
  "invoice",
  "treasury_event",
  "tax_event",
  "security_risk",
  "secret_risk",
  "codex_result",
  "cleanup_candidate",
  "device_event",
]);

const blackHoleCategories = new Set<AlkonRuntimeInput["category"]>([
  "billing_request",
  "live_request",
  "broker_feed_request",
  "real_money_request",
  "social_publish_request",
]);

export function assignAlkonRuntimeSpace(
  input: AlkonRuntimeInput
): AlkonRuntimeSpace {
  const requestedPublicPrivateLeak =
    input.publicVisible === true &&
    (input.affectedWorld === "private_alkon" ||
      input.description.toLowerCase().includes("public alkon"));

  if (blackHoleCategories.has(input.category) || requestedPublicPrivateLeak) {
    return {
      assignedWorld: "private_alkon",
      assignedSpace: "Black Hole Zone",
      publicVisible: false,
      founderVisible: true,
      leakRisk: requestedPublicPrivateLeak,
      safePublicName: "Blocked readiness request",
    };
  }

  if (input.category === "chart_issue") {
    return {
      assignedWorld: "public_earth",
      assignedSpace: "Market Workspace",
      publicVisible: false,
      founderVisible: true,
      leakRisk: false,
      safePublicName: "Workspace readiness",
    };
  }

  if (input.category === "assistant_issue") {
    return {
      assignedWorld: "public_earth",
      assignedSpace: "Assistant Layer",
      publicVisible: false,
      founderVisible: true,
      leakRisk: false,
      safePublicName: "TPM Assistant readiness",
    };
  }

  if (input.category === "media_message" || input.category === "claim_risk") {
    return {
      assignedWorld: "private_alkon",
      assignedSpace: "Media Orbit",
      publicVisible: false,
      founderVisible: true,
      leakRisk: false,
      safePublicName: "Media readiness",
    };
  }

  if (privateCategories.has(input.category)) {
    return {
      assignedWorld: "private_alkon",
      assignedSpace:
        input.category === "secret_risk" || input.category === "security_risk"
          ? "Security Orbit"
          : input.category === "invoice" || input.category === "treasury_event"
            ? "Treasury Orbit"
            : "Founder Private World",
      publicVisible: false,
      founderVisible: true,
      leakRisk: false,
      safePublicName: "Private readiness",
    };
  }

  return {
    assignedWorld: input.affectedWorld ?? "public_earth",
    assignedSpace:
      input.affectedWorld === "invisible_operating_layer"
        ? "Invisible Operating Layer"
        : "Earth Public World",
    publicVisible: input.publicVisible === true && input.affectedWorld !== "private_alkon",
    founderVisible: true,
    leakRisk: false,
    safePublicName: "Trading Pro Max readiness",
  };
}
