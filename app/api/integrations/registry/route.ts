import { getEssentialIntegrationsHubSnapshot } from "@/lib/server/integrations";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getEssentialIntegrationsHubSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: snapshot.mode,
      status: snapshot.status,
      registry: snapshot.registry,
      prioritySummary: snapshot.prioritySummary,
      truth: snapshot.truth,
    },
  });
}
