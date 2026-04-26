import "server-only";

import type {
  SurfaceBoundaryCategory,
  SurfaceBoundaryContract,
  SurfaceBoundaryKey,
  SurfaceBoundarySnapshot,
} from "./types";
import {
  PUBLIC_ALLOWED_TERMS,
  PUBLIC_FORBIDDEN_TERMS,
} from "./output-mapper";

const publicVisibleSystems = [
  "Product Truth summary",
  "Plan truth",
  "Pro Max Assistant",
  "Why Blocked",
  "Journal/Coach",
  "Readiness",
];

const founderHiddenSystems = [
  "Founder Command",
  "local operations",
  "construction queue",
  "Codex task drafts",
  "product memory internals",
  "secrets authority",
  "security sovereignty",
  "treasury controls",
  "approvals",
];

function boundary(
  key: SurfaceBoundaryKey,
  label: string,
  audience: SurfaceBoundaryCategory,
  visibleSystems: string[],
  hiddenSystems: string[],
  founderOnly = false
): SurfaceBoundaryContract {
  const publicLike =
    audience === "public_user" ||
    audience === "authenticated_user" ||
    audience === "advanced_user" ||
    audience === "diagnostics_public_safe";

  return {
    key,
    label,
    audience,
    allowedTerminology: publicLike
      ? PUBLIC_ALLOWED_TERMS
      : [...PUBLIC_ALLOWED_TERMS, ...founderHiddenSystems],
    forbiddenTerminology: publicLike ? PUBLIC_FORBIDDEN_TERMS : [],
    visibleSystems,
    hiddenSystems,
    productTruthAllowed: true,
    planTruthAllowed: publicLike || audience === "private_founder",
    founderOnly,
    riskLevel: founderOnly
      ? "critical"
      : audience === "internal_readiness" || audience === "invisible_operating_layer"
      ? "high"
      : audience === "diagnostics_public_safe"
      ? "medium"
      : "low",
    leakPreventionRules: publicLike
      ? [
          "Use public product words only.",
          "Show simple blocked/inactive/planned truth.",
          "Hide private command, construction, memory, security, and approval internals.",
          "Never claim live, billing, broker/feed, production, launch, paid activation, users, revenue, or metrics.",
        ]
      : [
          "Never expose secrets or private sensitive data.",
          "Keep dangerous actions blocked and review-gated.",
          "Do not link private surfaces from public navigation.",
        ],
  };
}

