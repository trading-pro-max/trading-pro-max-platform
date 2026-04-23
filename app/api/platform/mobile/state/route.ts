import { noStoreJson } from "@/lib/server/security";
import { getMobileAppsFoundationSnapshot } from "@/lib/server/platform/mobile-foundation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getMobileAppsFoundationSnapshot();

  return noStoreJson({
    ok: true,
    snapshot,
  });
}
