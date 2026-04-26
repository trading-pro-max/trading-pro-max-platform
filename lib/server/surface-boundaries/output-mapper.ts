import "server-only";

import type {
  InvisibleLayerMappingKey,
  InvisibleLayerOutputMapping,
} from "./types";

export const PUBLIC_FORBIDDEN_TERMS = [
  "Founder King",
  "Kingdom",
  "ministries",
  "councils",
  "states",
  "presidency",
  "governance",
  "construction queue",
  "Codex task",
  "secrets authority",
  "treasury controls",
  "Founder Command",
  "local universe",
  "product memory internals",
];

export const PUBLIC_ALLOWED_TERMS = [
  "Pro Max",
  "Pro Max Trading",
  "Free",
  "Pro",
  "VIP",
  "Institutional",
  "Pro Max Assistant",
  "Trading Workspace",
  "Markets",
  "Apps / Platforms",
  "Academy",
  "Community",
  "Support",
  "Journal",
  "Coach",
  "Premium Reports",
  "Settings",
  "Diagnostics",
  "Readiness",
  "Web App",
  "Desktop App planned",
  "Mobile App planned",
  "Paper-safe",
  "Planned",
  "Inactive",
  "Blocked",
  "Not certified",
  "Local only",
];

export const INVISIBLE_LAYER_OUTPUT_MAPPINGS: InvisibleLayerOutputMapping[] = [
  {
    key: "product_truth_live_blocked",
    internalSystem: "Product Truth live execution block",
    publicOutput: "Live execution is not active.",
    founderOutput: "Product Truth confirms live execution remains blocked.",
    hiddenFromPublic: false,
  },
  {
    key: "billing_inactive",
    internalSystem: "Commercial and treasury readiness",
    publicOutput: "Billing is not active.",
    founderOutput: "Treasury controls remain readiness-only; billing activation is blocked.",
    hiddenFromPublic: false,
  },
  {
    key: "vip_planned",
    internalSystem: "Plan entitlements",
    publicOutput: "VIP is planned.",
    founderOutput: "VIP remains planned until entitlement, billing, legal, and safety gates exist.",
    hiddenFromPublic: false,
  },
  {
    key: "founder_command_private",
    internalSystem: "Founder Command",
    publicOutput: "That area is not part of user plans.",
    founderOutput: "Founder Command is private, owner-only, and never exposed in public navigation.",
    hiddenFromPublic: true,
  },
  {
    key: "security_sovereignty",
    internalSystem: "Security sovereignty",
    publicOutput: "Safety readiness is active.",
    founderOutput: "Security sovereignty reports red, blue, purple, incident, evidence, and hardening readiness.",
    hiddenFromPublic: false,
  },
  {
    key: "product_memory",
    internalSystem: "Product memory",
    publicOutput: "Journal notes use safe local/session memory where available.",
    founderOutput: "Product memory stores safe local reports, acceptance, gaps, validation, and build outcomes.",
    hiddenFromPublic: true,
  },
  {
    key: "construction_queue",
    internalSystem: "Construction queue",
    publicOutput: "",
    founderOutput: "Construction queue is draft-only and waits for Ahmad approval before separate Codex work.",
    hiddenFromPublic: true,
  },
  {
    key: "world_interface",
    internalSystem: "World Interface readiness",
    publicOutput: "Support channels are planned or readiness-only.",
    founderOutput: "World Interface classifies external email, support, media, security, and partner requests without sending.",
    hiddenFromPublic: false,
  },
  {
    key: "media_office",
    internalSystem: "Media Office",
    publicOutput: "Academy, Community, and updates remain draft/review safe.",
    founderOutput: "Media Office and AI Video Studio stay draft-only with Guardian, Legal, and Founder approval gates.",
    hiddenFromPublic: false,
  },
];

export function mapInvisibleLayerOutput(
  key: InvisibleLayerMappingKey,
  audience: "public" | "founder" = "public"
) {
  const mapping =
    INVISIBLE_LAYER_OUTPUT_MAPPINGS.find((item) => item.key === key) ??
    INVISIBLE_LAYER_OUTPUT_MAPPINGS[0];

  return audience === "founder" ? mapping.founderOutput : mapping.publicOutput;
}

export function sanitizePublicSurfaceCopy(value: string) {
  return PUBLIC_FORBIDDEN_TERMS.reduce((result, term) => {
    const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    return result.replace(pattern, "user-facing controls");
  }, value)
    .replace(/\bPlanet OS\b/gi, "product readiness")
    .replace(/\bPlanet\b/g, "Product")
    .replace(/\bgovernance\b/gi, "readiness");
}
