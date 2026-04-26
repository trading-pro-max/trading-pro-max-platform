import { getAlkonRuntimeSnapshot } from "@/lib/server/alkon-runtime";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noDeletion: true,
    noPayments: true,
    noSecrets: true,
    snapshot: getAlkonRuntimeSnapshot(),
  });
}
