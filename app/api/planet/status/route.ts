import { noStoreJson } from "@/lib/server/security";
import { getPlanetEconomyGrowthReadinessSnapshot } from "@/lib/server/economy-growth";
import {
  getInterMinistryCoordinationSnapshot,
  getPlanetBlueprintSnapshot,
  getPlanetEarthHierarchySnapshot,
  getMinistryAutonomySnapshot,
  getPlanetOsStatusSnapshot,
  getPlanetResourceSnapshot,
} from "@/lib/server/planet-os";
import { getTpmBrainContextSnapshot } from "@/lib/server/brain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getPlanetOsStatusSnapshot();
  const blueprint = getPlanetBlueprintSnapshot(snapshot.checkedAt);
  const autonomy = getMinistryAutonomySnapshot(snapshot.checkedAt);
  const brain = getTpmBrainContextSnapshot({}, snapshot.checkedAt);
  const hierarchy = getPlanetEarthHierarchySnapshot(snapshot.checkedAt);
  const resources = getPlanetResourceSnapshot(snapshot.checkedAt);
  const coordination = getInterMinistryCoordinationSnapshot(snapshot.checkedAt);
  const economyGrowth = getPlanetEconomyGrowthReadinessSnapshot(snapshot.checkedAt);

  return noStoreJson({
    ok: true,
    snapshot,
    engineSummary: {
      total: blueprint.engines.length,
      active: blueprint.engines.filter((engine) => engine.readiness === "active")
        .length,
      foundationReady: blueprint.engines.filter(
        (engine) => engine.readiness === "foundation_ready"
      ).length,
      blockedCapabilities: [
        "live execution",
        "real money",
        "billing",
        "broker/feed activation",
        "public launch",
        "social publishing",
      ],
      engines: blueprint.engines.map((engine) => ({
        key: engine.key,
        label: engine.label,
        readiness: engine.readiness,
        riskLevel: engine.riskLevel,
        automationLevel: engine.automationLevel,
        purpose: engine.purpose,
        truth: engine.truth,
      })),
    },
    hierarchySummary: {
      ...hierarchy.summary,
      chain: hierarchy.hierarchyChain,
      coordinationCenter: coordination.coordinationCenter,
      resourceCategories: resources.categories,
      truth: {
        fakeUsers: false,
        fakeRevenue: false,
        fakeMetrics: false,
        productionActivation: false,
      },
    },
    coordinationSummary: coordination.summary,
    resourceSummary: resources.summary,
    economyGrowthSummary: {
      treasuryState: economyGrowth.economy.treasuryState,
      billing: economyGrowth.economy.monetizationReadiness.billing,
      paidEntitlements: economyGrowth.economy.monetizationReadiness.paidEntitlements,
      performanceBasedRevenue:
        economyGrowth.economy.monetizationReadiness.performanceBasedRevenue,
      community: economyGrowth.community.status,
      mediaOffice: economyGrowth.mediaOffice.status,
      aiVideoStudio: economyGrowth.aiVideoStudio.status,
      partnerships: economyGrowth.partnerships.status,
      finalAcceptance: economyGrowth.finalAcceptance.status,
      launchReady: economyGrowth.finalAcceptance.launchReady,
      truth: economyGrowth.truth,
    },
    intelligenceSummary: {
      brainContextQuality: brain.contextQuality,
      decisionSupportMode: brain.decisionSupportMode,
      blockedCapabilities: brain.blockedCapabilities,
      ministryAutonomyRules: autonomy.rules.length,
      dangerousAutonomy: autonomy.truth.dangerousAutonomy,
      liveTradingAutonomy: autonomy.truth.liveTradingAutonomy,
    },
  });
}
