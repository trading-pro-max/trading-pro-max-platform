import type { FounderDeviceReadinessSnapshot } from "@/lib/server/devices";

export default function AlkonDeviceConstellationPanel({
  snapshot,
}: {
  snapshot: FounderDeviceReadinessSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-device-constellation"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon device constellation"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon Device Constellation</span>
        <h2>Public Earth apps and private command devices stay separated</h2>
        <p>
          Pro Max public devices serve users with Web current, Desktop
          planned, Mobile planned, and Tablet future truth. Alkon devices remain
          private command readiness only, with no public exposure, secrets, app
          publishing, or execution controls.
        </p>
      </div>

      <div className="tpm-founder-metrics alkon-device-metrics">
        <div className="tpm-founder-metric">
          <span>Public apps</span>
          <strong>{snapshot.publicDevices.length}</strong>
          <small>Web current; Desktop/Mobile planned; Tablet future</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Private devices</span>
          <strong>{snapshot.privateDevices.length}</strong>
          <small>Founder-only readiness</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>No Alkon device in public UI</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Execution controls</span>
          <strong>{String(!snapshot.noExecution)}</strong>
          <small>Read-only model</small>
        </div>
      </div>

      <div className="alkon-command-grid alkon-device-grid">
        {snapshot.privateDevices.map((device) => (
          <article key={device.deviceId} className="tpm-founder-subpanel">
            <span>{device.type}</span>
            <h3>{device.privateName}</h3>
            <p>{device.role}</p>
            <div className="alkon-command-facts">
              <div>
                <dt>Availability</dt>
                <dd>{device.availability}</dd>
              </div>
              <div>
                <dt>Permission</dt>
                <dd>{device.permissionLevel}</dd>
              </div>
              <div>
                <dt>Public visible</dt>
                <dd>{String(device.publicVisible)}</dd>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
