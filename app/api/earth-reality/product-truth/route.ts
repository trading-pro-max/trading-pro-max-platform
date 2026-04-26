import { getEarthRealitySnapshot } from "@/lib/server/earth-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getEarthRealitySnapshot();

  return noStoreJson({
    ok: true,
    productTruth: snapshot.productTruthStatus,
    publicCopy:
      "Trading Pro Max is paper-safe. Live execution, real money, broker/feed, billing, production launch, and social publishing are inactive or blocked.",
  });
}
