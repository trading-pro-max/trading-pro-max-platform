import type { PersonalRealityIntentInterpretation } from "./types";

const blockedNeedles = [
  "activate billing",
  "checkout",
  "live trading",
  "enable live",
  "real money",
  "connect broker",
  "activate feed",
  "production",
  "public launch",
  "publish social",
  "guarantee profit",
  "win rate",
  "show alkon",
  "founder command",
  "secrets",
];

export function guardPersonalRealityProductTruth(
  rawInput: string,
  interpretation: PersonalRealityIntentInterpretation
) {
  const normalized = rawInput.toLowerCase();
  const blockedReasons = blockedNeedles.filter((needle) =>
    normalized.includes(needle)
  );

  if (
    interpretation.intent === "blocked_activation_request" ||
    blockedReasons.length > 0
  ) {
    return {
      allowed: false,
      blockedReasons,
      explanation:
        "Product Truth blocks activation, paid-plan unlocking, live execution, broker/feed, real money, billing, launch, publishing, private-system exposure, and guaranteed outcomes.",
      safeAlternative:
        "I can explain why the request is blocked and suggest an allowed Personal Reality setting such as Calm Workspace, Chart Comfort, Static Mode, Low Motion, or High Contrast.",
    };
  }

  return {
    allowed: true,
    blockedReasons: [],
    explanation: "Product Truth preserved.",
    safeAlternative: "Apply or preview allowed public-safe settings only.",
  };
}
