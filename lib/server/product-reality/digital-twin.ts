import "server-only";

import type { ProductSurfaceDigitalTwinLayer } from "./types";

const forbiddenUserLeaks = [
  "Founder Command",
  "Founder King",
  "ministries",
  "councils",
  "states",
  "governance",
  "Planet OS",
  "performance fee",
];

export function getProductSurfaceDigitalTwinSnapshot(
  checkedAt = new Date().toISOString()
) {
  const layers: ProductSurfaceDigitalTwinLayer[] = [
    {
      role: "Guest",
      visibleSurfaces: ["public entry", "plan overview", "readiness copy"],
      hiddenSurfaces: ["Trading Workspace depth", "Founder Command", "internal reports"],
      plannedSurfaces: ["Academy preview"],
      blockedSurfaces: ["live execution", "real money", "billing", "broker/feed"],
      forbiddenLeaks: forbiddenUserLeaks,
      planLanguage: "Free / Pro / VIP / Institutional",
      assistantCapabilities: ["orientation only"],
      productTruth: ["public launch inactive", "billing inactive"],
      founderCommandExposure: "hidden",
    },
    {
      role: "Free",
      visibleSurfaces: ["Trading Workspace", "TPM Assistant", "Journal", "Coach", "Settings", "Diagnostics"],
      hiddenSurfaces: ["Founder Command", "premium reports", "VIP rooms"],
      plannedSurfaces: ["Pro workspace", "VIP advanced layer"],
      blockedSurfaces: ["live execution", "real money", "billing", "broker/feed"],
      forbiddenLeaks: forbiddenUserLeaks,
      planLanguage: "Free active paper-safe",
      assistantCapabilities: ["basic safe guidance", "why blocked", "learning prompts"],
      productTruth: ["paper-safe", "live blocked", "billing inactive"],
      founderCommandExposure: "hidden",
    },
    {
      role: "Pro",
      visibleSurfaces: ["Free surfaces", "planned professional workspace"],
      hiddenSurfaces: ["Founder Command"],
      plannedSurfaces: ["deeper Journal/Coach", "decision replay", "alerts/workflows"],
      blockedSurfaces: ["fake Pro active claim", "billing activation"],
      forbiddenLeaks: forbiddenUserLeaks,
      planLanguage: "Pro planned unless entitled",
      assistantCapabilities: ["richer guidance planned"],
      productTruth: ["Pro not fake active"],
      founderCommandExposure: "hidden",
    },
    {
      role: "VIP",
      visibleSurfaces: ["Free surfaces", "planned premium advanced layer"],
      hiddenSurfaces: ["Founder Command"],
      plannedSurfaces: ["VIP Assistant", "strategy review", "premium reports", "private rooms"],
      blockedSurfaces: ["fake VIP active claim", "guaranteed signals"],
      forbiddenLeaks: forbiddenUserLeaks,
      planLanguage: "VIP planned unless entitled",
      assistantCapabilities: ["advanced support planned"],
      productTruth: ["VIP not fake active"],
      founderCommandExposure: "hidden",
    },
    {
      role: "Institutional",
      visibleSurfaces: ["future team/admin/audit/compliance concept"],
      hiddenSurfaces: ["Founder Command"],
      plannedSurfaces: ["team controls", "audit", "compliance"],
      blockedSurfaces: ["fake availability claim"],
      forbiddenLeaks: forbiddenUserLeaks,
      planLanguage: "Institutional future",
      assistantCapabilities: ["future team/admin guidance"],
      productTruth: ["Institutional future only"],
      founderCommandExposure: "hidden",
    },
    {
      role: "Founder",
      visibleSurfaces: ["Founder Command", "internal reports", "construction readiness"],
      hiddenSurfaces: [],
      plannedSurfaces: ["native desktop/mobile command app"],
      blockedSurfaces: ["approval execution", "secret exposure"],
      forbiddenLeaks: ["secrets", "private user data", "fake metrics"],
      planLanguage: "owner-only internal",
      assistantCapabilities: ["Founder Companion read-only guidance"],
      productTruth: ["no activation authority without future gates"],
      founderCommandExposure: "owner_only",
    },
  ];

  return {
    checkedAt,
    mode: "product_surface_digital_twin",
    layers,
    truth: {
      usersSeeFounderCommand: false,
      enterprisePublicLabelAllowed: false,
      performanceFeePubliclyVisible: false,
      fakeBillingLiveLaunchClaimsAllowed: false,
    },
  };
}
