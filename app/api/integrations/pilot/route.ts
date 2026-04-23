import { noStoreJson } from "@/lib/server/security";
import { getRealActivationPilotSnapshot } from "@/lib/server/integrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getRealActivationPilotSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
