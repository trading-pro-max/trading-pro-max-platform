import {
  getFinalConvergenceLayers,
  getLayerGrowthEngineSnapshot,
} from "@/lib/server/final-convergence";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getLayerGrowthEngineSnapshot(getFinalConvergenceLayers());

  return noStoreJson({
    ok: true,
    snapshot,
    proposals: snapshot.proposals,
  });
}
