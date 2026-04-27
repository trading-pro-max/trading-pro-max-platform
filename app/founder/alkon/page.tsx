import { getAlkonKernelSnapshot } from "@/lib/server/alkon-kernel";
import { getAlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";
import { getAlkonPocketUniverseSnapshot, getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import { getRealityProductionSnapshot } from "@/lib/server/reality-production";
import { getSelfCorrectionSnapshot } from "@/lib/server/self-correction";
import PrivateFounderShell from "@/modules/shell/components/PrivateFounderShell";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function FounderAlkonPage() {
  const checkedAt = new Date().toISOString();
  const operatingMode = getAlkonOperatingModeSnapshot(checkedAt);
  const kernel = getAlkonKernelSnapshot(checkedAt);
  const pocket = getAlkonPocketUniverseSnapshot(checkedAt);
  const devices = getFounderDeviceReadinessSnapshot(checkedAt);
  const realityProduction = getRealityProductionSnapshot(checkedAt);
  const selfCorrection = getSelfCorrectionSnapshot(checkedAt);
  const realityTrialStatus = kernel.realityTrial.outcome;
  const evidenceStatus = kernel.evidenceChain.evidenceStatus;
  const blockedActions = [
    "Do not expose Alkon publicly.",
    "Do not add Founder routes to public navigation.",
    "Do not start billing, broker/feed, live execution, real money, production, or launch.",
    "Do not execute shell, Codex, payments, or unsafe automation from the web app.",
  ];

  const pillars = [
    {
      label: "Alkon Operating Mode",
      value: operatingMode.status,
      detail: operatingMode.activationDecision,
    },
    {
      label: "Kernel 0-16",
      value: kernel.status,
      detail: `${kernel.commandStatuses.length} private commands loaded`,
    },
    {
      label: "Zero Truth",
      value: kernel.zeroTruth.zeroTruthStatus,
      detail: kernel.zeroTruth.oneNextActionCandidate,
    },
    {
      label: "Reality Trial",
      value: realityTrialStatus,
      detail: kernel.realityTrial.nextAction,
    },
    {
      label: "Evidence Chain",
      value: evidenceStatus,
      detail: `${kernel.evidenceChain.presentEvidence.length} present, ${kernel.evidenceChain.missingEvidence.length} missing`,
    },
    {
      label: "Daily Loop",
      value: kernel.dailyOperatingLoop.dailyLoopStatus,
      detail: kernel.dailyOperatingLoop.oneNextAction.oneNextAction,
    },
    {
      label: "Reality Production",
      value: realityProduction.status,
      detail: realityProduction.nextFate,
    },
    {
      label: "Self-Correction",
      value: selfCorrection.status,
      detail: `${selfCorrection.signals.length} private signals watched`,
    },
  ];

  return (
    <PrivateFounderShell checkedAt={checkedAt}>
      <main
        className="tpm-founder-command-room alkon-private-route alkon-universe-entry"
        data-owner-only="true"
        data-public-route-exposed="false"
        data-read-only="true"
        data-no-public-nav="true"
        aria-label="Alkon private universe"
      >
        <header className="tpm-founder-hero alkon-private-hero">
          <div className="alkon-private-hero-mark" aria-hidden="true">
            A
          </div>
          <div>
            <span>Alkon / الكون</span>
            <h1>Private Operating Universe</h1>
            <p>
              Ahmad-only command entry for Kernel 0-16, Zero Truth, Reality
              Trial, Evidence Chain, Wake Report, One Next Action, Daily Loop,
              Device Constellation, and Local Day One Gate. Pro Max remains the
              public reality outside this route.
            </p>
            <div className="alkon-private-badge-row" aria-label="Private Alkon boundaries">
              <span>Founder-only</span>
              <span>Read-only</span>
              <span>No public nav</span>
              <span>No execution</span>
            </div>
          </div>
          <div className="tpm-founder-access-card">
            <span>Local Day One Gate</span>
            <strong>{kernel.localDayOneGate.localDayOneStatus}</strong>
            <small>{pocket.visualAcceptance}</small>
          </div>
        </header>

        <section className="tpm-founder-panel alkon-private-wide" data-alkon-entry="wake-report">
          <div className="tpm-founder-panel-head alkon-command-head">
            <span>Wake Report</span>
            <h2>{pocket.wakeReport.status}</h2>
            <p>{pocket.wakeReport.done}</p>
          </div>
          <div className="tpm-founder-metrics">
            <div className="tpm-founder-metric">
              <span>Mission</span>
              <strong>Private Alkon readiness</strong>
              <small>{pocket.wakeReport.mission}</small>
            </div>
            <div className="tpm-founder-metric">
              <span>One Next Action</span>
              <strong>Ahmad review</strong>
              <small>{kernel.oneNextAction.oneNextAction}</small>
            </div>
            <div className="tpm-founder-metric">
              <span>Memory</span>
              <strong>{kernel.memoryLaw.memoryStatus}</strong>
              <small>{kernel.memoryLaw.lessons.length} lessons preserve continuity</small>
            </div>
            <div className="tpm-founder-metric">
              <span>Devices</span>
              <strong>{devices.officialConstellation.iphone}</strong>
              <small>{devices.officialConstellation.samsung}</small>
            </div>
          </div>
        </section>

        <section className="alkon-private-map" data-alkon-entry="core-map">
          {pillars.map((pillar) => (
            <article key={pillar.label} className="tpm-founder-subpanel">
              <span>{pillar.label}</span>
              <h3>{pillar.value}</h3>
              <p>{pillar.detail}</p>
            </article>
          ))}
        </section>

        <section className="tpm-founder-panel alkon-private-wide" data-alkon-entry="kernel-commands">
          <div className="tpm-founder-panel-head alkon-command-head">
            <span>Kernel 0-16</span>
            <h2>Private command law is active with notes</h2>
            <p>
              The kernel remains the private brain of Alkon. It does not expose
              itself to public users and does not execute dangerous actions.
            </p>
          </div>
          <div className="alkon-command-tags">
            {kernel.commandStatuses.map((command) => (
              <span key={command.commandId}>{command.label}</span>
            ))}
          </div>
        </section>

        <section className="alkon-private-map" data-alkon-entry="gates">
          <article className="tpm-founder-subpanel">
            <span>Device Constellation</span>
            <h3>Windows builds; phones review</h3>
            <p>
              iPhone and Samsung remain review-only. Shell, Codex, payments,
              billing, broker/feed, live execution, real money, and secrets are blocked.
            </p>
          </article>
          <article className="tpm-founder-subpanel">
            <span>Local Day One Gate</span>
            <h3>{operatingMode.localDayOneGate.status}</h3>
            <p>Ahmad visual acceptance is still required before any Local Day One start.</p>
          </article>
          <article className="tpm-founder-subpanel">
            <span>What not to do</span>
            <h3>No unsafe activation</h3>
            <ul className="alkon-device-list">
              {blockedActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </article>
          <article className="tpm-founder-subpanel">
            <span>Pocket bridge</span>
            <h3>Alkon Pocket</h3>
            <p>
              Phone-width review stays private and exists only as Ahmad Pocket
              Decision for Wake Report, One Next Action, and Visual Review.
            </p>
            <Link className="alkon-private-entry-link" href="/founder/pocket">
              Open Alkon Pocket
            </Link>
          </article>
        </section>
      </main>
    </PrivateFounderShell>
  );
}
