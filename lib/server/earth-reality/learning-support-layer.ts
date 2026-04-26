import type { EarthRealityCheck } from "./types";

export function getEarthLearningSupportLayerChecks(): EarthRealityCheck[] {
  return [
    {
      checkId: "earth_learning_path_exists",
      layer: "learning",
      surface: "academy",
      requirement:
        "Academy path must cover Getting Started, paper trading basics, chart basics, risk basics, Why Blocked, TPM Assistant, and Journal/Coach.",
      decision: "pass",
      reason:
        "Academy readiness provides a public learning ladder without advice or signal rooms.",
      userImpact: "Users can learn before acting.",
      trustImpact: "Learning is framed honestly and safely.",
      safetyImpact: "Education is separated from trading advice.",
      requiredFix: "Keep lesson labels clear and paper-first.",
      publicCopyRule: "Use learning, paper trading basics, chart basics, risk basics, Why Blocked.",
      validationRule: "Academy copy must not give financial advice.",
    },
    {
      checkId: "earth_support_readiness_truth",
      layer: "support",
      surface: "support",
      requirement:
        "Support must show help, contact readiness, problem reporting, security contact, and partnership contact without fake ticketing or email sending.",
      decision: "pass",
      reason:
        "Support is modeled as readiness; no fake ticket backend or email delivery is claimed.",
      userImpact: "Users can find the intended support paths.",
      trustImpact: "No fake operational backend is implied.",
      safetyImpact: "Security contact is visible without exposing private systems.",
      requiredFix: "Only claim backend support after provider and policy review.",
      publicCopyRule: "Use readiness language.",
      validationRule: "Support UI must not claim fake ticket IDs, users, or emails.",
    },
    {
      checkId: "earth_community_truth",
      layer: "support",
      surface: "community",
      requirement:
        "Community must not claim fake members, live rooms, signal rooms, profit screenshots, or copy trading.",
      decision: "pass",
      reason:
        "Community is planned learning/feedback/support structure, not a live signal community.",
      userImpact: "Users understand community is a future support layer.",
      trustImpact: "No fake social proof is invented.",
      safetyImpact: "No signal room or profit pressure exists.",
      requiredFix: "Keep planned labels until real community systems exist.",
      publicCopyRule: "Say planned learning space or feedback space.",
      validationRule: "Community copy must not include fake metrics or signal claims.",
    },
  ];
}
