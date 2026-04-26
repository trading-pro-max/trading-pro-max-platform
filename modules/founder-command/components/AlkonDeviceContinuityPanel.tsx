import type { FounderDeviceReadinessSnapshot } from "@/lib/server/devices";

export default function AlkonDeviceContinuityPanel({
  snapshot,
}: {
  snapshot: FounderDeviceReadinessSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-device-continuity-panel">
      <span>Cross-Device Continuity</span>
      <h3>Continuity is readiness only until real persistence and auth exist</h3>
      <div className="alkon-command-facts">
        {snapshot.continuity.slice(0, 6).map((path) => (
          <div key={path.pathId}>
            <dt>{path.label}</dt>
            <dd>{path.readiness}</dd>
          </div>
        ))}
      </div>
      <ul className="alkon-device-list">
        {snapshot.nextSafeActions.slice(0, 4).map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
    </section>
  );
}
