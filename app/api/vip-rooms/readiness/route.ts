import { noStoreJson } from "@/lib/server/security";
import { getVipRoomsReadinessSnapshot } from "@/lib/server/vip-rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson({
    ok: true,
    snapshot: getVipRoomsReadinessSnapshot(),
  });
}
