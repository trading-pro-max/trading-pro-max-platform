import { noStoreJson } from "@/lib/server/security";
import {
  getPlanetBlueprintSnapshot,
  getMinistryAutonomySnapshot,
  getPlanetOsStatusSnapshot,
} from "@/lib/server/planet-os";
import { getTpmBrainContextSnapshot } from "@/lib/server/brain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getPlanetOsStatusSnapshot();
  const blueprint = getPlanetBlueprintSnapshot(snapshot.checkedAt);
  const autonomy = getMinistryAutonomySnapshot(snapshot.checkedAt);
  const brain = getTpmBrainContextSnapshot({}, snapshot.checkedAt);

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
