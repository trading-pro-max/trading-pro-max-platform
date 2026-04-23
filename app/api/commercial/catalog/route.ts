import { noStoreJson } from "@/lib/server/security";
import { getCommercialPlanCatalogSnapshot } from "@/lib/server/commercial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getCommercialPlanCatalogSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
