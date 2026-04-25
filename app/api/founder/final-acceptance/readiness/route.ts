import { getFounderFinalAcceptanceReadinessSnapshot } from "@/lib/server/economy-growth";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: getFounderFinalAcceptanceReadinessSnapshot(),
  });
}
