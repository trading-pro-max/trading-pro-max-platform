import {
  getRealWorldLaunchReadinessSnapshot,
} from "@/lib/server/launch-readiness";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getRealWorldLaunchReadinessSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: snapshot.gate,
  });
}
