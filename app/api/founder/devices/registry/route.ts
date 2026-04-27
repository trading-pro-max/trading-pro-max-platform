import { getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getFounderDeviceReadinessSnapshot();

  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noSecrets: true,
    noExternalCalls: true,
    registry: snapshot.privateDevices,
    officialConstellation: snapshot.officialConstellation,
    blockedActions: snapshot.blockedActions,
  });
}

