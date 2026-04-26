import { getAlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: getAlkonConsciousnessSnapshot(),
    readOnly: true,
    noExecution: true,
    noSecrets: true,
    noExternalCalls: true,
  });
}
