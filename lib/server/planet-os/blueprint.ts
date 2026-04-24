import "server-only";

import { getProductTruthSnapshot } from "@/lib/server/product/truth";
import { getInterMinistryCoordinationSnapshot } from "./coordination";
import { getPlanetEarthHierarchySnapshot } from "./hierarchy";
import { getPlanetOsStatusSnapshot } from "./state";
import { getPlanetResourceSnapshot } from "./resources";
import type {
  PlanetAutomationLevel,
  PlanetReadinessState,
  PlanetRiskLevel,
} from "./types";

export type PlanetEngineKey =
  | "planet_blueprint"
  | "product_truth"
  | "founder_command_reporting"
  | "plan_entitlement"
  | "companion_context"
  | "guardian_legal_rules"
  | "visual_acceptance"
  | "state_error_blocked"
  | "content_factory"
  | "ai_build_planner";

export type PlanetEngineStatus = {
  key: PlanetEngineKey;
  label: string;
  readiness: PlanetReadinessState;
  riskLevel: PlanetRiskLevel;
  automationLevel: PlanetAutomationLevel;
  purpose: string;
  active: string[];
  planned: string[];
  blocked: string[];
  truth: string;
};

export type PlanetBlueprintSnapshot = {
  checkedAt: string;
  mode: "planet_blueprint_engine";
  planet: {
    name: "Trading Pro Max Planet OS";
    model: "planet_to_founder_command_room";
    reportDestination: "Founder Command Room";
  };
  structure: {
    continents: number;
    states: number;
    ministries: number;
    cityModules: number;
    citizenClasses: number;
    professions: number;
  };
  continents: ReturnType<typeof getPlanetOsStatusSnapshot>["continents"];
  states: ReturnType<typeof getPlanetOsStatusSnapshot>["states"];
  ministries: ReturnType<typeof getPlanetOsStatusSnapshot>["ministryCatalog"];
  cityModules: ReturnType<typeof getPlanetOsStatusSnapshot>["cityModules"];
  citizenClasses: ReturnType<typeof getPlanetOsStatusSnapshot>["citizenClasses"];
  professions: ReturnType<typeof getPlanetOsStatusSnapshot>["professions"];
  hierarchySummary: ReturnType<typeof getPlanetEarthHierarchySnapshot>["summary"];
  resourceSummary: ReturnType<typeof getPlanetResourceSnapshot>["summary"];
  coordinationSummary: ReturnType<typeof getInterMinistryCoordinationSnapshot>["summary"];
  engines: PlanetEngineStatus[];
  truth: ReturnType<typeof getProductTruthSnapshot>["summary"];
};

