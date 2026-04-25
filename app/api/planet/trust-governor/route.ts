import { getTrustGovernorSnapshot } from "@/lib/server/trust-governor";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: getTrustGovernorSnapshot(),
  });
}
