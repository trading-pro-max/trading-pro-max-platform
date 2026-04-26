import type {
  AlkonRuntimeInput,
  AlkonRuntimeMemory,
  AlkonRuntimeOrbit,
} from "./types";

export const ALKON_RUNTIME_MANDATORY_LESSONS = [
  "No images unless explicit.",
  "No raster assets.",
  "Chart is king.",
  "No duplicate topbars.",
  "No duplicate logos.",
  "Home must not be crowded.",
  "Free is complete, not cheap.",
  "Alkon is private.",
  "No fake claims.",
  "No fake downloads.",
  "No fake support backend.",
  "No fake plan activation.",
  "Earth is product reality.",
  "Assistant is intent interface.",
  "Payments require invoice, budget, reserve, and Founder approval.",
  "Media requires claims firewall.",
  "Sensitive authority requires legitimacy and step-up readiness.",
];

export function createAlkonRuntimeMemory(
  input: AlkonRuntimeInput,
  orbit: AlkonRuntimeOrbit
): AlkonRuntimeMemory {
  const lesson =
    input.category === "chart_issue"
      ? "Chart comfort and chart-first proof are required before accepting workspace work."
      : input.category === "invoice"
        ? "Financial requests stay invoice/budget/reserve readiness only; no payment execution."
        : input.category === "media_message" || input.category === "claim_risk"
          ? "Media messages must pass claims firewall and never imply fake activation."
          : input.category === "live_request" ||
              input.category === "billing_request" ||
              input.category === "broker_feed_request" ||
              input.category === "real_money_request"
            ? "Dangerous activation requests are black-holed and remembered as Product Truth guards."
            : "Every runtime entity needs place, time, law, gravity, orbit, proof, consequence, memory, and fate.";

  return {
    memoryLesson: lesson,
    appliesTo: [input.category, orbit.orbit],
    futureGuard: ALKON_RUNTIME_MANDATORY_LESSONS.join(" | "),
    requiredTest:
      "runtime regression, public leak test, Product Truth test, source scan for secrets/execution/raster assets",
    founderReviewNeeded:
      orbit.orbit === "black_hole_orbit" ||
      input.category === "invoice" ||
      input.category === "claim_risk",
  };
}
