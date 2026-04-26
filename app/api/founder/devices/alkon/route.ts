import { getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getFounderDeviceReadinessSnapshot();

  return noStoreJson({
    ok: true,
    checkedAt: snapshot.checkedAt,
    mode: snapshot.mode,
    privateDevices: snapshot.privateDevices,
    securityReadiness: snapshot.securityReadiness.filter((device) =>
      snapshot.privateDevices.some((privateDevice) => privateDevice.deviceId === device.deviceId)
    ),
    continuity: snapshot.continuity.filter((path) =>
      path.fromDeviceId.startsWith("alkon_") || path.toDeviceId.startsWith("alkon_")
    ),
    publicExposure: snapshot.publicExposure,
    readOnly: true,
    noExecution: snapshot.noExecution,
    noSecrets: snapshot.noSecrets,
  });
}
