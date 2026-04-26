import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";
import { getEarthRealitySnapshot } from "./engine";

export function getEarthRealityReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getEarthRealitySnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    mode: "earth_reality_readiness",
    status: snapshot.status,
    score: snapshot.score,
    layerCount: snapshot.layers.length,
    surfaceCount: snapshot.surfaces.length,
    publicPrivateBoundaryStatus: snapshot.publicPrivateBoundaryStatus,
    productTruthStatus: snapshot.productTruthStatus,
    nextSafeActions: snapshot.nextSafeActions,
  };
}

export function getEarthRealityDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getEarthRealitySnapshot(checkedAt);

  return {
    key: "earth_reality_constitution",
    label: "Earth Reality readiness",
    status: snapshot.blockedViolations.length > 0 ? "blocked" : "ready",
    summary: "Public Earth product reality guarded",
    detail:
      "Earth Reality checks human orientation, time/privacy, market truth, law/trust, learning/support, environment, and Product Truth. Public/private boundaries remain preserved.",
    checkedAt,
  };
}
