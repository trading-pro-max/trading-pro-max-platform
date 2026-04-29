import { ProMaxDeviceTimeRealityBar } from "@/app/_components/ProMaxDeviceTimeRealityBar";
import { ProMaxCosmicIdentity } from "@/app/_components/ProMaxCosmicIdentity";
import { ProMaxLivingEarthLayers } from "@/app/_components/ProMaxLivingEarthLayers";
import { ProMaxLivingUniverseBackground } from "@/app/_components/ProMaxLivingUniverseBackground";
import { ProMaxRealityContinuityLayer } from "@/app/_components/ProMaxRealityContinuityLayer";
import { ProMaxRealitySourceBar } from "@/app/_components/ProMaxRealitySourceBar";
import { ProMaxUniverseSoundscape } from "@/app/_components/ProMaxUniverseSoundscape";
import type {
  ProjectUniverseTruthSnapshot,
  UniverseTruthItem,
} from "@/lib/server/project-universe-truth";
import {
  getArchitectureRegistryConflicts,
  getArchitectureRegistryNextAction,
  getArchitectureRegistrySummary,
} from "@/lib/server/universe/architecture-registry";
import {
  getUniverseKernelGuards,
  getUniverseKernelNextAction,
  getUniverseKernelPermissions,
  getUniverseKernelReadiness,
  getUniverseKernelRole,
  getUniverseKernelState,
  getUniverseKernelTruth,
} from "@/lib/server/universe/kernel";
import styles from "../founder-universe.module.css";

function TruthList({ items }: { items: UniverseTruthItem[] }) {
  return (
    <ul className={styles.truthList}>
      {items.map((item) => (
        <li key={item.id}>
          <strong>{item.label}</strong>
          <span>{item.value}</span>
          <small>{item.note}</small>
        </li>
      ))}
    </ul>
  );
}

const commandDeckPanels = [
  {
    label: "Universe status",
    value: "Private command environment",
    detail: "Runs on Ahmad devices only and manages Pro Max Earth without public exposure.",
  },
  {
    label: "Pro Max Earth state",
    value: "Future public product planet",
    detail: "Working-name-only product world; public launch remains blocked until all gates close.",
  },
  {
    label: "Living Earth Reality",
    value: "Device-time life layers",
    detail: "Day/night, device-date season, atmosphere, clouds, stars, and soundscape are labeled simulation.",
  },
  {
    label: "Gate Matrix",
    value: "Launch blocked",
    detail: "Brand, legal, compliance, billing, broker, asset, and Founder gates remain pending.",
  },
] as const;

const readinessScores = [
  { label: "Hierarchy clarity", value: "94", state: "Layer order locked" },
  { label: "Truth boundary", value: "100", state: "No unsafe activation" },
  { label: "Earth realism", value: "82", state: "Code-driven improvement" },
  { label: "Launch readiness", value: "0", state: "Blocked by gates" },
] as const;

