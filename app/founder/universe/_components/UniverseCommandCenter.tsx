import { ProMaxDeviceTimeRealityBar } from "@/app/_components/ProMaxDeviceTimeRealityBar";
import { AlKawnCosmicIdentity } from "@/app/_components/al-kawn-visual/AlKawnCosmicIdentity";
import { AlKawnProductTruthStrip } from "@/app/_components/al-kawn-visual/AlKawnProductTruthStrip";
import { ProMaxLivingEarthLayers } from "@/app/_components/ProMaxLivingEarthLayers";
import { ProMaxLivingUniverseBackground } from "@/app/_components/ProMaxLivingUniverseBackground";
import { ProMaxRealityContinuityLayer } from "@/app/_components/ProMaxRealityContinuityLayer";
import { ProMaxRealitySourceBar } from "@/app/_components/ProMaxRealitySourceBar";
import { ProMaxUniverseSoundscape } from "@/app/_components/ProMaxUniverseSoundscape";
import Link from "next/link";
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
  getApprovalRequiredActions,
  getFounderBoundaryRules,
  getFounderDecisionMatrix,
  getNeverAloneActions,
  getSafeInternalActions,
} from "@/lib/server/universe/founder-boundary";
import {
  getUniverseKernelGuards,
  getUniverseKernelNextAction,
  getUniverseKernelPermissions,
  getUniverseKernelReadiness,
  getUniverseKernelRole,
  getUniverseKernelState,
  getUniverseKernelTruth,
} from "@/lib/server/universe/kernel";
import {
  explainEntityFromInfinityToZero,
  getAlKawnOntologicalLaw,
  getExistenceContracts,
  getImpactMemoryRules,
  getLayerBelongingRules,
  getOntologicalExecutionVerdictRules,
  getRollbackExplanationRules,
  getTruthSourceRules,
} from "@/lib/server/universe/ontological-law";
import {
  explainVisualMapNode,
  getAlKawnVisualMap,
  getAlKawnVisualMapBoundaries,
  getAlKawnVisualMapConnections,
  getAlKawnVisualMapEdges,
  getAlKawnVisualMapLegend,
  getAlKawnVisualMapLayers,
  getAlKawnVisualMapNextAction,
  getAlKawnVisualMapNodes,
  getAlKawnVisualMapSummary,
  getAlKawnVisualMapTruth,
} from "@/lib/server/universe/visual-map";
import { getAlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
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

function getVisualMapEarthChildDetail(label: string) {
  if (label === "/trading") {
    return "/trading is the trading surface.";
  }

  if (label === "Trading Project") {
    return "Trading Project belongs to Earth Planet.";
  }

  if (label === "Pro Max Center") {
    return "Pro Max Center belongs to Earth Planet / Pro Max product surface.";
  }

  if (label === "Global Layer") {
    return "Under Swiss Local Constitution.";
  }

  if (label === "ALKON Background Guardian") {
    return "ALKON is private/background.";
  }

  return "Protected by Product Truth.";
}

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
  const boundaryRules = getFounderBoundaryRules();
  const boundaryMatrix = getFounderDecisionMatrix();
  const safeInternalActions = getSafeInternalActions().slice(0, 10);
  const approvalRequiredActions = getApprovalRequiredActions().slice(0, 12);
  const neverAloneActions = getNeverAloneActions().slice(0, 12);
  const ontologicalLaw = getAlKawnOntologicalLaw();
  const existenceContracts = getExistenceContracts().slice(0, 5);
  const layerBelongingRules = getLayerBelongingRules().slice(0, 8);
  const truthSourceRules = getTruthSourceRules().slice(0, 6);
  const executionVerdictRules = getOntologicalExecutionVerdictRules();
  const impactMemoryRules = getImpactMemoryRules();
  const rollbackExplanationRules = getRollbackExplanationRules().slice(0, 5);
  const infinityToZeroExplanation =
    explainEntityFromInfinityToZero("alkawn_root");
  const visualMap = getAlKawnVisualMap();
  const visualMapLayers = getAlKawnVisualMapLayers();
  const visualMapConnections = getAlKawnVisualMapConnections();
  const visualMapNodes = getAlKawnVisualMapNodes();
  const visualMapEdges = getAlKawnVisualMapEdges();
  const visualMapLegend = getAlKawnVisualMapLegend();
  const visualMapBoundaries = getAlKawnVisualMapBoundaries();
  const visualMapSummary = getAlKawnVisualMapSummary();
  const visualMapTruth = getAlKawnVisualMapTruth();
  const visualMapNextAction = getAlKawnVisualMapNextAction();
  const desktopState = getAlKawnDesktopState(new Date(truth.checkedAt));
  const visualMapCoreLayerIds = [
    "existence_contract",
    "product_truth",
    "universe_operating_kernel",
    "ahmad_digital_vault",
    "protection_core",
    "universe_one",
    "swiss_local_constitution",
    "human_interface",
    "sovereign_execution",
    "execution_court",
    "causal_execution",
    "infinity_mode",
    "operator_mode",
    "self_building",
  ];
  const visualMapDetailLayerIds = [
    "al_kawn",
    "product_truth",
    "universe_operating_kernel",
    "universe_one",
    "pro_max_galaxy",
    "earth_planet",
    "trading_surface",
    "pro_max_center",
  ];
  const visualMapCoreLayers = visualMapLayers.filter((layer) =>
    visualMapCoreLayerIds.includes(layer.id)
  );
  const visualMapDetailLayers = visualMapLayers.filter((layer) =>
    visualMapDetailLayerIds.includes(layer.id)
  );
  const visualMapDetailNodes = visualMapNodes.filter((node) =>
    visualMapDetailLayerIds.includes(node.id)
  );
  const futureGatedVisualNodes = visualMapNodes.filter((node) =>
    ["blocked", "future_gated", "public_future"].includes(node.status)
  );

  return (
    <main
      className={`${styles.universe} al-kawn-visual-root`}
      data-testid="al-kawn-unified-visual-identity"
      data-al-kawn-visual-system="canonical"
      data-al-kawn-surface="founder"
      data-founder-universe-command-center="true"
      data-owner-only="true"
      data-read-only="true"
      data-public-route-exposed="false"
      aria-label="Private Founder Universe Command Center"
    >
      <ProMaxLivingUniverseBackground surface="founder" />
      <header className={styles.hero}>
        <AlKawnCosmicIdentity variant="hero" showLabels />
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
      <AlKawnProductTruthStrip />
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

      <section
        className={styles.visualMapPanel}
        data-testid="al-kawn-visual-map"
        aria-label="Al-Kawn Visual Map"
      >
        <div className={styles.visualMapHeader}>
          <div>
            <span>{visualMap.title}</span>
            <h2>Al-Kawn Visual Map</h2>
            <p>{visualMap.purpose}</p>
            <p>أحمد هو الأصل</p>
            <p>الكون هو نسخة أحمد الإلكترونية الخاصة.</p>
            <p>الكون هو الوجود الرقمي الخاص بأحمد</p>
            <p>الكون فوق برو ماكس.</p>
            <p>Every entity inside الكون needs an Existence Contract</p>
            <p>Product Truth هو قانون الحقيقة الأعلى</p>
            <p>Universe Operating Kernel هو القاضي التنفيذي</p>
            <p>كل شيء داخل الكون يجب أن ينتمي إلى طبقة واضحة.</p>
            <p>Pro Max Galaxy is inside الكون</p>
            <p>Pro Max Galaxy داخل الكون.</p>
            <p>Earth Planet is the trading project</p>
            <p>Earth Planet داخل Pro Max Galaxy.</p>
            <p>/trading ينتمي إلى Earth Planet.</p>
            <p>Swiss Local Constitution is above the Global Layer</p>
            <p>ALKON is private/background</p>
            <p>ALKON هو حارس خلفي خاص.</p>
            <p>Infinity Mode محجوب حاليًا.</p>
            <p>Operator Mode محجوب حاليًا.</p>
            <p>Public Pro Max Future بوابة مستقبلية.</p>
            <p>Legal and Money gates stop execution for Ahmad</p>
            <p>∞ إلى 0 يعني تفسير البنية والرجوع إلى الأصل.</p>
          </div>
          <aside>
            <strong>{visualMapNextAction.next}</strong>
            <small>{visualMapNextAction.reason}</small>
          </aside>
        </div>

        <div className={styles.visualMapSummaryGrid} aria-label="Visual map overview summary">
          <article>
            <span>Nodes</span>
            <strong>{visualMapSummary.totalNodes}</strong>
            <small>Every node carries owner, truth source, status, boundary, and origin relation.</small>
          </article>
          <article>
            <span>Edges</span>
            <strong>{visualMapSummary.totalEdges}</strong>
            <small>Edges show ownership, containment, governance, blocks, protection, and routes.</small>
          </article>
          <article>
            <span>Private scope</span>
            <strong>{visualMapSummary.privateOnly ? "Ahmad only" : "review"}</strong>
            <small>Private vs public distinction is explicit and public launch remains blocked.</small>
          </article>
          <article>
            <span>Modes</span>
            <strong>blocked/future</strong>
            <small>Infinity Mode and Operator Mode are visible as blocked future layers, not active.</small>
          </article>
        </div>

        <pre className={styles.visualMapCanonicalTree} aria-label="Canonical Al-Kawn hierarchy tree">
{`Ahmad Human
└── Ahmad Private Devices
    └── الكون
        ├── Supreme Root Constitution
        ├── Product Truth
        ├── Universe Operating Kernel
        ├── Existence Contract Law
        ├── Ahmad Digital Vault
        ├── Protection Core
        ├── Universe One
        ├── Swiss Local Constitution
        ├── Human Interface
        ├── Sovereign Execution
        ├── Execution Court
        ├── Causal Execution
        ├── Infinity Mode — blocked / future
        ├── Operator Mode — blocked / future
        ├── Self-Building — future-governed only
        └── Pro Max Galaxy
            └── Earth Planet
                ├── Trading Project
                ├── /trading
                ├── Pro Max Center
                ├── Global Layer
                ├── Public Pro Max Future
                └── ALKON Background Guardian`}
        </pre>

        <div className={styles.visualMapTree}>
          <article className={styles.visualMapOrigin}>
            <span>Origin</span>
            <strong>Ahmad Human</strong>
            <small>Ahmad is the source and final decision authority.</small>
          </article>
          <article className={styles.visualMapDevice}>
            <span>Private devices</span>
            <strong>Ahmad Private Devices</strong>
            <small>Only private environment where الكون runs.</small>
          </article>
          <article className={styles.visualMapRoot}>
            <span>Root</span>
            <strong>الكون</strong>
            <small>Ahmad&apos;s private digital existence.</small>
          </article>
          <div className={styles.visualMapCore} aria-label="Major internal layers">
            {visualMapCoreLayers.map((layer) => (
              <article key={layer.id}>
                <span>{layer.status}</span>
                <strong>{layer.technicalLabel}</strong>
                <small>{layer.purpose}</small>
              </article>
            ))}
          </div>
          <article className={styles.visualMapGalaxy}>
            <span>Product galaxy</span>
            <strong>Pro Max Galaxy</strong>
            <small>Pro Max Galaxy is inside الكون.</small>
          </article>
          <article className={styles.visualMapPlanet}>
            <span>First planet</span>
            <strong>Earth Planet</strong>
            <small>Earth Planet is the trading project.</small>
          </article>
          <div className={styles.visualMapEarthChildren}>
            {[
              "Living Earth Reality",
              "Trading Project",
              "/trading",
              "Pro Max Center",
              "Global Layer",
              "Public Pro Max Future",
              "ALKON Background Guardian",
            ].map((label) => (
              <article key={label}>
                <strong>{label}</strong>
                <small>{getVisualMapEarthChildDetail(label)}</small>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.visualMapConnections}>
          <span>Governing connections</span>
          {visualMapEdges.map((edge) => (
            <article key={edge.id}>
              <strong>{edge.truthMeaning}</strong>
              <small>
                {edge.from} -&gt; {edge.to} / {edge.edgeType} / {edge.label}
              </small>
            </article>
          ))}
          {visualMapConnections.map((connection) => (
            <article key={connection.id}>
              <strong>{connection.meaning}</strong>
              <small>
                {connection.from} -&gt; {connection.to} / {connection.relation}
              </small>
            </article>
          ))}
        </div>

        <div className={styles.visualMapDetails}>
          <span>Layer detail panel</span>
          {visualMapDetailNodes.map((node) => (
            <article key={node.id}>
              <strong>{node.englishLabel}</strong>
              <small>{node.compactExplanation}</small>
              <em>Owner: {node.owner}</em>
              <em>Layer type: {node.layerType}</em>
              <em>Status: {node.status}</em>
              <em>Truth source: {node.truthSource}</em>
              <em>Visibility: {node.visibilityScope}</em>
              <em>Boundary: {node.boundaryType}</em>
              <em>Execution: {node.executionMeaning}</em>
              <em>Origin relation: {node.relationToOrigin}</em>
              <em>{explainVisualMapNode(node.id)}</em>
            </article>
          ))}
          {visualMapDetailLayers.map((layer) => (
            <article key={`layer-${layer.id}`}>
              <strong>{layer.technicalLabel}</strong>
              <small>{layer.purpose}</small>
              <em>Owner: {layer.parent ?? "origin"}</em>
              <em>Truth source: {layer.truthSource}</em>
              <em>Product Truth impact: {layer.productTruthImpact}</em>
              <em>Execution role: {layer.executionRole}</em>
              <em>Stops: {layer.approvalGate}</em>
              <em>Status: {layer.status}</em>
            </article>
          ))}
        </div>

        <div className={styles.visualMapConnections} aria-label="Visual map legend">
          <span>Legend</span>
          {visualMapLegend.map((item) => (
            <article key={item.id}>
              <strong>{item.label}</strong>
              <small>{item.meaning}</small>
            </article>
          ))}
        </div>

        <div className={styles.visualMapConnections} aria-label="Boundary explanations">
          <span>Boundary explanation</span>
          {visualMapBoundaries.map((boundary) => (
            <article key={boundary.id}>
              <strong>{boundary.label}</strong>
              <small>{boundary.meaning}</small>
              <small>{boundary.affectedNodeIds.join(", ")}</small>
            </article>
          ))}
        </div>

        <div className={styles.visualMapConnections} aria-label="Future gated layers">
          <span>Future-gated layers</span>
          {futureGatedVisualNodes.map((node) => (
            <article key={node.id}>
              <strong>{node.englishLabel}</strong>
              <small>{node.compactExplanation}</small>
              <small>{node.status} / {node.boundaryType}</small>
            </article>
          ))}
        </div>

        <div className={styles.visualMapTruthStrip} data-product-truth="true">
          {[...visualMapTruth.enforcedTruths, ...visualMapTruth.blockedStates].map((label) => (
            <span key={label}>{label}</span>
          ))}
          <span>Product Truth</span>
          <span>الكون private to Ahmad devices</span>
          <span>Pro Max future public product</span>
          <span>public launch blocked</span>
          <span>billing inactive</span>
          <span>payments inactive</span>
          <span>real money disabled</span>
          <span>broker execution disabled/not connected</span>
          <span>legal review pending</span>
          <span>ALKON private/background</span>
        </div>
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

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-desktop-card"
        aria-label="Al-Kawn Desktop Operating Environment"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Al-Kawn Desktop Operating Environment</span>
            <h2>Desktop is the main private command client for ط§ظ„ظƒظˆظ†</h2>
            <p>Desktop is the main private command client for الكون</p>
            <p>Mobile clients come later as lightweight private access</p>
            <p>Public distribution is blocked</p>
            <p>Product Truth enforced</p>
          </div>
          <aside>
            <strong>{desktopState.nativeShell.desktopRoute}</strong>
            <small>Desktop route status: private desktop-first command surface</small>
            <small>Native shell status: {desktopState.nativeShell.nativeShellStatus}</small>
            <small>{desktopState.nativeShell.note}</small>
            <Link href="/desktop/kawn">Open Al-Kawn Desktop</Link>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Role</span>
            <strong>Al-Kawn Desktop is Ahmad&apos;s private operating environment</strong>
            <small>الكون هو نسخة أحمد الإلكترونية الخاصة</small>
          </article>
          <article>
            <span>Desktop shell inventory</span>
            <strong>Native shell future gate</strong>
            <small>Electron: {desktopState.nativeShell.electron}; Tauri: {desktopState.nativeShell.tauri}</small>
          </article>
          <article>
            <span>Distribution</span>
            <strong>Private Ahmad-only</strong>
            <small>No public desktop distribution is started.</small>
          </article>
          <article>
            <span>Mobile later</span>
            <strong>Lightweight private access</strong>
            <small>Android and iPhone clients remain future private access gates.</small>
          </article>
        </div>
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
        className={styles.kernelPanel}
        data-testid="absolute-founder-boundary"
        aria-label="Absolute Founder Boundary"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Absolute Founder Boundary</span>
            <h2>الكون يعمل داخليًا، وأحمد يبقى صاحب القرار الخارجي والنهائي</h2>
            {boundaryRules.map((rule) => (
              <p key={rule.id}>{rule.wording}</p>
            ))}
            <p>Universe Operating Kernel enforces Absolute Founder Boundary.</p>
          </div>
          <aside>
            <strong>Boundary active</strong>
            <small>{boundaryMatrix.safeInternalCount} safe internal actions</small>
            <small>{boundaryMatrix.neverAloneCount} never-alone actions</small>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Money / Payment</span>
            <strong>Ahmad approval always</strong>
            <small>Payment, receiving money, payouts, invoices, pricing, subscriptions, bank links, and payment credentials are never autonomous.</small>
          </article>
          <article>
            <span>Real Trading / Broker</span>
            <strong>Ahmad approval always</strong>
            <small>Real trading, live broker connections, broker keys, real orders, and real account risk changes remain blocked.</small>
          </article>
          <article>
            <span>Legal / Public / Brand</span>
            <strong>Ahmad approval always</strong>
            <small>Legal claims, public launch, brand adoption, domains, ownership, and public exposure are never autonomous.</small>
          </article>
          <article>
            <span>Secrets / Irreversible</span>
            <strong>Ahmad approval always</strong>
            <small>Secrets, private documents, external accounts, destructive actions, and final founder decisions never leave Ahmad control.</small>
          </article>
        </div>
        <div className={styles.kernelColumns}>
          <article>
            <span>Safe internal actions</span>
            <ul>
              {safeInternalActions.map((action) => (
                <li key={action.id}>{action.label}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Approval-required actions</span>
            <ul>
              {approvalRequiredActions.map((action) => (
                <li key={action.id}>{action.label}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Never-alone actions</span>
            <ul>
              {neverAloneActions.map((action) => (
                <li key={action.id}>{action.label}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className={styles.kernelTruthStrip}>
          <span>الكون لا يتجاوز Product Truth.</span>
          <span>Money/payment boundary: Ahmad approval required</span>
          <span>Broker boundary: Ahmad approval required</span>
          <span>Public launch boundary: Ahmad approval required</span>
          <span>Secrets boundary: explicit Ahmad approval required</span>
          <span>Final decision boundary: Ahmad only</span>
        </div>
      </section>

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-ontological-operating-law"
        aria-label="Al-Kawn Ontological Operating Law"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Al-Kawn Ontological Operating Law</span>
            <h2>{ontologicalLaw.arabicTitle}</h2>
            <p>الكون هو الوجود الرقمي الخاص لأحمد.</p>
            <p>الكون ليس مجازًا داخل البرمجيات.</p>
            {ontologicalLaw.highestLaw.map((law) => (
              <p key={law}>{law}</p>
            ))}
            <p>No entity enters الكون without an Existence Contract.</p>
            <p>Product Truth هو قانون الحقيقة الأعلى.</p>
            <p>Universe Operating Kernel هو القاضي التنفيذي.</p>
            <p>Kernel enforces the ontological law of الكون.</p>
            <p>{ontologicalLaw.physicalRealityBoundary}</p>
          </div>
          <aside>
            <strong>Existence law active</strong>
            <small>{existenceContracts.length} contract examples</small>
            <small>{executionVerdictRules.length} execution verdicts</small>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Existence Contract</span>
            <strong>Every entity proves why it exists</strong>
            <small>Routes, APIs, components, modules, reports, docs, tests, assets, scripts, tasks, decisions, and future features must declare origin, layer, truth source, Product Truth impact, and explanation path.</small>
          </article>
          <article>
            <span>Layer belonging</span>
            <strong>No orphan entity</strong>
            <small>Pro Max Galaxy belongs inside الكون, Earth Planet belongs inside Pro Max Galaxy, /trading belongs to Earth Planet, and ALKON remains private/background.</small>
          </article>
          <article>
            <span>Truth source</span>
            <strong>Real when sourced</strong>
            <small>Real when sourced. Simulated when labeled. Unknown when not verified. Pending when future-gated.</small>
          </article>
          <article>
            <span>∞ to 0 explanation</span>
            <strong>Every layer returns to origin</strong>
            <small>∞ إلى 0 يعني تفسير الكون والرجوع إلى الأصل. كل طبقة يجب أن يمكن شرحها إلى أصلها.</small>
          </article>
        </div>
        <div className={styles.kernelColumns}>
          <article>
            <span>Core execution law</span>
            <ul>
              {ontologicalLaw.coreExecutionLaw.map((law) => (
                <li key={law}>{law}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Existence contracts</span>
            <ul>
              {existenceContracts.map((contract) => (
                <li key={contract.entityId}>
                  {contract.technicalLabel}: {contract.executionVerdict}
                </li>
              ))}
            </ul>
          </article>
          <article>
            <span>Execution verdicts</span>
            <ul>
              {executionVerdictRules.map((rule) => (
                <li key={rule.verdict}>{rule.verdict}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className={styles.kernelGuardList}>
          <span>Layer and truth source rules</span>
          {layerBelongingRules.map((rule) => (
            <article key={rule.id}>
              <strong>{rule.wording}</strong>
              <small>{rule.parent} → {rule.child}</small>
              <em>{rule.status}</em>
            </article>
          ))}
          {truthSourceRules.map((rule) => (
            <article key={rule.source}>
              <strong>{rule.allowedClaim}</strong>
              <small>{rule.meaning}</small>
              <em>{rule.source}</em>
            </article>
          ))}
        </div>
        <div className={styles.kernelTruthStrip}>
          {impactMemoryRules.map((rule) => (
            <span key={rule.id}>{rule.meaning}</span>
          ))}
          {rollbackExplanationRules.map((rule) => (
            <span key={rule.id}>{rule.question}: {rule.answerRequirement}</span>
          ))}
          <span>{infinityToZeroExplanation}</span>
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
