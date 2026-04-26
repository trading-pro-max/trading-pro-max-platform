import type { FounderDeviceReadinessSnapshot } from "@/lib/server/devices";

export default function AlkonDeviceSecurityPanel({
  snapshot,
}: {
  snapshot: FounderDeviceReadinessSnapshot;
}) {
  const privateSecurity = snapshot.securityReadiness.filter((device) =>
    snapshot.privateDevices.some((privateDevice) => privateDevice.deviceId === device.deviceId)
  );

  return (
    <section className="tpm-founder-subpanel alkon-device-security-panel">
      <span>Device Security Posture</span>
      <h3>Private command devices require trust gates before actions</h3>
      <div className="alkon-command-facts">
        {privateSecurity.map((device) => (
          <div key={device.deviceId}>
            <dt>{device.publicName}</dt>
            <dd>{device.posture.join(" / ")}</dd>
          </div>
        ))}
      </div>
      <ul className="alkon-device-list">
        <li>Trusted device readiness required.</li>
        <li>Passkey/WebAuthn and biometric/PIN readiness are planned.</li>
        <li>Step-up confirmation, session timeout, and audit trail are required.</li>
        <li>Secrets visible: {String(snapshot.noSecrets ? false : true)}.</li>
      </ul>
    </section>
  );
}
