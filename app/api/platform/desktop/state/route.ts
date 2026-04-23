import { noStoreJson } from "@/lib/server/security";
import { getDesktopAppsFoundationSnapshot } from "@/lib/server/platform/desktop-foundation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getDesktopAppsFoundationSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
