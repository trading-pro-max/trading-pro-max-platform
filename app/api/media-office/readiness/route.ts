import { getMediaOfficeReadinessSnapshot } from "@/lib/server/media-office";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: getMediaOfficeReadinessSnapshot(),
  });
}
