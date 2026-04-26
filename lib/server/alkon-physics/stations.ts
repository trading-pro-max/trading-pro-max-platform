import "server-only";

import type { OperatingStation, OperatingStationId } from "./types";

export const OPERATING_STATIONS: Record<OperatingStationId, OperatingStation> = {
  design_station: {
    id: "design_station",
    name: "Design Station",
    purpose: "Shape code-only identity and visual acceptance work.",
    allowedOrbits: ["visual_identity_orbit"],
    requiredInputs: ["visual issue", "public boundary rule", "no raster rule"],
    outputs: ["identity patch", "visual proof", "memory lesson"],
    forbiddenActions: ["generated images", "raster assets", "public Alkon terms"],
  },
  chart_station: {
    id: "chart_station",
    name: "Chart Station",
    purpose: "Protect chart comfort and workstation-first layout.",
    allowedOrbits: ["chart_workspace_orbit"],
    requiredInputs: ["chart signal", "workstation proof", "paper-safe truth"],
    outputs: ["chart fix", "workstation proof", "comfort lesson"],
    forbiddenActions: ["live execution", "real-money routing", "broker/feed activation"],
  },
  public_ux_station: {
    id: "public_ux_station",
    name: "Public UX Station",
    purpose: "Keep public surfaces clear and public-safe.",
    allowedOrbits: ["public_ui_orbit", "apps_support_orbit", "plans_realms_orbit"],
    requiredInputs: ["user-facing gap", "allowed public language", "Product Truth"],
    outputs: ["public copy patch", "navigation adjustment", "leak proof"],
    forbiddenActions: ["private terms", "Founder Command exposure", "fake activation"],
  },
  assistant_station: {
    id: "assistant_station",
    name: "Assistant Station",
    purpose: "Adjust Assistant, Journal, and Coach behavior safely.",
    allowedOrbits: ["assistant_orbit", "journal_coach_orbit"],
    requiredInputs: ["plan state", "safety boundary", "blocked-state copy"],
    outputs: ["assistant behavior contract", "coach prompt", "regression proof"],
    forbiddenActions: ["financial advice", "signals", "profit promise"],
  },
  plan_realm_station: {
    id: "plan_realm_station",
    name: "Plan Realm Station",
    purpose: "Align realm behavior, entitlements, and plan truth.",
    allowedOrbits: ["plans_realms_orbit"],
    requiredInputs: ["plan entitlement truth", "billing inactive", "public copy rule"],
    outputs: ["realm contract", "locked/planned states", "plan proof"],
    forbiddenActions: ["fake paid access", "Alkon as plan", "billing activation"],
  },
  support_station: {
    id: "support_station",
    name: "Support Station",
    purpose: "Improve Apps / Platforms, Academy, Community, and Support readiness.",
    allowedOrbits: ["apps_support_orbit"],
    requiredInputs: ["public gap", "readiness truth", "external channel boundary"],
    outputs: ["support readiness copy", "apps/platforms truth", "surface proof"],
    forbiddenActions: ["sending email", "external accounts", "fake support metrics"],
  },
  world_interface_station: {
    id: "world_interface_station",
    name: "World Interface Station",
    purpose: "Classify external channels as readiness-only.",
    allowedOrbits: ["media_world_interface_orbit"],
    requiredInputs: ["channel request", "no tokens rule", "quarantine rule"],
    outputs: ["readiness status", "quarantine state", "blocked action list"],
    forbiddenActions: ["sending", "publishing", "token storage", "external calls"],
  },
  security_station: {
    id: "security_station",
    name: "Security Station",
    purpose: "Review public boundary, auth/security, and forbidden activation risk.",
    allowedOrbits: ["security_orbit", "launch_forbidden_orbit"],
    requiredInputs: ["risk signal", "boundary rule", "Product Truth"],
    outputs: ["security decision", "blocked reason", "safe alternative"],
    forbiddenActions: ["auth weakening", "external offensive action", "secret exposure"],
  },
  secrets_station: {
    id: "secrets_station",
    name: "Secrets Station",
    purpose: "Keep secrets presence-only and block raw values.",
    allowedOrbits: ["secrets_orbit"],
    requiredInputs: ["secret risk", "presence-only rule", "evidence-safe report"],
    outputs: ["blocked reason", "safe alternative", "incident note"],
    forbiddenActions: ["raw secret output", "production secrets", "secrets to Codex"],
  },
  codex_station: {
    id: "codex_station",
    name: "Codex Station",
    purpose: "Prepare governed Task Passports and Codex Licenses.",
    allowedOrbits: ["codex_construction_orbit"],
    requiredInputs: ["source", "scope", "validation", "forbidden actions"],
    outputs: ["Task Passport", "Codex License", "manual draft"],
    forbiddenActions: ["direct Codex call", "web-app shell execution", "unscoped task"],
  },
  tribunal_station: {
    id: "tribunal_station",
    name: "Tribunal Station",
    purpose: "Review results before acceptance and memory.",
    allowedOrbits: ["codex_construction_orbit", "memory_orbit"],
    requiredInputs: ["validation evidence", "Product Truth check", "diff check"],
    outputs: ["tribunal decision", "fix request", "acceptance note"],
    forbiddenActions: ["accept without validation", "ignore failed checks"],
  },
  memory_station: {
    id: "memory_station",
    name: "Memory Station",
    purpose: "Record safe lessons and repeatable patterns.",
    allowedOrbits: ["memory_orbit", "local_day_orbit", "journal_coach_orbit"],
    requiredInputs: ["tribunal result", "safe summary", "no-secret check"],
    outputs: ["memory lesson", "rejected pattern", "next safe action"],
    forbiddenActions: ["raw secrets", "private sensitive data", "fake metrics"],
  },
  diagnostics_station: {
    id: "diagnostics_station",
    name: "Diagnostics Station",
    purpose: "Keep readiness and diagnostics public-safe.",
    allowedOrbits: ["public_ui_orbit", "chart_workspace_orbit"],
    requiredInputs: ["diagnostic claim", "public-safe wording", "boundary check"],
    outputs: ["diagnostic proof", "route smoke", "leak scan"],
    forbiddenActions: ["private internal diagnostics public", "secret output"],
  },
  founder_review_station: {
    id: "founder_review_station",
    name: "Founder Review Station",
    purpose: "Summarize decisions and next safe actions for Ahmad.",
    allowedOrbits: [
      "visual_identity_orbit",
      "local_day_orbit",
      "launch_forbidden_orbit",
      "media_world_interface_orbit",
      "security_orbit",
    ],
    requiredInputs: ["event summary", "risk", "blocked actions", "next safe action"],
    outputs: ["Founder Command report", "decision needed", "memory instruction"],
    forbiddenActions: ["approval execution", "launch activation", "external action"],
  },
};

export function getOperatingStation(
  stationId: OperatingStationId
): OperatingStation {
  return OPERATING_STATIONS[stationId];
}

export function getOperatingStations(): OperatingStation[] {
  return Object.values(OPERATING_STATIONS);
}
