import { getSourceLawSnapshot } from "@/lib/server/source-law";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noSecrets: true,
    noExternalCalls: true,
    noPublicApi: true,
    snapshot: getSourceLawSnapshot(),
  });
}
