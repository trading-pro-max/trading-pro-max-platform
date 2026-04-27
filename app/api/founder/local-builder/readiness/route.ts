import { getLocalBuilderReadinessSnapshot } from "@/lib/server/local-builder";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noExternalCalls: true,
    noSecrets: true,
    snapshot: getLocalBuilderReadinessSnapshot(),
  });
}

