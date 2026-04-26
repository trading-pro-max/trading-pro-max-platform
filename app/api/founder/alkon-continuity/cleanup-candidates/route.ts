import { getAlkonContinuityCleanupCandidates } from "@/lib/server/alkon-continuity";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson(getAlkonContinuityCleanupCandidates());
}
