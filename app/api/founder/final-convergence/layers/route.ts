import { getFinalConvergenceLayers } from "@/lib/server/final-convergence";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const layers = getFinalConvergenceLayers();

  return noStoreJson({
    ok: true,
    layers,
    count: layers.length,
    publicLayers: layers.filter((layer) => layer.publicVisible).length,
    privateLayers: layers.filter((layer) => !layer.publicVisible).length,
  });
}
