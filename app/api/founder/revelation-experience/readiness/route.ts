import { getRevelationExperienceSnapshot } from "@/lib/server/revelation-experience";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getRevelationExperienceSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noSecrets: true,
    noExternalCalls: true,
    productTruth: snapshot.productTruth,
  });
}
