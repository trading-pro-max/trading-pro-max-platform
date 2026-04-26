import "server-only";

import type { OrbitPath, SatelliteMonitor, SatelliteMonitorId } from "./types";

export const SATELLITE_MONITORS: Record<SatelliteMonitorId, SatelliteMonitor> = {
  public_ui_satellite: {
    id: "public_ui_satellite",
    name: "Public UI Satellite",
    monitors: ["home", "plans", "apps", "academy", "community", "support"],
    detectsSignals: ["crowding", "navigation gaps", "unclear state language"],
    requiredEvidence: ["public screenshot", "text leak scan", "route smoke"],
    reportingTarget: "Earth Public World",
    validationRule: "Public copy must stay within Trading Pro Max user language.",
  },
  logo_satellite: {
    id: "logo_satellite",
    name: "Logo Satellite",
    monitors: ["Earth concept", "compact readability", "plan identity"],
    detectsSignals: ["rejected mark", "gold dominance", "forbidden subtitle"],
    requiredEvidence: ["code-only mark", "light/dark proof", "no raster scan"],
    reportingTarget: "Visual Identity Planet",
    validationRule: "Identity must be SVG/CSS/code-only and avoid public internal terms.",
  },
  chart_satellite: {
    id: "chart_satellite",
    name: "Chart Satellite",
    monitors: ["chart visibility", "clutter", "overlays", "contrast"],
    detectsSignals: ["chart annoyance", "blocking overlays", "low contrast"],
    requiredEvidence: ["workstation screenshot", "dark screenshot", "clutter review"],
    reportingTarget: "Trading Workspace Planet",
    validationRule: "Charts remain chart-first, visible, and paper-safe.",
  },
  workstation_satellite: {
    id: "workstation_satellite",
    name: "Workstation Satellite",
    monitors: ["workspace layout", "paper mode", "panel density"],
    detectsSignals: ["layout shift", "occlusion", "live execution confusion"],
    requiredEvidence: ["desktop proof", "mobile proof", "paper-safe state check"],
    reportingTarget: "Trading Workspace Planet",
    validationRule: "Workspace must not imply live execution or real money.",
  },
  assistant_satellite: {
    id: "assistant_satellite",
    name: "Assistant Satellite",
    monitors: ["TPM Assistant", "why blocked", "plan-aware responses"],
    detectsSignals: ["signal language", "guarantees", "internal leakage"],
    requiredEvidence: ["assistant regression", "blocked-state sample"],
    reportingTarget: "Assistant Planet",
    validationRule: "Assistant explains state without advice, signals, or internal terms.",
  },
  product_truth_satellite: {
    id: "product_truth_satellite",
    name: "Product Truth Satellite",
    monitors: ["billing", "broker/feed", "live execution", "real money", "launch"],
    detectsSignals: ["fake activation", "false readiness", "paid-access claim"],
    requiredEvidence: ["truth snapshot", "blocked state checks"],
    reportingTarget: "Solar Command",
    validationRule: "Hard blocked scope remains blocked or inactive.",
  },
  public_boundary_satellite: {
    id: "public_boundary_satellite",
    name: "Public Boundary Satellite",
    monitors: ["public text", "navigation", "diagnostics", "plans"],
    detectsSignals: ["Alkon term", "Founder term", "governance term", "cosmic term"],
    requiredEvidence: ["public text scan", "navigation proof", "plan card scan"],
    reportingTarget: "Defense Universe",
    validationRule: "Normal users must not see private Alkon/Cosmic language.",
  },
  security_satellite: {
    id: "security_satellite",
    name: "Security Satellite",
    monitors: ["auth posture", "incident readiness", "dangerous request class"],
    detectsSignals: ["auth weakening", "forbidden activation", "public internal leak"],
    requiredEvidence: ["security regression", "no execution route check"],
    reportingTarget: "Defense Universe",
    validationRule: "Security-sensitive work requires review and cannot weaken auth.",
  },
  secrets_satellite: {
    id: "secrets_satellite",
    name: "Secrets Satellite",
    monitors: ["secret categories", "raw value risk", "production secret requests"],
    detectsSignals: ["secret value exposure", "token persistence", "Codex secret request"],
    requiredEvidence: ["secret pattern scan", "presence-only output"],
    reportingTarget: "Secrets Authority",
    validationRule: "Secrets remain presence-only; values never enter reports.",
  },
  validation_satellite: {
    id: "validation_satellite",
    name: "Validation Satellite",
    monitors: ["TypeScript", "ESLint", "build", "Prisma", "regression", "smoke"],
    detectsSignals: ["failed command", "missing proof", "unvalidated claim"],
    requiredEvidence: ["exact command results", "diff check", "git status"],
    reportingTarget: "Result Tribunal",
    validationRule: "Acceptance requires full validation or explicit blocker.",
  },
  screenshot_satellite: {
    id: "screenshot_satellite",
    name: "Screenshot Satellite",
    monitors: ["visual proof", "public/private proof", "workstation proof"],
    detectsSignals: ["blank canvas", "overlap", "missing proof"],
    requiredEvidence: ["PNG in test-results", "viewport proof"],
    reportingTarget: "Visual Acceptance",
    validationRule: "Screenshots are proof outputs only; no raster assets are added to product UI.",
  },
  memory_satellite: {
    id: "memory_satellite",
    name: "Memory Satellite",
    monitors: ["lessons", "accepted patterns", "rejected patterns", "validation summaries"],
    detectsSignals: ["repeated visual issue", "chart annoyance history", "boundary lesson"],
    requiredEvidence: ["safe summary", "no secrets", "no private sensitive data"],
    reportingTarget: "Memory Universe",
    validationRule: "Memory stores safe lessons, not raw secrets or private sensitive data.",
  },
  world_interface_satellite: {
    id: "world_interface_satellite",
    name: "World Interface Satellite",
    monitors: ["email", "social", "support", "partners", "media", "security channels"],
    detectsSignals: ["token request", "sending request", "publishing request"],
    requiredEvidence: ["readiness-only output", "no tokens", "no external calls"],
    reportingTarget: "World Interface Planet",
    validationRule: "External channels remain readiness-only with no sending or publishing.",
  },
  local_day_satellite: {
    id: "local_day_satellite",
    name: "Local Day Satellite",
    monitors: ["local day cycle", "daily loop", "Founder review", "end-of-day report"],
    detectsSignals: ["missing report", "validation pending", "open blocker"],
    requiredEvidence: ["daily summary", "next safe action", "Product Truth status"],
    reportingTarget: "Moon Cycle System",
    validationRule: "Local day reports remain private and do not imply launch.",
  },
};

