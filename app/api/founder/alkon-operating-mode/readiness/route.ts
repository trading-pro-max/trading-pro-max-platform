import { getAlkonOperatingModeReadiness } from "@/lib/server/alkon-operating-mode";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson(getAlkonOperatingModeReadiness());
}
