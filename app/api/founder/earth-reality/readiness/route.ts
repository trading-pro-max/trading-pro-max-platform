import {
  getEarthRealityReadinessSnapshot,
  getEarthRealitySnapshot,
} from "@/lib/server/earth-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = getEarthRealityReadinessSnapshot();
  const snapshot = getEarthRealitySnapshot(readiness.checkedAt);

  return noStoreJson({
    ok: true,
    readiness,
    snapshot,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
  });
}
