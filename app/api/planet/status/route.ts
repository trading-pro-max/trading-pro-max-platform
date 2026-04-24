import { noStoreJson } from "@/lib/server/security";
import {
  getPlanetBlueprintSnapshot,
  getPlanetOsStatusSnapshot,
} from "@/lib/server/planet-os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getPlanetOsStatusSnapshot();
  const blueprint = getPlanetBlueprintSnapshot(snapshot.checkedAt);

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
  });
}