export const SURFACE_BOUNDARY_CONTRACTS: SurfaceBoundaryContract[] = [
  boundary("public_entry", "Home", "public_user", publicVisibleSystems, founderHiddenSystems),
  boundary("trading_workspace", "Trading Workspace", "authenticated_user", publicVisibleSystems, founderHiddenSystems),
  boundary("markets", "Markets", "public_user", ["Market category readiness", "Paper-safe/fallback state"], founderHiddenSystems),
  boundary("plans", "Plans", "public_user", ["Free", "Pro", "VIP", "Institutional", "Plan truth"], founderHiddenSystems),
  boundary("apps_platforms", "Apps / Platforms", "public_user", ["Web App", "Desktop App planned", "Mobile App planned"], founderHiddenSystems),
  boundary("academy", "Academy", "public_user", ["Learning paths", "Risk basics", "Pro Max Assistant guide"], founderHiddenSystems),
  boundary("community", "Community", "public_user", ["Planned learning spaces", "Safety rules"], founderHiddenSystems),
  boundary("support", "Support", "public_user", ["Help Center", "Contact Support", "Report a Problem", "Security Contact"], founderHiddenSystems),
  boundary("settings", "Settings", "authenticated_user", ["Account/session", "Plan", "Assistant", "Journal/Coach", "Theme", "Language", "Product truth"], founderHiddenSystems),
  boundary("diagnostics", "Diagnostics", "diagnostics_public_safe", ["System readiness", "Workspace readiness", "Assistant readiness", "Plan readiness", "Safety status", "Service availability", "Product Truth summary"], founderHiddenSystems),
  boundary("assistant", "Pro Max Assistant", "public_user", ["Platform state help", "Plan guidance", "Why Blocked", "Journal/Coach prompts"], founderHiddenSystems),
  boundary("journal_coach", "Journal / Coach", "authenticated_user", ["Paper-session notes", "Learning prompts", "Coach reflection"], founderHiddenSystems),
  boundary("founder_command", "Founder Command", "private_founder", founderHiddenSystems, ["public navigation", "user plans"], true),
  boundary("local_operations", "Local operations", "private_founder", ["Local day cycle", "Founder acceptance", "Validation summaries"], ["public navigation"], true),
  boundary("construction_queue", "Construction queue", "private_founder", ["Codex task drafts", "Validation outcomes", "Build decisions"], ["public navigation", "automatic execution"], true),
  boundary("product_memory", "Product memory", "invisible_operating_layer", ["Safe local summaries", "Founder acceptance", "Product gaps"], ["public UI details", "secrets"], false),
  boundary("secrets_authority", "Secrets authority", "private_founder", ["Status-only readiness", "Rotation readiness", "Exposure policy"], ["raw values", "public UI"], true),
  boundary("world_interface", "World Interface", "internal_readiness", ["Channel readiness", "Quarantine readiness", "Draft-only responses"], ["tokens", "sending", "publishing"], false),
  boundary("security_sovereignty", "Security sovereignty", "internal_readiness", ["Safety readiness", "Incident readiness", "Hardening readiness"], ["offensive instructions", "public command details"], false),
  boundary("media_office", "Media Office", "internal_readiness", ["Content review lifecycle", "Blocked claims", "Draft queues"], ["publishing", "social tokens"], false),
  boundary("treasury", "Treasury", "private_founder", ["Billing inactive truth", "Revenue readiness", "Review gates"], ["public plan cards", "checkout"], true),
  boundary("codex_tasks", "Codex tasks", "private_founder", ["Draft-only build tasks", "Validation commands"], ["automatic sending", "public UI"], true),
];

export function getSurfaceBoundaryContract(key: SurfaceBoundaryKey) {
  return SURFACE_BOUNDARY_CONTRACTS.find((surface) => surface.key === key);
}

export function getSurfaceBoundariesByAudience(audience: SurfaceBoundaryCategory) {
  return SURFACE_BOUNDARY_CONTRACTS.filter((surface) => surface.audience === audience);
}

export function getSurfaceBoundarySnapshot(
  checkedAt = new Date().toISOString()
): SurfaceBoundarySnapshot {
  return {
    checkedAt,
    mode: "dual_world_surface_boundaries",
    doctrine: {
      publicUserWorld: "Simple professional trading product.",
      privateFounderWorld: "Private owner command, review, security, build, and readiness control.",
      invisibleOperatingLayer: "Complexity, truth, safety, memory, and routing remain behind simplified outputs.",
      coreLaw:
        "The user sees simplicity. The founder sees control. The invisible operating layer carries complexity.",
    },
    publicAllowedLanguage: PUBLIC_ALLOWED_TERMS,
    publicForbiddenLanguage: PUBLIC_FORBIDDEN_TERMS,
    surfaces: SURFACE_BOUNDARY_CONTRACTS,
    summary: {
      publicSurfaces: SURFACE_BOUNDARY_CONTRACTS.filter((surface) =>
        ["public_user", "authenticated_user", "advanced_user", "diagnostics_public_safe"].includes(
          surface.audience
        )
      ).length,
      privateFounderSurfaces: SURFACE_BOUNDARY_CONTRACTS.filter(
        (surface) => surface.audience === "private_founder"
      ).length,
      invisibleLayerSurfaces: SURFACE_BOUNDARY_CONTRACTS.filter(
        (surface) =>
          surface.audience === "internal_readiness" ||
          surface.audience === "invisible_operating_layer"
      ).length,
      publicNavigationComplete: true,
      publicDiagnosticsSafe: true,
      privateFounderWorldLinkedPublicly: false,
      internalTermsAllowedInPublicUi: false,
    },
    truth: {
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerFeedActivation: "blocked",
      billingActivation: "blocked",
      publicLaunch: "inactive",
      socialPublishing: "inactive",
      secretsExposed: false,
      fakeUsersRevenueMetrics: false,
      uncontrolledAutomation: false,
    },
  };
}
