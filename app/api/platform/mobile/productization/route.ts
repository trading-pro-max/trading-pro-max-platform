import { noStoreJson } from "@/lib/server/security";
import { getMobileProductizationSnapshot } from "@/lib/server/platform/mobile-productization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getMobileProductizationSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
