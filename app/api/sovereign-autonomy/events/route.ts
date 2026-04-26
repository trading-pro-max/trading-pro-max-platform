import {
  getSovereignAutonomyReadinessSnapshot,
  sovereignEventStatuses,
  sovereignEventTypes,
} from "@/lib/server/sovereign-autonomy";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getSovereignAutonomyReadinessSnapshot();

  return noStoreJson({
    ok: true,
    mode: "sovereign_event_state_engine",
    eventTypes: sovereignEventTypes,
    statuses: sovereignEventStatuses,
    events: snapshot.sampleEvents,
    ownerRoutes: snapshot.ownerRoutes,
    policyEvaluations: snapshot.policyEvaluations,
    truth: snapshot.truth,
  });
}
