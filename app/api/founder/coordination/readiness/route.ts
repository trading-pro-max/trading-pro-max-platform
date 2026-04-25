import { getFounderCommandReportingSnapshot } from "@/lib/server/founder-command";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getFounderCommandReportingSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: "founder_coordination_readiness",
      privateOwnerOnly: snapshot.privateOwnerOnly,
      publicRouteExposed: snapshot.publicRouteExposed,
      coordination: snapshot.coordination,
      founderVisible: true,
      readOnly: true,
      noExecution: true,
      truth: snapshot.truth,
    },
  });
}
