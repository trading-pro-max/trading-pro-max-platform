import { noStoreJson } from "@/lib/server/security";
import { getPlanetBlueprintSnapshot } from "@/lib/server/planet-os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: getPlanetBlueprintSnapshot(),
  });
}
