import { noStoreJson } from "@/lib/server/security";
import { getDesktopProductizationSnapshot } from "@/lib/server/platform/desktop-productization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getDesktopProductizationSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
