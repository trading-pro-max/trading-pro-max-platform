import "server-only";

import type { AlkonCosmicPhysicsSnapshot } from "@/lib/server/alkon-physics";

export type AlkonUniverseVisibility = "private_founder_only";

export type AlkonSubsystemStatus =
  | "ready"
  | "partial"
  | "planned"
  | "blocked"
  | "internal_only"
  | "review_required";

export type AlkonRiskLevel = "low" | "medium" | "high" | "critical";

export type AlkonSubsystemId =
  | "earth_command"
  | "moon_cycle"
  | "orbit_command"
  | "solar_command"
  | "planetary_systems"
  | "defense_universe"
  | "construction_universe"
  | "memory_universe"
  | "world_interface"
  | "invisible_operating_layer";

export type AlkonMapDomain = {
  label: string;
  status: AlkonSubsystemStatus;
  detail: string;
};

export type AlkonSubsystem = {
  id: AlkonSubsystemId;
  name: string;
  symbolicRole: string;
  status: AlkonSubsystemStatus;
  readiness: string;
  linkedSystems: string[];
  publicVisible: boolean;
  founderVisible: boolean;
  riskLevel: AlkonRiskLevel;
  nextAction: string;
  domains: AlkonMapDomain[];
};

export type AlkonProductTruthStatus = {
  liveExecutionBlocked: true;
  realMoneyBlocked: true;
  brokerFeedActivationBlocked: true;
  billingActivationBlocked: true;
  publicLaunchInactive: true;
  socialPublishingInactive: true;
  productionSecretsUntouched: true;
  noFakeUsersRevenueMetrics: true;
  noShellExecutionFromWebApp: true;
  noDirectCodexExecutionFromWebApp: true;
  noPublicAlkonExposure: true;
  authSecurityPreserved: true;
  overall: "preserved";
};

export type AlkonApiExposure = {
  publicAlkonRoutesExposed: false;
  founderReadinessRoute: "/api/founder/alkon/readiness";
  founderPhysicsReadinessRoute: "/api/founder/alkon-physics/readiness";
  publicRouteDecision: string;
  routeMode: "read_only_status_only";
  secretsExposed: false;
  privateSensitiveDataExposed: false;
  executionEndpointsExposed: false;
};

export type AlkonUniverseSnapshot = {
  universeId: "alkon_private_command_universe";
  name: "Alkon";
  arabicName: "الكون";
  visibility: AlkonUniverseVisibility;
  publicExposure: false;
  earthPublicWorld: AlkonSubsystem;
  moonCycle: AlkonSubsystem;
  orbitCommand: AlkonSubsystem;
  solarCommand: AlkonSubsystem;
  planetarySystems: AlkonSubsystem;
  defenseUniverse: AlkonSubsystem;
  constructionUniverse: AlkonSubsystem;
  memoryUniverse: AlkonSubsystem;
  worldInterface: AlkonSubsystem;
  invisibleOperatingLayer: AlkonSubsystem;
  cosmicPhysics: AlkonCosmicPhysicsSnapshot;
  universeMap: AlkonSubsystem[];
  nextSafeActions: string[];
  blockedActions: string[];
  founderDecisionNeeded: string[];
  productTruthStatus: AlkonProductTruthStatus;
  apiExposure: AlkonApiExposure;
  createdAt: string;
};
