import { getPublicDeviceReadinessSnapshot } from "@/lib/server/devices";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getPublicDeviceReadinessSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      checkedAt: snapshot.checkedAt,
      mode: snapshot.mode,
      status: snapshot.status,
      devices: snapshot.devices,
      appsPlatformsTruth: snapshot.appsPlatformsTruth,
      productTruth: snapshot.productTruth,
      nextSafeActions: snapshot.nextSafeActions,
    },
  });
}
