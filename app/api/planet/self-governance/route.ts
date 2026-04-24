import { getInternalRoadmapPlannerSnapshot } from "@/lib/server/build-planner";
import { getGuardianLegalEnforcementMatrixSnapshot } from "@/lib/server/guardian-legal";
import { getLivingSignalMapSnapshot } from "@/lib/server/living-signals";
import { getMinistryAutonomySnapshot } from "@/lib/server/planet-os";
import { noStoreJson } from "@/lib/server/security";
import { getPlanValueMapSnapshot } from "@/lib/plans/value-map";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt,
      mode: "planet_self_governance_readiness",
      guardianLegal: getGuardianLegalEnforcementMatrixSnapshot(checkedAt),
      ministryAutonomy: getMinistryAutonomySnapshot(checkedAt),
      planValueMap: getPlanValueMapSnapshot(checkedAt),
      livingSignals: getLivingSignalMapSnapshot(checkedAt),
      roadmap: getInternalRoadmapPlannerSnapshot(checkedAt),
      truth: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        brokerFeedActivation: "blocked",
        billing: "inactive",
        publicLaunch: "inactive",
        socialPublishing: "inactive",
        secrets: "not_exposed",
      },
    },
  });
}
