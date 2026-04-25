import {
  getFounderBuildRoomReadinessSnapshot,
  getFounderBuildRoomSnapshot,
} from "@/lib/server/founder-command";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();

  return noStoreJson({
    ok: true,
    snapshot: getFounderBuildRoomSnapshot(checkedAt),
    readiness: getFounderBuildRoomReadinessSnapshot(checkedAt),
  });
}
