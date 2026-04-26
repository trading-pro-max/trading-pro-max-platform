import { getAlkonGenesisSnapshot } from "@/lib/server/alkon-genesis";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noProjectCreation: true,
    noSecrets: true,
    snapshot: getAlkonGenesisSnapshot(),
  });
}