export const ORBIT_SATELLITES: Record<OrbitPath, SatelliteMonitorId[]> = {
  public_ui_orbit: [
    "public_ui_satellite",
    "public_boundary_satellite",
    "product_truth_satellite",
  ],
  visual_identity_orbit: ["logo_satellite", "screenshot_satellite"],
  chart_workspace_orbit: [
    "chart_satellite",
    "workstation_satellite",
    "screenshot_satellite",
  ],
  assistant_orbit: ["assistant_satellite", "product_truth_satellite"],
  journal_coach_orbit: ["product_truth_satellite", "memory_satellite"],
  plans_realms_orbit: ["product_truth_satellite", "public_boundary_satellite"],
  apps_support_orbit: ["public_ui_satellite", "product_truth_satellite"],
  security_orbit: ["security_satellite", "public_boundary_satellite"],
  secrets_orbit: ["secrets_satellite", "security_satellite"],
  codex_construction_orbit: ["validation_satellite", "memory_satellite"],
  media_world_interface_orbit: [
    "world_interface_satellite",
    "security_satellite",
    "product_truth_satellite",
  ],
  memory_orbit: ["memory_satellite", "validation_satellite"],
  local_day_orbit: ["local_day_satellite", "memory_satellite"],
  launch_forbidden_orbit: ["product_truth_satellite", "security_satellite"],
};

export function getSatelliteMonitors(ids: SatelliteMonitorId[]): SatelliteMonitor[] {
  return ids.map((id) => SATELLITE_MONITORS[id]);
}

export function getSatellitesForOrbit(orbit: OrbitPath): SatelliteMonitor[] {
  return getSatelliteMonitors(ORBIT_SATELLITES[orbit]);
}
