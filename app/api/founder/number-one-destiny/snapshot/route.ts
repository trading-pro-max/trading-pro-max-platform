import { getNumberOneDestinySnapshot } from "@/lib/server/number-one-destiny";
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
    publicNumberOneClaimForbidden: true,
    snapshot: getNumberOneDestinySnapshot(),
  });
}
