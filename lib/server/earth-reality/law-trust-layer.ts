import type { EarthRealityCheck } from "./types";

export function getEarthLawTrustLayerChecks(): EarthRealityCheck[] {
  return [
    {
      checkId: "earth_law_no_fake_claims",
      layer: "law",
      surface: "plans",
      requirement:
        "Public plan and legal copy must not claim financial advice, guaranteed profit, win rate, Swiss legal/company status, Sharia certification, fake partnerships, fake downloads, or fake support.",
      decision: "pass",
      reason:
        "Product Truth keeps paid activation, legal certification, and support backend claims inactive or readiness-only.",
      userImpact: "Users see what is real today.",
      trustImpact: "The platform avoids invented authority.",
      safetyImpact: "No risky legal or performance claim is surfaced.",
      requiredFix: "Require review before legal, certification, partnership, pricing, or support claims change.",
      publicCopyRule: "Use active, planned, future, inactive, blocked.",
      validationRule: "Public copy must not include fake claim patterns.",
    },
    {
      checkId: "earth_trust_plan_truth",
      layer: "trust",
      surface: "plans",
      requirement:
        "Pro, VIP, and Institutional must remain planned/locked/future unless real entitlement gates exist.",
      decision: "pass",
      reason:
        "Entitlements and plan realms keep Free active, Pro/VIP planned, and Institutional future.",
      userImpact: "Users are not misled into paid or premium access.",
      trustImpact: "Plan boundaries remain credible.",
      safetyImpact: "No fake VIP or Institutional activation.",
      requiredFix: "Keep billing and paid access disabled until a reviewed launch gate.",
      publicCopyRule: "Explain locked/planned states calmly.",
      validationRule: "Plan APIs and UI must not report paid access active.",
    },
  ];
}
