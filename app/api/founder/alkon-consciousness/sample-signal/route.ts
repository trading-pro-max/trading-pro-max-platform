import { getAlkonConsciousnessSampleSignal } from "@/lib/server/alkon-consciousness";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson(getAlkonConsciousnessSampleSignal());
}
