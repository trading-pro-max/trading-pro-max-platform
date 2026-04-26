import type { FounderDeviceReadinessSnapshot } from "@/lib/server/devices";

export default function AlkonPocketUniversePanel({
  snapshot,
}: {
  snapshot: FounderDeviceReadinessSnapshot;
}) {
  const pocket = snapshot.privateDevices.find(
    (device) => device.deviceId === "alkon_pocket_universe_os"
  );

  if (!pocket) return null;

  return (
    <section className="tpm-founder-subpanel alkon-pocket-universe-panel">
      <span>Alkon Pocket Universe OS</span>
      <h3>Private mobile pulse remains planned and guarded</h3>
      <p>
        {pocket.privateName} is a Founder-only mobile readiness model for pulse,
        review, guard signals, memory, and low-risk decisions later. It cannot
        expose secrets, execute actions, publish apps, or bypass Product Truth.
      </p>
      <ul className="alkon-device-list">
        <li>Universe Pulse and Earth Watch are planned/internal.</li>
        <li>Orbit Queue and Build Signal remain review-only.</li>
        <li>Emergency Mode and Silent Night Mode are readiness concepts.</li>
        <li>No shell execution, direct Codex call, or public app-store claim.</li>
      </ul>
    </section>
  );
}
