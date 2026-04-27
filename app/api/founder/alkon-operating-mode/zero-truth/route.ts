import { getZeroTruthAudit } from "@/lib/server/alkon-operating-mode";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noShellExecution: true,
    noExternalCalls: true,
    noSecrets: true,
    noPublicApi: true,
    audit: getZeroTruthAudit(),
  });
}
