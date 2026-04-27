import { getAlkonPocketUniverseSnapshot } from "@/lib/server/devices";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getAlkonPocketUniverseSnapshot();

  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    wakeReport: snapshot.wakeReport,
  });
}

