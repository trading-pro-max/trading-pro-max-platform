import { noStoreJson } from "@/lib/server/security";
import { getMarketFeedArchitectureSnapshot } from "@/lib/server/market-data/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getMarketFeedArchitectureSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
