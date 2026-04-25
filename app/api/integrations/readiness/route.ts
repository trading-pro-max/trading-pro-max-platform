import { noStoreJson } from "@/lib/server/security";
import {
  getEssentialIntegrationsHubSnapshot,
  getRealIntegrationsFoundationSnapshot,
} from "@/lib/server/integrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();
  const snapshot = getRealIntegrationsFoundationSnapshot();
  const essentialHub = getEssentialIntegrationsHubSnapshot(checkedAt);

  return noStoreJson({
    ok: true,
    snapshot: {
      ...snapshot,
      essentialHub,
    },
  });
}
