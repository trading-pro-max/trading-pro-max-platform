import { getLocalReadinessLawSnapshot } from "@/lib/server/local-ops";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: getLocalReadinessLawSnapshot(),
  });
}
