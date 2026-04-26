import { getPersonalRealityReadinessSnapshot } from "@/lib/server/personal-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getPersonalRealityReadinessSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
