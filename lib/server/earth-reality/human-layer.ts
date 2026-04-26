import type { EarthRealityCheck } from "./types";

export function getEarthHumanLayerChecks(): EarthRealityCheck[] {
  return [
    {
      checkId: "earth_human_home_understandable",
      layer: "human",
      surface: "home",
      requirement:
        "Home explains what Trading Pro Max is and how to start without overwhelming a real person.",
      decision: "pass",
      reason:
        "Home has public shell navigation, workspace entry, plan strip, Apps / Platforms, and safety truth.",
      userImpact: "Users can orient themselves and enter the workspace.",
      trustImpact: "Clear public language avoids hidden-system confusion.",
      safetyImpact: "No unsafe activation is presented as a next step.",
      requiredFix: "Keep Home guided and compact during future additions.",
      publicCopyRule: "Use Trading Pro Max and public plan names only.",
      validationRule: "Public Home must show a clear next step and no private terms.",
    },
    {
      checkId: "earth_human_free_complete",
      layer: "human",
      surface: "plans",
      requirement: "Free must feel complete, not cheap.",
      decision: "pass",
      reason:
        "Free is the active Earth-native paper-safe web workspace with Assistant, Journal/Coach basics, Academy basics, and support readiness.",
      userImpact: "Users can practice without feeling pushed into fake paid access.",
      trustImpact: "Plan value is truthful and non-pressuring.",
      safetyImpact: "No dark-pattern upgrade pressure is needed.",
      requiredFix: "Keep Free identity clean and avoid premium-gold dominance.",
      publicCopyRule: "Say active, paper-safe, and complete starting experience.",
      validationRule: "Free surfaces must avoid fake Pro/VIP capabilities.",
    },
    {
      checkId: "earth_human_accessibility",
      layer: "human",
      surface: "settings",
      requirement:
        "Reduced motion, Static Mode, and High Contrast must remain available and user-controlled.",
      decision: "pass",
      reason:
        "Adaptive Atmosphere exposes user controls and Personal Reality adds accessibility profiles.",
      userImpact: "Users can lower motion, increase contrast, and calm the workspace.",
      trustImpact: "The platform respects human comfort over visual spectacle.",
      safetyImpact: "Reduced motion protects focus and chart readability.",
      requiredFix: "Keep controls visible in Settings.",
      publicCopyRule: "Use Personal Reality, Static Mode, Low Motion, and High Contrast.",
      validationRule: "Settings must include user-safe experience controls.",
    },
  ];
}
