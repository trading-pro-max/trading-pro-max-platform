import "server-only";

import type { PlanetResource } from "./types";

export const PLANET_RESOURCES: PlanetResource[] = [
  {
    id: "product_truth",
    name: "Product truth",
    category: "hidden_internal",
    purpose: "Canonical blocked, planned, inactive, guarded, and active state language.",
    protection: ["Guardian", "Legal Counsel", "Quality"],
    visibility: "internal",
    mustNotDo: ["convert planned states into public claims", "hide live/billing blockers"],
  },
  {
    id: "platform_data",
    name: "Platform data",
    category: "hidden_internal",
    purpose: "Operational state needed to render safe user surfaces.",
    protection: ["Privacy", "Guardian", "Engineering"],
    visibility: "internal",
    mustNotDo: ["sell private data", "expose secrets", "publish raw user records"],
  },
  {
    id: "journal_insights",
    name: "Journal insights",
    category: "hidden_internal",
    purpose: "Future reflection and learning summaries.",
    protection: ["Privacy", "Legal Counsel", "Guardian"],
    visibility: "plan_scoped",
    mustNotDo: ["promise performance improvement", "infer guaranteed outcomes"],
  },
  {
    id: "ui_chart",
    name: "Chart and workstation UI",
    category: "visible",
    purpose: "Primary public product surface and trading-grade visual center.",
    protection: ["Quality", "Engineering", "Brand"],
    visibility: "public_safe",
    mustNotDo: ["clutter with Planet OS complexity", "fake live brokerage"],
  },
  {
    id: "academy",
    name: "Academy",
    category: "visible",
    purpose: "Safe learning and paper-training content.",
    protection: ["Legal Counsel", "Academy", "Guardian"],
    visibility: "public_safe",
    mustNotDo: ["provide financial advice", "use gambling prompts"],
  },
  {
    id: "community_activity",
    name: "Community activity",
    category: "living",
    purpose: "Future citizen discussions and support flow.",
    protection: ["Guardian", "Community", "Legal Counsel"],
    visibility: "plan_scoped",
    mustNotDo: ["fake active users", "permit scam/signal selling claims"],
  },
  {
    id: "feedback_flow",
    name: "Feedback flow",
    category: "living",
    purpose: "Review-bound improvement signal from users and operators.",
    protection: ["Support", "Quality", "Guardian"],
    visibility: "internal",
    mustNotDo: ["claim public beta scale", "expose private feedback"],
  },
  {
    id: "trust",
    name: "Trust",
    category: "strategic",
    purpose: "The planet's most important strategic asset.",
    protection: ["Founder Command", "Legal Counsel", "Guardian", "Quality"],
    visibility: "public_safe",
    mustNotDo: ["overclaim", "copy competitors", "fake readiness"],
  },
  {
    id: "time",
    name: "Time and Swiss precision",
    category: "strategic",
    purpose: "Clock, cadence, audit, reporting, and disciplined operating rhythm.",
    protection: ["Ops", "Records", "Brand"],
    visibility: "public_safe",
    mustNotDo: ["fake market live status", "claim Swiss company status"],
  },
  {
    id: "founder_decisions",
    name: "Founder decisions",
    category: "strategic",
    purpose: "Sensitive final approvals and strategic direction.",
    protection: ["Founder Command", "Constitutional Council", "Guardian", "Legal Counsel"],
    visibility: "founder_private",
    mustNotDo: ["automate critical approvals", "override critical blocks without remediation"],
  },
];

export function getPlanetResourceSnapshot(checkedAt = new Date().toISOString()) {
  const categories = Array.from(new Set(PLANET_RESOURCES.map((resource) => resource.category)));

  return {
    checkedAt,
    mode: "planet_resources",
    resources: PLANET_RESOURCES,
    categories,
    summary: {
      total: PLANET_RESOURCES.length,
      categories: categories.length,
      hiddenInternal: PLANET_RESOURCES.filter(
        (resource) => resource.category === "hidden_internal"
      ).length,
      visible: PLANET_RESOURCES.filter((resource) => resource.category === "visible").length,
      living: PLANET_RESOURCES.filter((resource) => resource.category === "living").length,
      strategic: PLANET_RESOURCES.filter(
        (resource) => resource.category === "strategic"
      ).length,
      privateDataSaleAllowed: false,
      fakeMetricsAllowed: false,
    },
  };
}
