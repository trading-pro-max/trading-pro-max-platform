import { getPublicRevelationExperienceSnapshot } from "@/lib/server/revelation-experience";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getPublicRevelationExperienceSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
    readOnly: true,
    noExecution: true,
    noSecrets: true,
    noExternalCalls: true,
  });
}
