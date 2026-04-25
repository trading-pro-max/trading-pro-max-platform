import {
  getPlanetEventReadinessSamples,
  planetConstructionEventStatuses,
  planetConstructionEventTypes,
} from "@/lib/server/planet-events";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: new Date().toISOString(),
      mode: "planet_event_system_readiness",
      eventTypes: planetConstructionEventTypes,
      statuses: planetConstructionEventStatuses,
      sampleEvents: getPlanetEventReadinessSamples(),
      truth: {
        externalExecution: "not_enabled",
        productionActions: "blocked",
        fakeMetrics: "not_allowed",
        secrets: "not_allowed",
      },
    },
  });
}
