import { noStoreJson } from "@/lib/server/security";
import { getPlanetOsStatusSnapshot } from "@/lib/server/planet-os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getPlanetOsStatusSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