const engines: PlanetEngineStatus[] = [
  {
    key: "planet_blueprint",
    label: "Planet Blueprint Engine",
    readiness: "active",
    riskLevel: "low",
    automationLevel: "auto",
    purpose: "Defines the official TPM Planet OS structure.",
    active: ["deterministic structure", "continent/state/ministry/module map"],
    planned: ["future owner command graph"],
    blocked: ["fake users", "fake revenue"],
    truth: "Blueprint is active as structure only.",
  },
  {
    key: "product_truth",
    label: "Product Truth Engine",
    readiness: "active",
    riskLevel: "high",
    automationLevel: "auto",
    purpose: "Centralizes blocked, inactive, planned, and review-required truth.",
    active: ["truth snapshot", "blocked capability list"],
    planned: ["future claim scanner integrations"],
    blocked: ["false activation claims"],
    truth: "Live execution, real money, billing, public launch, and social publishing remain blocked/inactive.",
  },
  {
    key: "founder_command_reporting",
    label: "Founder Command Reporting Engine",
    readiness: "active",
    riskLevel: "medium",
    automationLevel: "review",
    purpose: "Aggregates ministry reports and Founder briefing state.",
    active: ["ministry reports", "daily briefing snapshot"],
    planned: ["private desktop/mobile command app"],
    blocked: ["public Founder command route"],
    truth: "Reporting exists; owner action UI is not exposed.",
  },
  {
    key: "plan_entitlement",
    label: "Plan Entitlement Engine",
    readiness: "foundation_ready",
    riskLevel: "high",
    automationLevel: "review",
    purpose: "Maps Demo, Pro, VIP, and Enterprise capabilities truthfully.",
    active: ["Demo paper entitlement", "locked Pro/VIP/Enterprise definitions"],
    planned: ["future paid entitlement integration"],
    blocked: ["fake paid access"],
    truth: "Billing is inactive and higher plans remain locked/planned.",
  },
  {
    key: "companion_context",
    label: "Companion Context Engine",
    readiness: "foundation_ready",
    riskLevel: "medium",
    automationLevel: "review",
    purpose: "Builds safe assistant context without secrets or private data leakage.",
    active: ["route/market/truth context", "assistant safety boundaries"],
    planned: ["authenticated preference enrichment"],
    blocked: ["secrets", "broker credentials", "raw tokens"],
    truth: "Assistant context is safe and non-executing.",
  },
  {
    key: "guardian_legal_rules",
    label: "Guardian + Legal Rules Engine",
    readiness: "foundation_ready",
    riskLevel: "high",
    automationLevel: "review",
    purpose: "Classifies risky actions, abuse, and unsafe claims.",
    active: ["claim rules", "Guardian categories"],
    planned: ["future moderation workflow"],
    blocked: ["guaranteed profit", "fake launch", "fake Sharia certification"],
    truth: "Rules guide review; they do not claim real enforcement automation.",
  },
  {
    key: "visual_acceptance",
    label: "Visual Acceptance Engine",
    readiness: "foundation_ready",
    riskLevel: "medium",
    automationLevel: "review",
    purpose: "Scores visible product areas with a strict acceptance rubric.",
    active: ["rubric", "next visual actions"],
    planned: ["human review evidence links"],
    blocked: ["fake visual success"],
    truth: "Rubric assists acceptance but does not replace human screenshots and review.",
  },
  {
    key: "state_error_blocked",
    label: "State / Error / Blocked Engine",
    readiness: "foundation_ready",
    riskLevel: "medium",
    automationLevel: "auto",
    purpose: "Explains blocked, fallback, degraded, auth, and error states clearly.",
    active: ["state explanation map", "safe next steps"],
    planned: ["localized copy packs"],
    blocked: ["fake unlocks", "raw JSON errors"],
    truth: "Every blocked state must remain honest and understandable.",
  },
  {
    key: "content_factory",
    label: "Content Factory Engine",
    readiness: "foundation_ready",
    riskLevel: "high",
    automationLevel: "founder_approval",
    purpose: "Plans content lifecycle without external publishing.",
    active: ["draft lifecycle", "risk classification"],
    planned: ["future approval queues"],
    blocked: ["social tokens", "external posting"],
    truth: "Content can be planned only; no publishing is connected.",
  },
  {
    key: "ai_build_planner",
    label: "AI Build Planner",
    readiness: "foundation_ready",
    riskLevel: "medium",
    automationLevel: "review",
    purpose: "Classifies product tasks, dependencies, risks, and validations.",
    active: ["safe task planner", "forbidden launch classifier"],
    planned: ["future Founder workflow integration"],
    blocked: ["autonomous code execution", "production actions"],
    truth: "Planner recommends only; it does not execute changes.",
  },
];

export function getPlanetBlueprintSnapshot(
  checkedAt = new Date().toISOString()
): PlanetBlueprintSnapshot {
  const planet = getPlanetOsStatusSnapshot(checkedAt);
  const truth = getProductTruthSnapshot(checkedAt);
  const hierarchy = getPlanetEarthHierarchySnapshot(checkedAt);
  const resources = getPlanetResourceSnapshot(checkedAt);
  const coordination = getInterMinistryCoordinationSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "planet_blueprint_engine",
    planet: {
      name: "Trading Pro Max Planet OS",
      model: "planet_to_founder_command_room",
      reportDestination: "Founder Command Room",
    },
    structure: {
      continents: planet.continents.length,
      states: planet.states.length,
      ministries: planet.ministryCatalog.length,
      cityModules: planet.cityModules.length,
      citizenClasses: planet.citizenClasses.length,
      professions: planet.professions.length,
    },
    continents: planet.continents,
    states: planet.states,
    ministries: planet.ministryCatalog,
    cityModules: planet.cityModules,
    citizenClasses: planet.citizenClasses,
    professions: planet.professions,
    hierarchySummary: hierarchy.summary,
    resourceSummary: resources.summary,
    coordinationSummary: coordination.summary,
    engines,
    truth: truth.summary,
  };
}
