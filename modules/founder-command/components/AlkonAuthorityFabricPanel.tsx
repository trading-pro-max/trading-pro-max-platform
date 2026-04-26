import type { AlkonLegitimacySnapshot } from "@/lib/server/alkon-legitimacy";

export default function AlkonAuthorityFabricPanel({
  snapshot,
}: {
  snapshot: AlkonLegitimacySnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-authority-fabric-panel">
      <span>Authority Fabric</span>
      <h3>Identity, presence, device, intent, and audit readiness</h3>
      <p>
        Authority verification is modeled as readiness only: trusted device,
        step-up, passkey, presence/liveness, audit ledger, and emergency lockdown
        are not biometric storage or execution controls in this pass.
      </p>
      <div className="alkon-command-tags">
        <span>Trusted device: {snapshot.securityAuthorityReadiness.trustedDevice}</span>
        <span>Step-up: {snapshot.securityAuthorityReadiness.stepUpConfirmation}</span>
        <span>Passkey: {snapshot.securityAuthorityReadiness.passkey}</span>
        <span>Presence: {snapshot.securityAuthorityReadiness.presenceLiveness}</span>
        <span>Audit: {snapshot.securityAuthorityReadiness.auditLedger}</span>
        <span>Lockdown: {snapshot.securityAuthorityReadiness.emergencyLockdown}</span>
      </div>
    </section>
  );
}
