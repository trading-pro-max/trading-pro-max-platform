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
      mode: snapshot.mode,
      privateOwnerOnly: snapshot.privateOwnerOnly,
      publicRouteExposed: snapshot.publicRouteExposed,
      briefing: snapshot.briefing,
      truth: snapshot.truth,
    },
  });
}
