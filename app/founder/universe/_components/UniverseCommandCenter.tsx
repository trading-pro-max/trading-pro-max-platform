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
import { getControlSurfaceSummary } from "@/lib/server/universe/control-surfaces";
import { getAlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import { getDesktopDistributionGate } from "@/lib/server/universe/desktop-distribution-gate";
import { getPrivateDesktopLocalBuildDryRun } from "@/lib/server/universe/desktop-local-build-dry-run";
import { getDesktopPackagingGate } from "@/lib/server/universe/desktop-packaging-gate";
import { getPrivateDesktopPackagingPreparation } from "@/lib/server/universe/desktop-packaging-preparation";
import { getAlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import { getAlKawnElectronicCapabilities } from "@/lib/server/universe/electronic-capabilities";
import { getAlKawnExecutableGlossary } from "@/lib/server/universe/executable-glossary";
import { getAlKawnHumanSpokenInterfaceState } from "@/lib/server/universe/human-spoken-interface";
import {
  getAlKawnInfinityPreparation,
  getInfinityControlledActivation,
} from "@/lib/server/universe/infinity";
import { getAlKawnLivingAutonomousIntelligence } from "@/lib/server/universe/living-autonomous-intelligence";
import { getAlKawnLivingOntology } from "@/lib/server/universe/living-ontology";
import { getLocalDayOneReadiness } from "@/lib/server/universe/local-day-one";
import {
  getLocalDesktopAuthBoundaries,
  getLocalDesktopAuthNextAction,
  getLocalDesktopAuthReadiness,
  getLocalDesktopAuthStatus,
} from "@/lib/server/universe/local-desktop-auth";
import { getLocalPackagedAuthGate } from "@/lib/server/universe/local-packaged-auth-gate";
import {
  getAlKawnOperatorPreparation,
  getOperatorControlledActivation,
} from "@/lib/server/universe/operator";
import { getAlKawnAutomaticEngineState } from "@/lib/server/universe/automatic-engine";
import { getAlKawnOwnershipRegistry } from "@/lib/server/universe/rights-ownership";
import { getAlKawnTotalExistenceSystem } from "@/lib/server/universe/total-existence";
import { getAlKawnWakeState } from "@/lib/server/universe/wake-state";
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
  const controlSurfaceSummary = getControlSurfaceSummary();
  const desktopState = getAlKawnDesktopState(new Date(truth.checkedAt));
  const desktopPackagingGate = getDesktopPackagingGate();
  const localPackagedAuthGate = getLocalPackagedAuthGate();
  const desktopPackagingPreparation = getPrivateDesktopPackagingPreparation();
  const desktopLocalBuildDryRun = getPrivateDesktopLocalBuildDryRun();
  const desktopDistributionGate = getDesktopDistributionGate();
  const localDesktopAuthReadiness = getLocalDesktopAuthReadiness();
  const localDesktopAuthStatus = getLocalDesktopAuthStatus();
  const localDesktopAuthBoundaries = getLocalDesktopAuthBoundaries();
  const localDesktopAuthNextAction = getLocalDesktopAuthNextAction();
  const wakeState = getAlKawnWakeState();
  const dailyWorkLoop = getAlKawnDailyWorkLoop();
  const spokenInterface = getAlKawnHumanSpokenInterfaceState();
  const infinityPreparation = getAlKawnInfinityPreparation();
  const infinityActivation = getInfinityControlledActivation();
  const operatorPreparation = getAlKawnOperatorPreparation();
  const operatorActivation = getOperatorControlledActivation();
  const localDayOne = getLocalDayOneReadiness();
  const totalExistence = getAlKawnTotalExistenceSystem();
  const capabilities = getAlKawnElectronicCapabilities();
  const glossary = getAlKawnExecutableGlossary();
  const rights = getAlKawnOwnershipRegistry();
  const livingOntology = getAlKawnLivingOntology();
  const automaticEngine = getAlKawnAutomaticEngineState();
  const livingAutonomousIntelligence = getAlKawnLivingAutonomousIntelligence();
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

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-experiential-desktop-summary"
        aria-label="Al-Kawn experiential desktop correction"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Emergency Al-Kawn Desktop Experience Correction</span>
            <h2>/desktop/kawn هو بيت الكون الحي، وليس لوحة تقنية.</h2>
            <p>/desktop/kawn now opens as a living universe experience, not a technical dashboard.</p>
            <p>Product Truth remains visible above visual beauty.</p>
            <p>Duplicate React key error fixed for repeated daily loop wording.</p>
            <p>Technical details remain available below the living entry.</p>
          </div>
          <aside>
            <strong>Desktop experience correction complete</strong>
            <small>Welcome to الكون.</small>
            <small>Duplicate key error fixed.</small>
            <small>Local Day One remains ready_not_started.</small>
            <small>Ahmad review required before Local Day One.</small>
            <Link href="/desktop/kawn">Enter الكون</Link>
          </aside>
        </div>
      </section>

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
            <span>Al-Kawn Desktop Operating Environment / Desktop shell finalization</span>
            <h2>Desktop is the main private command client for الكون</h2>
            <p>/desktop/kawn is the Al-Kawn private desktop home.</p>
            <p>Private Ahmad-only desktop shell.</p>
            <p>Private Desktop Packaging Gate</p>
            <p>Local Packaged Auth Gate</p>
            <p>Local PIN / Passphrase Auth</p>
            <p>Private Desktop Packaging Preparation</p>
            <p>Local PIN / Passphrase Auth is preserved.</p>
            <p>Private Desktop Local Build Dry Run</p>
            <p>Private Desktop Distribution Gate</p>
            <p>Ahmad-only local access</p>
            <p>Desktop is the main private command client for الكون</p>
            <p>Mobile clients come later as lightweight private access</p>
            <p>Public distribution is blocked</p>
            <p>Public desktop distribution is blocked.</p>
            <p>Distribution is private Ahmad-only.</p>
            <p>Signing remains a future gate.</p>
            <p>Production signing remains a future gate.</p>
            <p>No installers are uploaded or published.</p>
            <p>Signing and private distribution require future approval.</p>
            <p>Desktop remains Ahmad-only.</p>
            <p>External auth requires Ahmad approval</p>
            <p>External auth providers require Ahmad approval.</p>
            <p>Production-grade auth remains a future gate unless implemented.</p>
            <p>No secrets are stored in the desktop bundle.</p>
            <p>External accounts require Ahmad approval.</p>
            <p>Product Truth enforced</p>
            <p>Product Truth overrides every action.</p>
          </div>
          <aside>
            <strong>{desktopState.nativeShell.desktopRoute}</strong>
            <small>Desktop route status: private desktop-first command surface</small>
            <small>Native shell status: {desktopState.nativeShell.nativeShellStatus}</small>
            <small>Shell type: {desktopState.shellFinalization.shellType}</small>
            <small>Private Desktop Packaging Gate status: {desktopPackagingGate.status}</small>
            <small>Local Packaged Auth Gate status: {localPackagedAuthGate.status}</small>
            <small>Local PIN / Passphrase Auth status: {localDesktopAuthStatus.state}</small>
            <small>Session timeout status: {localDesktopAuthStatus.sessionTimeout}</small>
            <small>Manual lock support: {localDesktopAuthStatus.manualLock}</small>
            <small>OS keychain/device-lock: future gate</small>
            <small>
              Private Desktop Packaging Preparation status: {desktopPackagingPreparation.status}
            </small>
            <small>
              Private Desktop Local Build Dry Run status: {desktopLocalBuildDryRun.status}
            </small>
            <small>
              Private Desktop Distribution Gate status: {desktopDistributionGate.status}
            </small>
            <small>Package readiness: {desktopPackagingPreparation.packagingCapability.state}</small>
            <small>Local dry run support: {desktopLocalBuildDryRun.capability.state}</small>
            <small>Artifact status: {desktopLocalBuildDryRun.artifactSafety.result}</small>
            <small>Distribution readiness: {desktopDistributionGate.privateDistributionReadiness.state}</small>
            <small>Native signing and private distribution remain future gates</small>
            <small>Signing future gate: {desktopPackagingGate.signingReadiness.state}</small>
            <small>Local auth packaging gate: {desktopPackagingGate.authReadiness.state}</small>
            <small>
              Production-grade auth future gate: {localPackagedAuthGate.localAuthReadiness.state}
            </small>
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
            <small>Public desktop distribution is blocked.</small>
          </article>
          <article>
            <span>Private Desktop Packaging Gate</span>
            <strong>{desktopPackagingGate.summary}</strong>
            <small>{desktopPackagingGate.nextAction.reason}</small>
          </article>
          <article>
            <span>Local Packaged Auth Gate</span>
            <strong>{localPackagedAuthGate.summary}</strong>
            <small>{localPackagedAuthGate.nextAction.reason}</small>
          </article>
          <article>
            <span>Local PIN / Passphrase Auth</span>
            <strong>{localDesktopAuthReadiness.status}</strong>
            <small>{localDesktopAuthBoundaries.status}</small>
            <small>{localDesktopAuthNextAction.reason}</small>
          </article>
          <article>
            <span>Private Desktop Packaging Preparation</span>
            <strong>{desktopPackagingPreparation.summary}</strong>
            <small>Local PIN / Passphrase Auth is preserved.</small>
            <small>{desktopPackagingPreparation.nextAction.reason}</small>
          </article>
          <article>
            <span>Private Desktop Local Build Dry Run</span>
            <strong>{desktopLocalBuildDryRun.summary}</strong>
            <small>{desktopLocalBuildDryRun.nextAction.reason}</small>
          </article>
          <article>
            <span>Private Desktop Distribution Gate</span>
            <strong>{desktopDistributionGate.summary}</strong>
            <small>{desktopDistributionGate.nextAction.reason}</small>
          </article>
          <article>
            <span>Shell security</span>
            <strong>No secrets in bundle</strong>
            <small>No secrets are stored in the desktop bundle. External accounts require Ahmad approval.</small>
          </article>
          <article>
            <span>Mobile later</span>
            <strong>Lightweight private access</strong>
            <small>Android and iPhone clients remain future private access gates.</small>
          </article>
        </div>
      </section>

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-wake-state-summary"
        aria-label="Al-Kawn Wake State"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Al-Kawn Wake State</span>
            <h2>{wakeState.title}</h2>
            <p>الكون يستيقظ من /desktop/kawn.</p>
            <p>الكون يتكلم مع أحمد فقط.</p>
            <p>Daily Work Loop enhancement</p>
            <p>الكون ينظم يومه الداخلي.</p>
            <p>Daily Work Loop prepares one next action.</p>
            <p>Legal and Money remain Ahmad gates.</p>
            <p>One next action selected.</p>
            <p>{wakeState.productTruthStatus}</p>
            <p>{wakeState.kernelStatus}</p>
          </div>
          <aside>
            <strong>{wakeState.state}</strong>
            <small>{spokenInterface.title}</small>
            <small>{dailyWorkLoop.title}</small>
            <small>Selected internal work: {dailyWorkLoop.selectedWorkItem.title}</small>
            <small>Blockers visible: {dailyWorkLoop.blockedItems.length}</small>
            <small>One next action: {dailyWorkLoop.nextAction.next}</small>
            <Link href="/desktop/kawn">Open Al-Kawn wake client</Link>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Wake message</span>
            <strong>{spokenInterface.wakeMessage.text}</strong>
            <small>الكون يتكلم مع أحمد بلغة بشرية واضحة.</small>
          </article>
          <article>
            <span>Daily loop</span>
            <strong>{dailyWorkLoop.oneNextAction}</strong>
            <small>{dailyWorkLoop.rule}</small>
          </article>
          <article>
            <span>Local access</span>
            <strong>{wakeState.localAccessStatus}</strong>
            <small>Desktop remains Ahmad-only.</small>
          </article>
          <article>
            <span>Daily report</span>
            <strong>Daily WAKE REPORT prepared.</strong>
            <small>{wakeState.dailyWakeReportPath}</small>
          </article>
        </div>
      </section>

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-living-autonomous-intelligence-summary"
        aria-label="Living Autonomous Intelligence"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Living Autonomous Intelligence</span>
            <h2>Al-Kawn Living Autonomous Intelligence</h2>
            <p>الكون يعمل بذكاء حي داخل أجهزة أحمد.</p>
            <p>الكون لا ينتظر فقط؛ الكون يراقب ويفهم ويختار وينفذ داخليًا.</p>
            <p>الذكاء الحي داخل الكون يعمل عبر Trigger آمن، وليس loop فوضوي.</p>
            <p>كل دورة تختار عملًا داخليًا واحدًا.</p>
            <p>Product Truth يحكم كل قرار ذكي.</p>
            <p>الكون يشرح ماذا فعل ولماذا فعل.</p>
            <p>الكون يراقب ويختار عملًا داخليًا آمنًا.</p>
            <p>المال الحقيقي بقرار أحمد فقط.</p>
          </div>
          <aside>
            <strong>{livingAutonomousIntelligence.state}</strong>
            <small>Selected action: {livingAutonomousIntelligence.selectedAction.title}</small>
            <small>Verdict: {livingAutonomousIntelligence.selectedAction.verdict}</small>
            <small>Report: {livingAutonomousIntelligence.report.path}</small>
            <Link href="/desktop/kawn">Open living intelligence in desktop</Link>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Awareness</span>
            <strong>الكون يعرف حالته وطبقاته وقدراته وحدوده.</strong>
            <small>Awareness items: {livingAutonomousIntelligence.awareness.length}</small>
          </article>
          <article>
            <span>Context reader</span>
            <strong>الكون يقرأ سياقه من مصادره الداخلية.</strong>
            <small>لا توجد قراءة خارجية بدون موافقة أحمد.</small>
          </article>
          <article>
            <span>Blocked gates</span>
            <strong>{livingAutonomousIntelligence.boundaries.length} gates visible</strong>
            <small>أحمد وحده يتحكم بالمال الحقيقي.</small>
            <small>الخروج للعالم يمر عبر بوابات أحمد.</small>
          </article>
          <article>
            <span>Next action</span>
            <strong>{livingAutonomousIntelligence.nextAction}</strong>
            <small>Intelligence cycle stops after report.</small>
          </article>
        </div>
      </section>

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-total-existence-summary"
        aria-label="Al-Kawn Total Existence Summary"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Al-Kawn A-Z Total Existence Completion</span>
            <h2>Total Existence</h2>
            <p>الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص.</p>
            <p>الكون هو كون إلكتروني كامل خاص داخل لابتوب أحمد.</p>
            <p>الكون ليس Dashboard عادي.</p>
            <p>الكون لا يدّعي التحكم بالكون الفيزيائي.</p>
            <p>Product Truth هو قانون الحقيقة الأعلى.</p>
            <p>Universe Operating Kernel هو القاضي التنفيذي.</p>
            <p>داخل الكون: التنفيذ مباشر.</p>
            <p>عند القانون: يتوقف لأحمد.</p>
            <p>عند المال: يتوقف لأحمد.</p>
            <p>كل شيء داخل الكون يجب أن يعرف لماذا يوجد.</p>
            <p>كل شيء داخل الكون يجب أن ينتمي إلى طبقة واضحة.</p>
            <p>كل شيء حقيقي له مصدر، وكل محاكاة موسومة.</p>
            <p>كل شيء داخل الكون يمكن تفسيره من ∞ إلى 0.</p>
            <p>الكون بفخامة سويسرية تليق باسمه.</p>
            <p>Swiss-inspired precision, not official Swiss endorsement.</p>
            <p>Product Truth remains visible above visual beauty.</p>
          </div>
          <aside>
            <strong>{totalExistence.status}</strong>
            <small>Total entities: {totalExistence.entityRegistry.length}</small>
            <small>Owner layers: {totalExistence.layerTree.length}</small>
            <small>Capability Matrix: {capabilities.length} capabilities</small>
            <small>Executable Glossary: {glossary.total} terms</small>
            <small>Rights & Ownership entries: {rights.entries.length}</small>
            <small>Living entities: {livingOntology.entities.length}</small>
            <Link href="/desktop/kawn">Open total existence in desktop</Link>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Swiss Luxury Living Style</span>
            <strong>الكون حي داخل لابتوب أحمد.</strong>
            <small>كل تفصيل داخل الكون له معنى.</small>
            <small>كل نبض يعكس حالة وليس زينة.</small>
            <small>The pulse reflects state, not decoration.</small>
          </article>
          <article>
            <span>Rights & Ownership</span>
            <strong>Every entity inside الكون must have ownership and source evidence.</strong>
            <small>Unknown-source items are blocked from public use.</small>
            <small>No global ownership claim is allowed.</small>
            <small>Trademark/legal review is required before public brand adoption.</small>
          </article>
          <article>
            <span>Living Ontology</span>
            <strong>الكون هو كيان إلكتروني حي داخل لابتوب أحمد.</strong>
            <small>كل طبقة داخل الكون لها وجود ومعنى وحالة وقدرة.</small>
            <small>{livingOntology.nextAction}</small>
          </article>
          <article>
            <span>Automatic Engine</span>
            <strong>{automaticEngine.status}</strong>
            <small>الكون يعمل تلقائيًا داخل نطاقه الخاص.</small>
            <small>No uncontrolled infinite loop.</small>
            <small>Safe trigger required for every cycle.</small>
            <small>One automatic work item per cycle.</small>
          </article>
        </div>
      </section>

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-infinity-preparation-summary"
        aria-label="Infinity Mode Preparation"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Infinity Mode Preparation</span>
            <h2>Infinity Mode preparation</h2>
            <p>Infinity Mode is private internal continuous readiness.</p>
            <p>Infinity Mode is not fully active yet.</p>
            <p>Daily Work Loop feeds Infinity preparation.</p>
            <p>Product Truth controls every cycle.</p>
            <p>Legal and Money gates stop execution for Ahmad.</p>
            <p>No uncontrolled infinite loop.</p>
            <p>No public, money, broker, legal, or external automation.</p>
          </div>
          <aside>
            <strong>{infinityPreparation.state}</strong>
            <small>{infinityPreparation.summary}</small>
            <small>{infinityPreparation.kernelStatus}</small>
            <small>Blocked actions: {infinityPreparation.blockedActions.length}</small>
            <small>Safe internal automation: {infinityPreparation.safeAutomation.length}</small>
            <Link href="/desktop/kawn">Open Infinity preparation in desktop</Link>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Readiness</span>
            <strong>{infinityPreparation.readiness[0]?.status}</strong>
            <small>{infinityPreparation.readiness[1]?.status}</small>
          </article>
          <article>
            <span>Cycle control</span>
            <strong>Infinity cycle waits for safe trigger.</strong>
            <small>Safe internal work only.</small>
          </article>
          <article>
            <span>Daily loop connection</span>
            <strong>{infinityPreparation.dailyLoopConnection[0]}</strong>
            <small>{infinityPreparation.dailyLoopConnection[1]}</small>
          </article>
          <article>
            <span>Next safe action</span>
            <strong>{infinityPreparation.nextAction.next}</strong>
            <small>{infinityPreparation.nextAction.reason}</small>
          </article>
        </div>
      </section>

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-internal-operating-sequence-summary"
        aria-label="Final Al-Kawn Internal Operating Sequence"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Internal Operating Sequence</span>
            <h2>Infinity Mode controlled activation</h2>
            <p>Infinity Mode is active only for private internal cycles.</p>
            <p>No uncontrolled infinite loop.</p>
            <p>No background daemon.</p>
            <p>Safe internal cycles only.</p>
            <p>Operator Mode preparation</p>
            <p>Operator Mode prepares الكون to work for Ahmad internally.</p>
            <p>Infinity feeds Operator preparation.</p>
            <p>Product Truth overrides operator actions.</p>
            <p>Operator Mode controlled activation</p>
            <p>الكون يعمل عن أحمد داخليًا.</p>
            <p>Operator Mode executes safe internal work only.</p>
            <p>Local Day One Boot Gate</p>
            <p>Local Day One is ready but not started.</p>
            <p>Ahmad must start Local Day One.</p>
            <p>Infinity and Operator are ready for private internal operation.</p>
            <p>Legal and Money gates remain Ahmad gates.</p>
            <p>Product Truth is enforced.</p>
          </div>
          <aside>
            <strong>{localDayOne.nextAction.next}</strong>
            <small>Infinity: {infinityActivation.status}</small>
            <small>Operator preparation: {operatorPreparation.status}</small>
            <small>Operator controlled: {operatorActivation.status}</small>
            <small>Local Day One: {localDayOne.status}</small>
            <Link href="/desktop/kawn">Open private desktop operating sequence</Link>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Infinity status</span>
            <strong>{infinityActivation.summary}</strong>
            <small>{infinityActivation.cycleState.stopRule}</small>
          </article>
          <article>
            <span>Operator status</span>
            <strong>{operatorActivation.summary}</strong>
            <small>{operatorActivation.humanMessage}</small>
          </article>
          <article>
            <span>Local Day One readiness</span>
            <strong>{localDayOne.summary}</strong>
            <small>{localDayOne.bootGate.finalDecision}</small>
          </article>
          <article>
            <span>One next action</span>
            <strong>{localDayOne.nextAction.next}</strong>
            <small>{localDayOne.nextAction.reason}</small>
          </article>
        </div>
      </section>

      <section
        className={styles.kernelPanel}
        data-testid="al-kawn-control-surfaces-summary"
        aria-label="Al-Kawn Control Surfaces"
      >
        <div className={styles.kernelHeader}>
          <div>
            <span>Al-Kawn Control Surfaces</span>
            <h2>Control surfaces prepare Infinity and Operator safely</h2>
            <p>Desktop is the main private command client for الكون</p>
            <p>Each layer has a control surface before future automation can be prepared.</p>
            <p>Product Truth enforced</p>
          </div>
          <aside>
            <strong>{controlSurfaceSummary.total} control surfaces</strong>
            <small>{controlSurfaceSummary.rule}</small>
            <small>{controlSurfaceSummary.nextSafeAction}</small>
            <Link href="/desktop/kawn">Open desktop control client</Link>
          </aside>
        </div>
        <div className={styles.kernelGrid}>
          <article>
            <span>Active</span>
            <strong>{controlSurfaceSummary.active}</strong>
            <small>Direct private internal control surfaces.</small>
          </article>
          <article>
            <span>Protected</span>
            <strong>{controlSurfaceSummary.protected}</strong>
            <small>Truth, root, protection, and Swiss boundary surfaces.</small>
          </article>
          <article>
            <span>Future</span>
            <strong>{controlSurfaceSummary.future}</strong>
            <small>Future automation remains gated.</small>
          </article>
          <article>
            <span>Blocked</span>
            <strong>{controlSurfaceSummary.blocked}</strong>
            <small>Unsafe actions remain blocked by Product Truth.</small>
          </article>
          <article>
            <span>Active with notes</span>
            <strong>{controlSurfaceSummary.activeWithNotes}</strong>
            <small>Available surfaces that still carry pending gates.</small>
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
