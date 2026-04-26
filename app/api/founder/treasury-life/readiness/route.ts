import { getTreasuryLifeReadiness } from "@/lib/server/treasury-life";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson(getTreasuryLifeReadiness());
}
