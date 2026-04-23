import { noStoreJson } from "@/lib/server/security";
import { getRealIntegrationsFoundationSnapshot } from "@/lib/server/integrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getRealIntegrationsFoundationSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
