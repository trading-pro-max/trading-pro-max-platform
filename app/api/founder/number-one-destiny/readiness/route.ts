import { getNumberOneDestinyReadiness } from "@/lib/server/number-one-destiny";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return noStoreJson(getNumberOneDestinyReadiness());
}