export default function UniverseCommandCenter({
  truth,
}: {
  truth: ProjectUniverseTruthSnapshot;
}) {
  const registrySummary = getArchitectureRegistrySummary();
  const registryConflicts = getArchitectureRegistryConflicts().slice(0, 6);
  const registryNextAction = getArchitectureRegistryNextAction();
  const kernelState = getUniverseKernelState(truth.checkedAt);
  const kernelRole = getUniverseKernelRole();
  const kernelPermissions = getUniverseKernelPermissions();
  const kernelGuards = getUniverseKernelGuards();
  const kernelTruth = getUniverseKernelTruth();
  const kernelReadiness = getUniverseKernelReadiness(truth.checkedAt);
  const kernelNextAction = getUniverseKernelNextAction();

  return (
    <main
      className={styles.universe}
      data-founder-universe-command-center="true"
      data-owner-only="true"
      data-read-only="true"
      data-public-route-exposed="false"
      aria-label="Private Founder Universe Command Center"
    >
      <ProMaxLivingUniverseBackground surface="founder" />
      <header className={styles.hero}>
        <ProMaxCosmicIdentity size="hero" surface="founder" showLabels />
        <div>
          <span>Private Founder الكون / Universe Command Center</span>
          <h1>Universe Command Center</h1>
          <small className={styles.legacyUniverseTitle}>
            الكون / Universe - Ahmad private electronic self
          </small>
          <p>{truth.identityLine}</p>
          <p>Universe stays private on Ahmad&apos;s devices.</p>
        </div>
        <div className={styles.accessCard}>
          <span>Universe status</span>
          <strong>Private / read-only</strong>
          <small>Product Truth guarded</small>
        </div>
      </header>

      <ProMaxRealityContinuityLayer surface="founder" />
      <ProMaxDeviceTimeRealityBar variant="full" />
      <ProMaxUniverseSoundscape />

      <section className={styles.hierarchyPanel} data-testid="private-universe-hierarchy">
        <div>
          <span>Official Layer Order</span>
          <h2>الكون privately manages Pro Max Galaxy and Earth Planet</h2>
          <p>Universe = technical translation of الكون.</p>
        </div>
        <pre className={styles.hierarchyTree}>
{`Ahmad Private Devices
└── الكون / Universe - Ahmad private electronic self
    ├── Ahmad Digital Vault - private documents, secrets, memory, decisions
    ├── Protection Core - permissions, audit, kill switch, secret protection
    ├── Universe One - literal living reality system
    ├── Swiss Local Constitution - above Global Layer
    └── Pro Max Galaxy - product galaxy inside الكون
        └── Earth Planet - first planet / complete trading project
            ├── Living Earth Reality
            ├── /trading - trading surface on Earth
            ├── Global Layer - future, under Swiss Constitution
            ├── Public Pro Max Future Surfaces - blocked
            └── ALKON - private background guardian

Compatibility evidence:
└── Universe — Private Living Operating System
    └── Pro Max Earth — Future Global Product
        ├── Living Earth Reality — Device-Time Life Layers
        ├── /trading — Trading Ground
        ├── Public Pro Max Surfaces — Future Public Product Layer
        └── ALKON — Private Background Guardian`}
        </pre>
        <div className={styles.hierarchyVisual} aria-label="Premium private Universe hierarchy">
          <div className={styles.hierarchyNode} data-layer="0">
            <span>Layer 0</span>
            <strong>Ahmad Private Devices</strong>
            <small>Only private environment where Universe runs.</small>
          </div>
          <div className={styles.hierarchyNode} data-layer="1">
            <span>Layer 1</span>
            <strong>الكون / Universe</strong>
            <small>Ahmad&apos;s private electronic self and highest management layer.</small>
          </div>
          <div className={styles.hierarchyNode} data-layer="2">
            <span>Core branches</span>
            <strong>Universe One + Pro Max Galaxy</strong>
            <small>Living reality system and product galaxy inside الكون.</small>
          </div>
          <div className={styles.hierarchyBranch}>
            {["Earth Planet", "Living Earth Reality", "/trading", "ALKON background guardian"].map(
              (label, index) => (
                <div key={label} className={styles.branchNode}>
                  <span>Canonical branch {index + 1}</span>
                  <strong>{label}</strong>
                </div>
              )
            )}
          </div>
        </div>
        <div className={styles.layerGrid}>
          {truth.layerOrder.map((layer) => (
            <article key={layer.id}>
              <span>Layer {layer.layerOrder}</span>
              <strong>{layer.label}</strong>
              <small>{layer.truth}</small>
            </article>
          ))}
        </div>
        <p>الكون هو نسخة أحمد الإلكترونية الخاصة.</p>
        <p>الكون يتواصل مع أحمد فقط.</p>
        <p>الكون يعمل فقط على أجهزة أحمد الخاصة.</p>
        <p>Pro Max هو المنتج العالمي المستقبلي، وليس الكون.</p>
        <p>Swiss Local Constitution is above the Global Layer.</p>
        <p>Pro Max Galaxy is inside الكون.</p>
        <p>Earth Planet is the trading project.</p>
        <p>Product Truth overrides all automation and visuals.</p>
        <p>Pro Max is the product that may appear to the world.</p>
        <p>Pro Max is private until legally ready.</p>
        <p>Public Pro Max launch is blocked until all gates close.</p>
        <p>Real when sourced. Simulated when labeled.</p>
        <p>Weather is not connected.</p>
        <p>Legal review is pending.</p>
        <p>ALKON stays private/background.</p>
        <p>ALKON is background guardian support, not the second layer.</p>
        <p>ALKON is private/background, not second.</p>
        <p>Goal: world-class legally ready global product.</p>
      </section>

      <ProMaxLivingEarthLayers />

      <section className={styles.metricGrid} aria-label="Universe status">
        <article>
          <span>Ahmad Private Devices</span>
          <strong>Universe private only</strong>
          <small>Universe stays private on Ahmad&apos;s devices.</small>
        </article>
        <article>
          <span>Universe state</span>
          <strong>Private living operating system</strong>
          <small>Universe is a private living operating system and visual simulation.</small>
        </article>
        <article>
          <span>Pro Max Earth</span>
          <strong>Product planet</strong>
          <small>Pro Max Earth is the product planet inside Universe.</small>
        </article>
        <article>
          <span>Trading Ground</span>
          <strong>Demo-safe / read-only</strong>
          <small>Trading Ground on Pro Max Earth.</small>
        </article>
        <article>
          <span>Public Pro Max future</span>
          <strong>Blocked until gates close</strong>
          <small>Brand, legal, compliance, billing, broker, asset, and Founder gates remain pending.</small>
        </article>
        <article>
          <span>ALKON background guardian</span>
          <strong>Private / read-only</strong>
          <small>ALKON stays private/background.</small>
        </article>
        <article>
          <span>Swiss legal-review gate</span>
          <strong>Pending</strong>
          <small>Legal-review-ready only</small>
        </article>
        <article>
          <span>Global legal-review gate</span>
          <strong>Pending</strong>
          <small>No global approval claim</small>
        </article>
        <article>
          <span>Brand Gate</span>
          <strong>Frozen/deferred</strong>
          <small>No rename, no research now</small>
        </article>
        <article>
          <span>Local Day One</span>
          <strong>not_started</strong>
          <small>Ahmad has not started it</small>
        </article>
      </section>

      <section className={styles.commandDeck} aria-label="Universe command deck">
        <div className={styles.commandDeckMain}>
          <span>Universe Command Deck</span>
          <h2>Private operating layer filled with live truth, gates, and product state</h2>
          <p>
            Universe stays private on Ahmad&apos;s devices while Pro Max Earth remains the
            managed product planet and future public/global product.
          </p>
          <div className={styles.commandDeckGrid}>
            {commandDeckPanels.map((panel) => (
              <article key={panel.label}>
                <span>{panel.label}</span>
                <strong>{panel.value}</strong>
                <small>{panel.detail}</small>
              </article>
            ))}
          </div>
        </div>
        <aside className={styles.readinessStack} aria-label="Readiness scores">
          <span>Readiness Scores</span>
          {readinessScores.map((score) => (
            <div key={score.label} className={styles.readinessScore}>
              <strong>{score.value}</strong>
              <div>
                <span>{score.label}</span>
                <small>{score.state}</small>
              </div>
            </div>
          ))}
        </aside>
      </section>

      <ProMaxRealitySourceBar variant="full" />

      <section
        className={styles.kernelPanel}
        data-testid="universe-operating-kernel"
        aria-label="Universe Operating Kernel"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Universe Operating Kernel</span>
            <h2>Existing kernel canonicalized as Universe Operating Kernel.</h2>
            {kernelRole.statements.map((statement) => (
              <p key={statement}>{statement}</p>
            ))}
          </div>
          <aside>
            <strong>{kernelState.status}</strong>
            <small>{kernelState.commandCount} existing kernel commands preserved</small>
            <small>No duplicate kernel exists.</small>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Canonical owner</span>
            <strong>{kernelState.canonicalOwner}</strong>
            <small>{kernelState.adapterPath} delegates to {kernelState.existingKernelPath}</small>
          </article>
          <article>
            <span>Kernel role</span>
            <strong>Root private operating brain</strong>
            <small>{kernelRole.canonicalLayer} now maps the existing kernel into the Universe architecture.</small>
          </article>
          <article>
            <span>Readiness</span>
            <strong>{kernelReadiness.canonicalization}</strong>
            <small>Infinity Mode remains blocked until founder boundary and remaining registry conflicts are resolved.</small>
          </article>
          <article>
            <span>Next safe action</span>
            <strong>{kernelNextAction.next}</strong>
            <small>{kernelNextAction.reason}</small>
          </article>
        </div>
        <div className={styles.kernelColumns}>
          <article>
            <span>Allowed safe internal</span>
            <ul>
              {kernelPermissions.allowedSafeInternal.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Requires Ahmad approval</span>
            <ul>
              {kernelPermissions.requiresAhmadApproval.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Blocked</span>
            <ul>
              {kernelPermissions.blocked.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className={styles.kernelGuardList}>
          <span>Kernel guards</span>
          {kernelGuards.map((guard) => (
            <article key={guard.id}>
              <strong>{guard.label}</strong>
              <small>{guard.note}</small>
              <em>{guard.status}</em>
            </article>
          ))}
        </div>
        <div className={styles.kernelTruthStrip}>
          <span>Product Truth overrides every action.</span>
          <span>Swiss Local Constitution is above the Global Layer.</span>
          <span>Public launch blocked: {kernelTruth.publicLaunchBlocked ? "yes" : "no"}</span>
          <span>Real money disabled: {kernelTruth.realMoneyDisabled ? "yes" : "no"}</span>
          <span>
            Broker execution disabled/not connected:{" "}
            {kernelTruth.brokerExecutionDisabled ? "yes" : "no"}
          </span>
          <span>Dangerous actions require Ahmad approval or remain blocked.</span>
        </div>
      </section>

      <section
        className={styles.registryPanel}
        data-testid="canonical-architecture-registry"
        aria-label="Canonical Architecture Registry"
      >
        <div className={styles.registryHeader}>
          <div>
            <span>Canonical Architecture Registry</span>
            <h2>Primary sources are the only future truth.</h2>
            <p>Compatibility layers must wrap primary logic.</p>
            <p>Cleanup candidates require controlled cleanup.</p>
            <p>Ahmad decision required for unresolved product meaning.</p>
            <p>Infinity Mode remains blocked until registry conflicts are resolved.</p>
            <p>Cleanup status: controlled canonical cleanup applied; existing kernel canonicalized through the Universe Operating Kernel adapter.</p>
            <p>Remaining conflicts: planet API classification, legacy visual wrappers, and Ahmad-decision product meaning.</p>
          </div>
          <aside>
            <strong>{registrySummary.safestNextAction}</strong>
            <small>{registryNextAction.reason}</small>
          </aside>
        </div>
        <div className={styles.registryStats}>
          <article>
            <span>Primary</span>
            <strong>{registrySummary.primaryCount}</strong>
          </article>
          <article>
            <span>Compatibility</span>
            <strong>{registrySummary.compatibilityCount}</strong>
          </article>
          <article>
            <span>Protected</span>
            <strong>{registrySummary.protectedCount}</strong>
          </article>
          <article>
            <span>Cleanup candidate</span>
            <strong>{registrySummary.cleanupCandidateCount}</strong>
          </article>
          <article>
            <span>Needs Ahmad decision</span>
            <strong>{registrySummary.needsAhmadDecisionCount}</strong>
          </article>
        </div>
        <div className={styles.registryConflictList}>
          <span>Top conflicts</span>
          {registryConflicts.map((item) => (
            <article key={item.id}>
              <strong>{item.label}</strong>
              <small>{item.recommendation}</small>
              <em>{item.category}</em>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.truthPanel} data-product-truth="true">
        <div>
          <span>Product Truth</span>
          <h2>Blocked gates remain blocked</h2>
        </div>
        <div className={styles.truthStrip}>
          <span>Private: yes</span>
          <span>Universe: Ahmad devices only</span>
          <span>Read-only/demo-safe: yes</span>
          <span>Pro Max: working_name_only</span>
          <span>Pro Max public/global approval: false</span>
          <span>Real money: disabled</span>
          <span>Broker execution: disabled/not connected</span>
          <span>Trading: demo-safe/read-only</span>
          <span>Public launch: not started</span>
          <span>Public launch: blocked/not started</span>
          <span>Billing: not active</span>
          <span>Brand Gate: frozen/deferred</span>
          <span>Brand Gate: ready_with_notes</span>
          <span>Local Day One: not_started</span>
          <span>ALKON public exposure: no</span>
          <span>ALKON: private/read-only/background</span>
          <span>Swiss legal-review: pending</span>
          <span>Global legal-review: pending</span>
          <span>Swiss-inspired visual identity only; no government endorsement</span>
          <span>Device-time simulation only</span>
          <span>Device-date simulation only</span>
          <span>Weather not connected</span>
          <span>Weather is not connected</span>
          <span>Location: not requested</span>
          <span>Assets: local/procedural/license-safe</span>
          <span>Assets: local/legal-safe/procedural/manifest-tracked</span>
          <span>Soundscape: user controlled/off by default</span>
          <span>Private until legally ready</span>
        </div>
      </section>

      <section className={styles.columns}>
        <article>
          <span>Allowed now</span>
          <h2>Private review only</h2>
          <TruthList items={truth.allowedNow} />
        </article>
        <article>
          <span>Blocked now</span>
          <h2>Unsafe activation stays closed</h2>
          <TruthList items={truth.blockedNow} />
        </article>
        <article>
          <span>Legal review</span>
          <h2>Not legal advice</h2>
          <TruthList items={truth.futureLegalReview} />
        </article>
        <article>
          <span>Swiss / global review</span>
          <h2>Future review gates</h2>
          <TruthList items={[...truth.futureSwissReview, ...truth.futureGlobalReview]} />
        </article>
      </section>

      <section className={styles.actionPanel}>
        <article data-one-next-action="true">
          <span>One Next Action</span>
          <strong>{truth.oneNextAction}</strong>
        </article>
        <article data-what-not-to-do="true">
          <span>What Not To Do</span>
          <ul>
            {truth.whatNotToDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
