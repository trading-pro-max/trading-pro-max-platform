import "server-only";

import type { AlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";
import type { AlkonContinuitySnapshot } from "@/lib/server/alkon-continuity";
import type { AlkonCosmicPhysicsSnapshot } from "@/lib/server/alkon-physics";
import type { AlkonLegitimacySnapshot } from "@/lib/server/alkon-legitimacy";
import type { AlkonOntologySnapshot } from "@/lib/server/alkon-ontology";
import type { AlkonRuntimeSnapshot } from "@/lib/server/alkon-runtime";
import type { InfiniteGrowthSnapshot } from "@/lib/server/infinite-growth";

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
  | "digital_universe_runtime"
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
  founderConsciousnessReadinessRoute: "/api/founder/alkon-consciousness/readiness";
  founderOntologyReadinessRoute: "/api/founder/alkon-ontology/readiness";
  founderLegitimacyReadinessRoute: "/api/founder/alkon-legitimacy/readiness";
  founderContinuityReadinessRoute: "/api/founder/alkon-continuity/readiness";
  founderRuntimeReadinessRoute: "/api/founder/alkon-runtime/readiness";
  founderRuntimeSnapshotRoute: "/api/founder/alkon-runtime/snapshot";
  founderInfiniteGrowthReadinessRoute: "/api/founder/infinite-growth/readiness";
  founderInfiniteGrowthSnapshotRoute: "/api/founder/infinite-growth/snapshot";
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
  digitalUniverseRuntime: AlkonSubsystem;
  memoryUniverse: AlkonSubsystem;
  worldInterface: AlkonSubsystem;
  invisibleOperatingLayer: AlkonSubsystem;
  cosmicPhysics: AlkonCosmicPhysicsSnapshot;
  sovereignOperatingConsciousness: AlkonConsciousnessSnapshot;
  ontology: AlkonOntologySnapshot;
  sovereignLegitimacy: AlkonLegitimacySnapshot;
  sovereignContinuity: AlkonContinuitySnapshot;
  digitalUniverseRuntimeSnapshot: AlkonRuntimeSnapshot;
  infiniteGrowthConstitution: InfiniteGrowthSnapshot;
  universeMap: AlkonSubsystem[];
  nextSafeActions: string[];
  blockedActions: string[];
  founderDecisionNeeded: string[];
  productTruthStatus: AlkonProductTruthStatus;
  apiExposure: AlkonApiExposure;
  createdAt: string;
};
