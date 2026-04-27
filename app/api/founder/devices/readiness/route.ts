import { getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getFounderDeviceReadinessSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noSecrets: true,
    noExternalCalls: true,
    officialConstellation: snapshot.officialConstellation,
  });
}
