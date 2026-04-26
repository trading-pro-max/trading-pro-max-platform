import type {
  AlkonRuntimeCommunication,
  AlkonRuntimeInput,
  AlkonRuntimeLawDecision,
} from "./types";

function communicationText(input: AlkonRuntimeInput) {
  return `${input.title} ${input.description} ${input.claimText ?? ""}`.toLowerCase();
}

export function evaluateAlkonRuntimeCommunication(
  input: AlkonRuntimeInput,
  law: AlkonRuntimeLawDecision
): AlkonRuntimeCommunication {
  const isCommunication =
    input.category === "media_message" ||
    input.category === "claim_risk" ||
    input.category === "public_feedback" ||
    Boolean(input.claimText);

  if (!isCommunication) {
    return {
      communicationDecision: "not_applicable",
      claimsRisk: "none",
      safeWording: "No public message is prepared.",
      requiredReview: [],
      publishingStatus: "inactive",
    };
  }

  const text = communicationText(input);
  const risky =
    text.includes("profit") ||
    text.includes("win-rate") ||
    text.includes("swiss") ||
    text.includes("sharia") ||
    text.includes("app store") ||
    text.includes("play store") ||
    text.includes("live trading");

  if (law.lawDecision === "black_holed" || risky) {
    return {
      communicationDecision: law.lawDecision === "black_holed" ? "black_holed" : "blocked",
      claimsRisk: law.lawDecision === "black_holed" ? "black_hole" : "high",
      safeWording:
        "Keep public wording truthful: paper-safe, planned, inactive, future, and readiness-only.",
      requiredReview: ["claims_firewall", "legal_guardian_review", "Founder review"],
      publishingStatus: "inactive",
    };
  }

  return {
    communicationDecision: "review_required",
    claimsRisk: "medium",
    safeWording:
      "Trading Pro Max is paper-safe locally; external apps, billing, live execution, and publishing remain inactive or planned.",
    requiredReview: ["claims_firewall"],
    publishingStatus: "inactive",
  };
}
