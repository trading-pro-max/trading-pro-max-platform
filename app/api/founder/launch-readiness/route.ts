import { getRealWorldLaunchReadinessSnapshot } from "@/lib/server/launch-readiness";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getRealWorldLaunchReadinessSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: "founder_real_world_launch_readiness",
      status: snapshot.status,
      budget: snapshot.budget,
      infrastructure: snapshot.infrastructure,
      waitlist: snapshot.waitlist,
      legal: snapshot.legal,
      support: snapshot.support,
      billing: snapshot.billing,
      beta: snapshot.beta,
      gate: snapshot.gate,
      founderCommand: snapshot.founderCommand,
      truth: snapshot.truth,
    },
  });
}
