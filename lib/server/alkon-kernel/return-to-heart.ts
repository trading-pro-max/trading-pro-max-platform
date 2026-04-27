import type { ReturnToHeartDecision } from "./types";

type ReturnToHeartOptions = {
  servesHeart?: boolean;
  p0Blocker?: boolean;
  visualAcceptanceBlocked?: boolean;
  futureExpansion?: boolean;
};

const heart = [
  "Pro Max Trading",
  "Trading Workspace",
  "Chart",
  "Paper Execution",
  "Pro Max Assistant",
  "Product Truth",
  "Local Day One",
];

export function getReturnToHeartDecision(
  options: ReturnToHeartOptions = {}
): ReturnToHeartDecision {
  if (options.p0Blocker) {
    return {
      heart,
      decision: "block",
      reason: "A P0 truth, security, build, or public leak issue overrides all future work.",
      nextAction: "Fix the P0 blocker before adding depth.",
    };
  }

  if (options.visualAcceptanceBlocked) {
    return {
      heart,
      decision: "return_to_heart",
      reason: "Visual acceptance is blocked, so Alkon returns to Home and Workspace review.",
      nextAction: "Request Ahmad's visual review or prepare a focused correction.",
    };
  }

  if (options.futureExpansion) {
    return {
      heart,
      decision: "delay",
      reason: "Future expansion distracts from Station 1 and Local Day One readiness.",
      nextAction: "Delay future worlds until the first heart is accepted.",
    };
  }

  if (options.servesHeart === false) {
    return {
      heart,
      decision: "archive",
      reason: "The action does not serve the current heart.",
      nextAction: "Archive or delay it and return to the Trading Workspace.",
    };
  }

  return {
    heart,
    decision: "accept",
    reason: "The action serves the current heart without violating Product Truth.",
    nextAction: "Proceed only through evidence, tests, memory, and Ahmad gates.",
  };
}
