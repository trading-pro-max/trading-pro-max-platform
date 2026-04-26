import { getEarthRealitySnapshot } from "@/lib/server/earth-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getEarthRealitySnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: snapshot.mode,
      status: snapshot.status,
      score: snapshot.score,
      layers: snapshot.layers,
      publicReadiness: snapshot.publicReadiness,
      privacyReadiness: snapshot.privacyReadiness,
      productTruthReadiness: snapshot.productTruthReadiness,
      supportReadiness: snapshot.supportReadiness,
      learningReadiness: snapshot.learningReadiness,
      marketReadiness: snapshot.marketReadiness,
      environmentReadiness: snapshot.environmentReadiness,
      launchGateReadiness: snapshot.launchGateReadiness,
      publicPrivateBoundaryStatus: snapshot.publicPrivateBoundaryStatus,
      nextSafeActions: snapshot.nextSafeActions,
      productTruthStatus: snapshot.productTruthStatus,
      publicDiagnosticsSummary: snapshot.publicDiagnosticsSummary,
    },
  });
}
