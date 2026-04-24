import { getContentFactoryReadinessSnapshot } from "@/lib/server/content-factory";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: getContentFactoryReadinessSnapshot(),
  });
}
