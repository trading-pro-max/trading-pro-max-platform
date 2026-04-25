"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  ACCOUNT_TYPE_IDENTITY_STATES,
  getDefaultAccountTypeIdentity,
} from "../../auth/account-type";
import { getAssistantTierSnapshot } from "../../../lib/assistant/tiers";
import { getPlanEntitlementSnapshot } from "../../../lib/plans/entitlements";
import { getLocaleEntry } from "../../../lib/i18n/config";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import type { PlanVisualIdentity, PlanVisualKey } from "../../../lib/plans/visual-identity";
import { getPlanVisualIdentities } from "../../../lib/plans/visual-identity";
import type { JournalCoachSnapshot } from "../../../lib/server/journal-coach/types";
import { AcademyPreview } from "../../academy/components";
import AuthSessionPanel from "../../auth/components/AuthSessionPanel";
import { CommunityReadinessPanel, VIPRoomsPreview } from "../../community/components";
import { SessionCoachPanel } from "../../journal-coach/components";
import { MediaOfficeReadinessPanel } from "../../media-office/components";
import { PlanetMapPreview } from "../../planet-map/components";
import {
  CitizenAccessMap,
  PlanExperienceCard,
  PlanInterfaceSummary,
  PlanPlanetLayerCard,
} from "../../plans/components";
import { SafeNextStepList, StateExplanationCard } from "../../state-explanations/components";
import type { StateExplanationView } from "../../state-explanations/types";
import {
  EXECUTION_DURATIONS,
  PLATFORM_LIMITS,
  TIMEFRAMES,
} from "../../../lib/constants/platform";
import { usePlatformState } from "../hooks/use-platform-state";
import type {
  DiagnosticsHealthSnapshot,
  DiagnosticsProbeStatus,
  DiagnosticsRoutePayload,
} from "../types/platform-state";
import type { WorkstationStatusTone } from "./trading-workstation-view-model";
import { createTradingWorkstationViewModel } from "./trading-workstation-view-model";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  CHART_TYPES,
  DRAWING_TOOLS,
  INDICATOR_TOOLS,
} from "./PlatformShellV2";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ProductStateNotice } from "./UiStates";

function toneFromStatus(tone: WorkstationStatusTone) {
  return `tpmv2-status-tag ${tone}`;
}

function toneFromProbeStatus(status: DiagnosticsProbeStatus): WorkstationStatusTone {
  if (status === "ready") return "approved";
  if (status === "fallback" || status === "auth_required") return "pending";
  if (status === "blocked" || status === "unconfigured") return "restricted";
  return "blocked";
}

function publicEngineLabel(key: string, fallback: string): string {
  const labels: Record<string, string> = {
    founder_command_reporting: "Protected Reporting Engine",
    companion_context: "Assistant Context Engine",
    guardian_legal_rules: "Safety + Review Rules Engine",
  };

  return labels[key] ?? publicDisplayText(fallback);
}

function publicDisplayText(value: string): string {
  return value
    .replace(/\bEnterprise\b/g, "Institutional")
    .replace(/Founder Command/gi, "Restricted controls")
    .replace(/Founder King/gi, "Restricted controls")
    .replace(/Owner command/gi, "Restricted controls")
    .replace(/Owner-only/gi, "Restricted")
    .replace(/owner-only/gi, "restricted")
    .replace(/Private command/gi, "Restricted controls")
    .replace(/private command/gi, "restricted controls")
    .replace(/Planet OS/gi, "product readiness system")
    .replace(/Planet governance/gi, "product readiness")
    .replace(/\bgovernance\b/gi, "readiness")
    .replace(/\bPlanet\b/g, "Product")
    .replace(/\bplanet\b/g, "product")
    .replace(/\bministries\b/gi, "readiness reports")
    .replace(/\bcouncils\b/gi, "review gates")
    .replace(/Presidency/gi, "review coordination")
    .replace(/\bstates\b/gi, "statuses");
}

function utilitySectionKey(eyebrow: string): string {
  return eyebrow
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function UtilityStatus({
  text,
  tone,
}: {
  text: string;
  tone: WorkstationStatusTone;
}) {
  return <span className={toneFromStatus(tone)}>{text}</span>;
}

function UtilitySection({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section
      className="tpm-foundation-card tpm-utility-card"
      data-utility-section={utilitySectionKey(eyebrow)}
    >
      <header className="tpm-foundation-head tpm-utility-head">
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function UtilityGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
    tone?: WorkstationStatusTone;
    note?: string;
  }>;
}) {
  return (
    <div className="tpm-foundation-grid tpm-utility-grid">
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="tpm-foundation-item">
          <span>{publicDisplayText(item.label)}</span>
          <strong className={item.tone ? `tpmv2-detail-value ${item.tone}` : undefined}>
            {publicDisplayText(item.value)}
          </strong>
          {item.note ? <small>{publicDisplayText(item.note)}</small> : null}
        </div>
      ))}
    </div>
  );
}

function planAvailabilityLabel(
  identity: PlanVisualIdentity,
  currentPlanKey: PlanVisualKey
) {
  if (identity.key === "guest") return "Public orientation";
  if (identity.key === currentPlanKey) return "Active evaluation";
  if (identity.availability === "active") return "Available";
  if (identity.availability === "coming_later") return "Coming later";
  return "Locked";
}

function PlanIdentityGrid({
  currentPlanKey,
  identities,
}: {
  currentPlanKey: PlanVisualKey;
  identities: PlanVisualIdentity[];
}) {
  return (
    <div className="tpm-plan-grid" aria-label="Plan visual identity comparison">
      {identities.map((identity) => {
        const active = identity.key === currentPlanKey;
        const state = active ? "active" : identity.availability;

        return (
          <article
            key={identity.key}
            className={identity.comparisonClassName}
            data-plan={identity.key}
            data-state={state}
          >
            <div className="tpm-plan-card-head">
              <span className={identity.badgeClassName}>{identity.shortLabel}</span>
              <span className={`tpm-plan-state tpm-plan-state-${state}`}>
                {planAvailabilityLabel(identity, currentPlanKey)}
              </span>
            </div>
            <strong>{identity.label}</strong>
            <p>{identity.tone}</p>
            <small>{identity.surfaceLanguage}</small>
            <div className="tpm-plan-card-footer">
              <span className={identity.assistantClassName}>
                {identity.assistantIdentity}
              </span>
              <em>{active ? "Paper-safe active" : identity.lockedState}</em>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "tpm-utility-toggle active" : "tpm-utility-toggle"}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function localeCoverageText(locale: string) {
  const localeEntry = getLocaleEntry(locale);

  if (localeEntry.coverage === "complete") {
    return localeEntry.coverageLabel;
  }

  return `${localeEntry.coverageLabel}. Missing strings use ${localeEntry.dictionaryLocale.toUpperCase()} fallback.`;
}

function useUtilityPlatformViewModel(locale: string, dict: Dictionary) {
  const platformState = usePlatformState(locale, dict.decision.reasons);
  const viewModel = createTradingWorkstationViewModel({
    locale,
    dict,
    accountStatus: platformState.accountStatus,
    accountPolicy: platformState.accountPolicy,
    executionFoundation: platformState.executionFoundation,
    riskFoundation: platformState.riskFoundation,
    dataStateFoundation: platformState.dataStateFoundation,
    auditTraceFoundation: platformState.auditTraceFoundation,
    securityFoundation: platformState.securityFoundation,
    intelligence: platformState.intelligence,
    decision: platformState.decision,
    riskNoteCode: platformState.riskNoteCode,
    sessionPnL: platformState.sessionPnL,
    sessionLocked: platformState.sessionLocked,
    openTradesCount: platformState.openTrades.length,
  });

  return { platformState, viewModel };
}

type DiagnosticsHealthLoadState =
  | { health: null; status: "loading" }
  | { health: DiagnosticsHealthSnapshot; status: "ready" }
  | { health: null; status: "error" };

type PlanetOsStatusPayload = {
  ok: boolean;
  engineSummary?: {
    total: number;
    active: number;
    foundationReady: number;
    blockedCapabilities: string[];
    engines: Array<{
      key: string;
      label: string;
      readiness: string;
      riskLevel: string;
      automationLevel: string;
      purpose: string;
      truth: string;
    }>;
  };
  hierarchySummary?: {
    hierarchyLevels: number;
    continents: number;
    states: number;
    governors: number;
    ministries: number;
    authorities: number;
    cities: number;
    professions: number;
    citizenClasses: number;
    publicFounderRouteExposed: boolean;
    fakeMetricsIncluded: boolean;
    launchActivated: boolean;
    billingActivated: boolean;
    liveExecutionActivated: boolean;
    chain: string[];
    coordinationCenter: string;
    resourceCategories: string[];
    truth: {
      fakeUsers: false;
      fakeRevenue: false;
      fakeMetrics: false;
      productionActivation: false;
    };
  };
  coordinationSummary?: {
    workflows: number;
    messageTypes: number;
    messageStates: string[];
    decisionOutcomes: string[];
    pendingReviewCategories: string[];
    criticalBlockedCategories: string[];
    crossMinistryMustUsePresidency: boolean;
    realWorkflowExecutionActive: boolean;
    socialPublishingActive: boolean;
    productionActivationActive: boolean;
    secretsExposed: boolean;
    fakeUsersIncluded: boolean;
    fakeRevenueIncluded: boolean;
    fakeMetricsIncluded: boolean;
  };
  resourceSummary?: {
    total: number;
    categories: number;
    privateDataSaleAllowed: boolean;
    fakeMetricsAllowed: boolean;
  };
  integrationMeshSummary?: {
    mode: "tpm_integration_mesh";
    systemsConnected: number;
    publicLanguageAligned: boolean;
    productTruthSource: string;
    planSource: string;
    assistantSource: string;
    diagnosticsRole: string;
    privateReportingRole: string;
    publicPlanNames: string[];
    assistantName: string;
    requiredBlockedStateCoverage: boolean;
    privateReportingReadinessOnly: boolean;
    truth: {
      liveExecution: "blocked";
      realMoneyRouting: "blocked";
      brokerFeedBillingLaunch: "not_faked";
      socialPublishing: "inactive";
      productionSecrets: "not_touched";
      authSecurity: "preserved";
      fakePlanActivation: "blocked";
      internalGovernanceLeakedToNormalUsers: false;
    };
  };
  snapshot: {
    status: "operating" | "ready" | "planned" | "blocked" | "degraded";
    continents: Array<{ id: string; name: string; readiness: string }>;
    ministries: Array<{ ministryId: string; ministryName: string; status: string }>;
    founderCommand: {
      privateOwnerOnly: true;
      publicRouteExposed: false;
      desktopAppShipped: false;
      mobileAppShipped: false;
      reportDestination: "Founder Command Room";
    };
    safetyBoundaries: {
      liveExecution: "blocked";
      realMoneyRouting: "blocked";
      brokerFeedActivation: "blocked";
      billingActivation: "blocked";
      publicLaunchClaim: "blocked";
    };
    founderBriefing: {
      topRisks: string[];
      approvalsNeeded: string[];
      nextSafeActions: string[];
    };
    truth: {
      liveExecution: "blocked";
      realMoneyRouting: "blocked";
      billing: "inactive";
      publicLaunch: "not_claimed";
    };
  };
};

type PlanetOsLoadState =
  | { snapshot: null; status: "loading" }
  | {
      coordinationSummary: PlanetOsStatusPayload["coordinationSummary"];
      engineSummary: PlanetOsStatusPayload["engineSummary"];
      hierarchySummary: PlanetOsStatusPayload["hierarchySummary"];
      integrationMeshSummary: PlanetOsStatusPayload["integrationMeshSummary"];
      resourceSummary: PlanetOsStatusPayload["resourceSummary"];
      snapshot: PlanetOsStatusPayload["snapshot"];
      status: "ready";
    }
  | { snapshot: null; status: "error" };

type StateExplanationLoadState =
  | { explanations: null; status: "loading" }
  | { explanations: StateExplanationView[]; status: "ready" }
  | { explanations: null; status: "error" };

type JournalCoachLoadState =
  | { snapshot: null; status: "loading" }
  | { snapshot: JournalCoachSnapshot; status: "ready" }
  | { snapshot: null; status: "error" };

type ProductMemorySummaryPayload = {
  snapshot?: {
    storage: {
      persistence: string;
      productionStorageActive: boolean;
      externalSyncActive: boolean;
      persistenceGap: string;
    };
    policy: {
      productionStorageActive: false;
      externalSyncActive: false;
      surveillanceAllowed: false;
      secretPersistenceAllowed: false;
      rawSensitiveUserDataAllowed: false;
      fakeMetricsAllowed: false;
    };
    domainSummary: Array<{
      domain: string;
      total: number;
      safeToPersist: number;
      founderOnly: number;
      redactionRequired: number;
      open: number;
    }>;
    founderSummary: {
      openProductGaps: unknown[];
      recentValidationSummaries: unknown[];
      buildDecisions: unknown[];
      localDayReports: unknown[];
      journalCoachReadiness: string;
      memorySafetyStatus: string;
      forbiddenStorageReminders: string[];
    };
    truth: {
      secretsStored: false;
      privateSensitiveDataStored: false;
      rawUserTrackingEnabled: false;
      fakeUsersStored: false;
      fakeRevenueStored: false;
      fakeMetricsStored: false;
      productionStorageActive: false;
      automaticExternalSync: false;
      launchAutomation: false;
    };
  };
};

type ProductMemoryLoadState =
  | { snapshot: null; status: "loading" }
  | { snapshot: NonNullable<ProductMemorySummaryPayload["snapshot"]>; status: "ready" }
  | { snapshot: null; status: "error" };

function useDiagnosticsHealth() {
  const [state, setState] = useState<DiagnosticsHealthLoadState>({
    health: null,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    async function loadDiagnosticsHealth() {
      try {
        const response = await fetch("/api/diagnostics/probes", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Diagnostics probe failed with ${response.status}.`);
        }

        const payload = (await response.json()) as DiagnosticsRoutePayload;

        if (!active) return;
        setState({ health: payload.health, status: "ready" });
      } catch {
        if (!active) return;
        setState({ health: null, status: "error" });
      }
    }

    void loadDiagnosticsHealth();
    const interval = window.setInterval(() => {
      void loadDiagnosticsHealth();
    }, 30_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return state;
}

function usePlanetOsStatus() {
  const [state, setState] = useState<PlanetOsLoadState>({
    snapshot: null,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    async function loadPlanetOsStatus() {
      try {
        const response = await fetch("/api/planet/status", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Readiness status failed with ${response.status}.`);
        }

        const payload = (await response.json()) as PlanetOsStatusPayload;

        if (!active) return;
        setState({
          coordinationSummary: payload.coordinationSummary,
          engineSummary: payload.engineSummary,
          hierarchySummary: payload.hierarchySummary,
          integrationMeshSummary: payload.integrationMeshSummary,
          resourceSummary: payload.resourceSummary,
          snapshot: payload.snapshot,
          status: "ready",
        });
      } catch {
        if (!active) return;
        setState({ snapshot: null, status: "error" });
      }
    }

    void loadPlanetOsStatus();
    const interval = window.setInterval(() => {
      void loadPlanetOsStatus();
    }, 60_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return state;
}

function useStateExplanations() {
  const [state, setState] = useState<StateExplanationLoadState>({
    explanations: null,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    async function loadStateExplanations() {
      try {
        const response = await fetch("/api/planet/state-explanations", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`State explanations failed with ${response.status}.`);
        }

        const payload = (await response.json()) as {
          snapshot?: { explanations?: StateExplanationView[] };
        };

        if (!active) return;
        setState({
          explanations: payload.snapshot?.explanations ?? [],
          status: "ready",
        });
      } catch {
        if (!active) return;
        setState({ explanations: null, status: "error" });
      }
    }

    void loadStateExplanations();

    return () => {
      active = false;
    };
  }, []);

  return state;
}

function useJournalCoachReadiness() {
  const [state, setState] = useState<JournalCoachLoadState>({
    snapshot: null,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    async function loadJournalCoachReadiness() {
      try {
        const response = await fetch("/api/journal-coach/readiness", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Journal coach readiness failed with ${response.status}.`);
        }

        const payload = (await response.json()) as {
          snapshot?: JournalCoachSnapshot;
        };

        if (!active || !payload.snapshot) return;
        setState({ snapshot: payload.snapshot, status: "ready" });
      } catch {
        if (!active) return;
        setState({ snapshot: null, status: "error" });
      }
    }

    void loadJournalCoachReadiness();

    return () => {
      active = false;
    };
  }, []);

  return state;
}

function useProductMemorySummary() {
  const [state, setState] = useState<ProductMemoryLoadState>({
    snapshot: null,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    async function loadProductMemorySummary() {
      try {
        const response = await fetch("/api/product-memory/summary", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Product memory summary failed with ${response.status}.`);
        }

        const payload = (await response.json()) as ProductMemorySummaryPayload;

        if (!active || !payload.snapshot) return;
        setState({ snapshot: payload.snapshot, status: "ready" });
      } catch {
        if (!active) return;
        setState({ snapshot: null, status: "error" });
      }
    }

    void loadProductMemorySummary();

    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function PlatformDiagnosticsSurface({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const { platformState, viewModel } = useUtilityPlatformViewModel(locale, dict);
  const diagnosticsLoadState = useDiagnosticsHealth();
  const planetOsLoadState = usePlanetOsStatus();
  const stateExplanationLoadState = useStateExplanations();
  const journalCoachLoadState = useJournalCoachReadiness();
  const productMemoryLoadState = useProductMemorySummary();
  const diagnosticsHealth = diagnosticsLoadState.health;
  const planetOsSnapshot = planetOsLoadState.snapshot;
  const planetOsEngineSummary =
    planetOsLoadState.status === "ready" ? planetOsLoadState.engineSummary : undefined;
  const planetHierarchySummary =
    planetOsLoadState.status === "ready" ? planetOsLoadState.hierarchySummary : undefined;
  const planetCoordinationSummary =
    planetOsLoadState.status === "ready" ? planetOsLoadState.coordinationSummary : undefined;
  const planetResourceSummary =
    planetOsLoadState.status === "ready" ? planetOsLoadState.resourceSummary : undefined;
  const integrationMeshSummary =
    planetOsLoadState.status === "ready" ? planetOsLoadState.integrationMeshSummary : undefined;
  const planEntitlementSnapshot = getPlanEntitlementSnapshot("demo_free");
  const currentPlanetLayer = planEntitlementSnapshot.citizenAccess.currentLayer;
  const localePrefix = locale ? `/${locale}` : "";
  const localeEntry = getLocaleEntry(locale);

  const systemItems = [
    {
      label: dict.settings.languageCoverage,
      value:
        localeEntry.coverage === "complete"
          ? localeEntry.name
          : `${localeEntry.name} fallback`,
      tone: localeEntry.coverage === "complete" ? ("approved" as const) : ("pending" as const),
      note: localeCoverageText(locale),
    },
    {
      label: dict.diagnostics.runtime,
      value: diagnosticsHealth?.readiness.summary ?? platformState.dataStateFoundation.hydrationState,
      tone: diagnosticsHealth
        ? toneFromProbeStatus(diagnosticsHealth.readiness.status)
        : platformState.dataStateFoundation.hydrationState === "hydrated"
        ? ("approved" as const)
        : ("pending" as const),
      note:
        diagnosticsHealth?.readiness.detail ??
        platformState.dataStateFoundation.lastUpdatedAt,
    },
    {
      label: dict.diagnostics.marketLayer,
      value: platformState.dataStateFoundation.marketFeedState,
      tone:
        platformState.dataStateFoundation.marketFeedState === "fallback_ready" ||
        platformState.dataStateFoundation.marketFeedState === "booting"
          ? ("pending" as const)
          : platformState.dataStateFoundation.marketFeedState === "external_ready"
          ? ("approved" as const)
          : ("restricted" as const),
      note:
        platformState.selectedAsset.sourceLabel ?? platformState.selectedAsset.symbol,
    },
    {
      label: dict.diagnostics.executionLayer,
      value: viewModel.executionRouteValue,
      tone: platformState.canExecute ? ("approved" as const) : ("blocked" as const),
      note: viewModel.executionIntentValue,
    },
    {
      label: dict.diagnostics.riskLayer,
      value: viewModel.sessionStateLabel,
      tone: platformState.sessionLocked ? ("blocked" as const) : ("approved" as const),
      note: viewModel.sessionPnLText,
    },
  ];

  const probeItems =
    diagnosticsHealth?.probes.slice(0, 6).map((probe) => ({
      label: probe.label,
      value: probe.summary,
      tone: toneFromProbeStatus(probe.status),
      note: probe.detail,
    })) ?? [
      {
        label: "Probe layer",
        value: "Loading",
        tone: "pending" as const,
        note: "Waiting for backend diagnostics probes.",
      },
    ];

  const planetOsItems = planetOsSnapshot
    ? [
        {
          label: "Product readiness",
          value: planetOsSnapshot.status,
          tone:
            planetOsSnapshot.status === "operating" || planetOsSnapshot.status === "ready"
              ? ("approved" as const)
              : planetOsSnapshot.status === "degraded"
              ? ("pending" as const)
              : ("restricted" as const),
          note: "Readiness model only; not a launch or integration state.",
        },
        {
          label: "Product areas",
          value: `${
            planetHierarchySummary?.continents ?? planetOsSnapshot.continents.length
          } reporting`,
          tone: "approved" as const,
          note: "Product areas report readiness without exposing restricted controls.",
        },
        {
          label: "Readiness reports",
          value: `${
            planetHierarchySummary?.ministries ?? planetOsSnapshot.ministries.length
          } deterministic reports`,
          tone: "approved" as const,
          note: "Reports stay restricted and readiness-only.",
        },
        {
          label: "Product model",
          value: planetHierarchySummary
            ? `${planetHierarchySummary.hierarchyLevels} layers / ${planetHierarchySummary.states} status areas`
            : "core model ready",
          tone: "approved" as const,
          note: "Structured behind the product; user screens show professional product layers only.",
        },
        {
          label: "Coordination engine",
          value: planetCoordinationSummary
            ? `${planetCoordinationSummary.workflows} workflows`
            : "Coordination required",
          tone: "pending" as const,
          note: "Cross-team requests route through review coordination; execution is readiness-only.",
        },
        {
          label: "Review ledger",
          value: planetCoordinationSummary
            ? `${planetCoordinationSummary.messageTypes} types / ${planetCoordinationSummary.messageStates.length} statuses`
            : "ledger planned",
          tone: "approved" as const,
          note: "Review records carry flags, product truth, safety boundary, and blocked reason.",
        },
        {
          label: "Review routing",
          value: planetCoordinationSummary
            ? `${planetCoordinationSummary.pendingReviewCategories.length} review lanes`
            : "review lanes ready",
          tone: "pending" as const,
          note: "Safety, legal, revenue, engineering, quality, and brand review are identified automatically.",
        },
        {
          label: "Policy gates",
          value: "3 review gates",
          tone: "approved" as const,
          note: "Policy, implementation, and critical-block review gates remain readiness-only.",
        },
        {
          label: "Blocked categories",
          value: planetCoordinationSummary
            ? `${planetCoordinationSummary.criticalBlockedCategories.length} critical`
            : "critical blocks ready",
          tone: "blocked" as const,
          note: "Live, real money, billing, broker/feed, social publishing, launch, fake VIP, and fake certification remain blocked.",
        },
        {
          label: "Resources",
          value: planetResourceSummary
            ? `${planetResourceSummary.total} protected resources`
            : "resource model ready",
          tone: "approved" as const,
          note: "No private data sale, fake users, fake revenue, or fake metrics.",
        },
        {
          label: "Restricted controls",
          value: "Restricted",
          tone: "restricted" as const,
          note: "No public restricted-control route, desktop app, or mobile app is shipped.",
        },
        {
          label: "Safety boundaries",
          value: "Blocked where critical",
          tone: "blocked" as const,
          note: `Live=${planetOsSnapshot.safetyBoundaries.liveExecution}; money=${planetOsSnapshot.safetyBoundaries.realMoneyRouting}; billing=${planetOsSnapshot.truth.billing}.`,
        },
        {
          label: "Core engines",
          value: planetOsEngineSummary
            ? `${planetOsEngineSummary.total} established`
            : "Truth contracts ready",
          tone: "approved" as const,
          note: planetOsEngineSummary
            ? `${planetOsEngineSummary.active} active; ${planetOsEngineSummary.foundationReady} foundation-ready; no external activation.`
            : "Blueprint, truth, reporting, entitlement, assistant, safety/review, visual, state, content, and build planning.",
        },
      ]
    : [];

  const planetEngineItems =
    planetOsEngineSummary?.engines.slice(0, 10).map((engine) => ({
      label: publicEngineLabel(engine.key, engine.label),
      value: engine.readiness.replace(/_/g, " "),
      tone:
        engine.readiness === "active"
          ? ("approved" as const)
          : engine.readiness === "foundation_ready"
          ? ("pending" as const)
          : ("restricted" as const),
      note: `${engine.automationLevel.replace(/_/g, " ")} / ${engine.riskLevel} risk. ${engine.truth}`,
    })) ?? [];

  const integrationMeshItems = integrationMeshSummary
    ? [
        {
          label: "Integration mesh",
          value: `${integrationMeshSummary.systemsConnected} systems`,
          tone: "approved" as const,
          note: "Product truth, plans, Assistant, blocked-state explanations, journal/coach, safety, content, reporting, diagnostics, and visual checks share one readiness chain.",
        },
        {
          label: "Public language",
          value: integrationMeshSummary.publicLanguageAligned ? "Aligned" : "Review needed",
          tone: integrationMeshSummary.publicLanguageAligned
            ? ("approved" as const)
            : ("pending" as const),
          note: `${integrationMeshSummary.publicPlanNames.join(" / ")} with ${integrationMeshSummary.assistantName}.`,
        },
        {
          label: "Blocked coverage",
          value: integrationMeshSummary.requiredBlockedStateCoverage ? "Covered" : "Partial",
          tone: integrationMeshSummary.requiredBlockedStateCoverage
            ? ("approved" as const)
            : ("pending" as const),
          note: "Live, real money, billing, VIP, Institutional, Islamic status, and restricted control conditions have explanations.",
        },
        {
          label: "Restricted reporting",
          value: integrationMeshSummary.privateReportingReadinessOnly ? "Restricted" : "Review",
          tone: integrationMeshSummary.privateReportingReadinessOnly
            ? ("restricted" as const)
            : ("pending" as const),
          note: "Readiness summaries remain separate from normal user plans and public navigation.",
        },
      ]
    : [];

  const planLayerItems = [
    {
      label: "Current plan",
      value: currentPlanetLayer.label,
      tone: "approved" as const,
      note: currentPlanetLayer.activeLayer,
    },
    {
      label: "Assistant layer",
      value: currentPlanetLayer.companionLevel,
      tone: "approved" as const,
      note: "Plan-aware, paper-safe, and non-executing.",
    },
    {
      label: "Pro / VIP truth",
      value: "Planned",
      tone: "pending" as const,
      note: "Pro and VIP layers remain planned or locked until real entitlement support exists.",
    },
    {
      label: "Restricted controls",
      value: "Restricted",
      tone: "blocked" as const,
      note: "Never exposed as a normal user plan or public route.",
    },
    {
      label: "Billing",
      value: planEntitlementSnapshot.truth.billing,
      tone: "pending" as const,
      note: "No checkout, paid access, or private treasury fee UI is user-visible.",
    },
  ];

  const companionReadinessItems = [
    {
      label: "Assistant tier",
      value: "Free active",
      tone: "approved" as const,
      note: "Pro, VIP, and Institutional assistants remain locked/planned until real entitlement exists.",
    },
    {
      label: "Assistant context",
      value: "Safe readiness only",
      tone: "pending" as const,
      note: "Route, theme, plan, account type, Why Blocked, Journal/Coach, diagnostics, and product truth are safe to explain without secrets.",
    },
    {
      label: "Blocked intents",
      value: "Covered",
      tone: "blocked" as const,
      note: "Execution, live, real money, broker/feed, billing, secrets, social publishing, advice, guarantees, and fake activation stay blocked.",
    },
    {
      label: "Execution authority",
      value: "None",
      tone: "blocked" as const,
      note: "The assistant cannot execute trades, activate live mode, configure broker/feed, or unlock billing.",
    },
  ];
  const productMemoryItems =
    productMemoryLoadState.status === "ready"
      ? [
          {
            label: "Memory mode",
            value: productMemoryLoadState.snapshot.storage.persistence.replace(/_/g, " "),
            tone: "pending" as const,
            note: "Deterministic local/internal readiness only; durable account-safe persistence is planned.",
          },
          {
            label: "Memory domains",
            value: `${productMemoryLoadState.snapshot.domainSummary.length} modeled`,
            tone: "approved" as const,
            note: "Founder acceptance, visual feedback, journal/coach, validation, build decisions, product gaps, and local day reports.",
          },
          {
            label: "Open product gaps",
            value: `${productMemoryLoadState.snapshot.founderSummary.openProductGaps.length}`,
            tone:
              productMemoryLoadState.snapshot.founderSummary.openProductGaps.length > 0
                ? ("pending" as const)
                : ("approved" as const),
            note: "Tracked as safe product notes, not user surveillance or metrics.",
          },
          {
            label: "Secret storage",
            value: productMemoryLoadState.snapshot.truth.secretsStored ? "Review" : "Blocked",
            tone: "blocked" as const,
            note: "Secrets, raw private sensitive data, social tokens, payment data, and broker credentials are forbidden.",
          },
          {
            label: "External sync",
            value: productMemoryLoadState.snapshot.truth.automaticExternalSync
              ? "Review"
              : "Inactive",
            tone: "restricted" as const,
            note: "No automatic external sync, production storage, hidden user tracking, or launch automation.",
          },
        ]
      : [
          {
            label: "Product memory",
            value: productMemoryLoadState.status === "error" ? "Unavailable" : "Loading",
            tone: productMemoryLoadState.status === "error" ? ("restricted" as const) : ("pending" as const),
            note: "Diagnostics is checking safe local/internal memory readiness.",
          },
        ];

  const intelligenceGovernanceItems = [
    {
      label: "Assistant context",
      value: "Bounded",
      tone: "pending" as const,
      note: "Combines product truth, plan state, skill profile, journal readiness, safety/review boundaries, and visual acceptance without secrets.",
    },
    {
      label: "Skill profile",
      value: "Beginner-safe default",
      tone: "approved" as const,
      note: "Guidance adapts explanation depth without overtrading pressure or profit promises.",
    },
    {
      label: "Assistant intents",
      value: "Daily-use safe",
      tone: "approved" as const,
      note: "Explain state, blocked reasons, plans, feedback, Journal/Coach prompts, settings, diagnostics, and learning help; no execution authority.",
    },
    {
      label: "Safety / review matrix",
      value: "Review and block ready",
      tone: "restricted" as const,
      note: "Risky claims, live claims, billing claims, Islamic certification claims, and VIP guarantees remain blocked or review-required.",
    },
    {
      label: "Automation boundary",
      value: "Assisted / review",
      tone: "pending" as const,
      note: "No product function can autonomously launch, publish, bill, activate broker/feed, or execute live trades.",
    },
    {
      label: "Roadmap planner",
      value: "Planner only",
      tone: "approved" as const,
      note: "Classifies next safe tasks and forbidden tasks; it is not an autonomous code executor.",
    },
  ];
  const economyMediaGrowthItems = [
    {
      label: "Plan economy",
      value: "Readiness only",
      tone: "pending" as const,
      note: "Free is active for paper-safe trust; Pro, VIP, and Institutional remain planned/future.",
    },
    {
      label: "Billing and fees",
      value: "Inactive / 0%",
      tone: "blocked" as const,
      note: "No checkout, subscriptions, performance fee, or paid entitlement activation is user-visible.",
    },
    {
      label: "Media office",
      value: "Draft review only",
      tone: "restricted" as const,
      note: "No social accounts, tokens, external publishing, followers, views, or ads are active.",
    },
    {
      label: "Community / VIP rooms",
      value: "Planned",
      tone: "pending" as const,
      note: "Rooms require moderation, entitlement support, safety review, legal review, and private approval review.",
    },
    {
      label: "Partnerships",
      value: "Inactive",
      tone: "restricted" as const,
      note: "Sponsored clock and brand partnerships require signed contracts and review before any public use.",
    },
    {
      label: "Final acceptance",
      value: "Review only",
      tone: "restricted" as const,
      note: "Not launch-ready; human visual acceptance, beta testing, legal review, and real environment gates remain.",
    },
  ];
  const stateExplanationHighlights =
    stateExplanationLoadState.status === "ready"
      ? stateExplanationLoadState.explanations.filter((explanation) =>
          [
            "live_disabled",
            "real_money_blocked",
            "billing_inactive",
            "vip_locked",
            "founder_command_private",
            "social_publishing_inactive",
            "assistant_intent_restricted",
            "performance_fee_hidden",
          ].includes(explanation.key)
        )
      : [];

  const routeItems =
    diagnosticsHealth?.routes.slice(0, 6).map((route) => ({
      label: `${route.method} ${route.path}`,
      value: route.status,
      tone: toneFromProbeStatus(route.status),
      note: route.detail,
    })) ?? [
      {
        label: "Routes",
        value: "Loading",
        tone: "pending" as const,
        note: "Waiting for route probe visibility.",
      },
    ];

  const connectorItems =
    diagnosticsHealth?.connectors.flatMap((connector) => [
      {
        label: connector.label,
        value: connector.summary,
        tone:
          connector.state === "unconfigured"
            ? ("restricted" as const)
            : ("blocked" as const),
        note: connector.detail,
      },
      {
        label: "Paper capability",
        value: "Local paper only",
        tone: "pending" as const,
        note: `Connection state: ${connector.connectionState}`,
      },
      {
        label: "Real-money capability",
        value: "Blocked",
        tone: "blocked" as const,
        note: `Activation gate: ${connector.activationGate}`,
      },
    ]) ?? [
      {
        label: "Broker connector",
        value: "Loading",
        tone: "pending" as const,
        note: "Waiting for connector safety state.",
      },
    ];

  const feedbackItems =
    diagnosticsHealth?.launchOperations
      ? [
          {
            label: "Feedback loop",
            value: diagnosticsHealth.launchOperations.feedbackLoop ?? "operational_guarded",
            tone:
              diagnosticsHealth.launchOperations.feedbackLoop === "triage_backlog_guarded"
                ? ("restricted" as const)
                : ("approved" as const),
            note: "Closed-beta feedback remains account-scoped and operator-reviewed.",
          },
          {
            label: "Pending triage",
            value: `${diagnosticsHealth.launchOperations.pendingTriage ?? 0}`,
            tone:
              (diagnosticsHealth.launchOperations.pendingTriage ?? 0) > 0
                ? ("pending" as const)
                : ("approved" as const),
            note: `High severity open: ${diagnosticsHealth.launchOperations.highSeverityOpen ?? 0}`,
          },
          {
            label: "Hardening follow-ups",
            value: `${diagnosticsHealth.launchOperations.hardeningFollowUps ?? 0}`,
            tone:
              (diagnosticsHealth.launchOperations.hardeningFollowUps ?? 0) > 0
                ? ("restricted" as const)
                : ("approved" as const),
            note: `Recovery linked: ${diagnosticsHealth.launchOperations.recoveryLinked ?? 0}`,
          },
          {
            label: "Rollback readiness",
            value: diagnosticsHealth.launchOperations.rollbackReadiness ?? "guarded",
            tone:
              diagnosticsHealth.launchOperations.rollbackReadiness === "recoverable_guarded"
                ? ("approved" as const)
                : ("restricted" as const),
            note: `Escalation: ${diagnosticsHealth.launchOperations.escalationState ?? "normal"}`,
          },
        ]
      : [];

  const readinessItems = [
    {
      label: viewModel.paperAccessLabel,
      value: viewModel.paperAccessValue,
      tone: viewModel.paperAccessTone,
      note: viewModel.ticketNextStepValue,
    },
    {
      label: viewModel.liveAccessLabel,
      value: viewModel.liveAccessValue,
      tone: "blocked" as const,
      note: "Paper-safe route enforced",
    },
    {
      label: viewModel.securityAlertLabel,
      value: viewModel.securityAlertValue,
      tone:
        platformState.securityFoundation.alertLevel === "normal"
          ? ("approved" as const)
          : ("restricted" as const),
      note: viewModel.securityReviewedAtLabel,
    },
    {
      label: viewModel.executionGuardrailsLabel,
      value: viewModel.executionGuardrailChips.join(" / "),
      tone:
        platformState.executionFoundation.guardrails.length === 0
          ? ("approved" as const)
          : ("restricted" as const),
      note: viewModel.ticketOperationalValue,
    },
  ];

  const chartItems = [
    {
      label: dict.chart.title,
      value: platformState.workspacePreferences.chartType,
      note: `${dict.market.currentTimeframe}: ${platformState.selectedTimeframe}`,
    },
    {
      label: "Indicators",
      value:
        platformState.workspacePreferences.activeIndicators.join(" / ") ||
        "Clean chart",
      note: `Tool: ${platformState.workspacePreferences.activeDrawingTool}`,
    },
    {
      label: "Zoom",
      value: `${platformState.workspacePreferences.chartZoom}%`,
      note: platformState.dataStateFoundation.chartBindingState,
    },
    {
      label: dict.journal.openTradesTitle,
      value: `${platformState.openTrades.length} / ${PLATFORM_LIMITS.maxOpenTrades}`,
      tone: platformState.canOpenMore ? ("approved" as const) : ("restricted" as const),
      note: `${dict.journal.historyTitle}: ${platformState.history.length}`,
    },
  ];

  const depthItems = [
    {
      label: "Workspace focus",
      value:
        platformState.workspaceDepth.focusMode === "chart_focus"
          ? "Chart focus"
          : platformState.workspaceDepth.focusMode === "execution_focus"
          ? "Execution focus"
          : "Balanced",
      tone: "approved" as const,
      note: "Desktop composition remains panel-based and operator-controlled.",
    },
    {
      label: "Watchlist density",
      value: platformState.workspaceDepth.watchlistDensity === "dense" ? "Dense" : "Standard",
      tone: "pending" as const,
      note: "Market rows can compress without weakening route truth.",
    },
    {
      label: "Shortcut layer",
      value: "Layout-only",
      tone: "approved" as const,
      note: "No execution hotkeys are armed.",
    },
    {
      label: "Panel state",
      value: [
        platformState.workspacePreferences.watchlistVisible ? "Watchlist on" : "Watchlist off",
        platformState.workspacePreferences.ticketVisible ? "Ticket on" : "Ticket off",
        platformState.workspacePreferences.blotterExpanded ? "Blotter open" : "Blotter compact",
      ].join(" / "),
      tone: "approved" as const,
      note: "Depth state is stored locally-safe and coexists with backend preference sync.",
    },
  ];

  const commercialItems = [
    {
      label: "Public product entry",
      value: "Visible on /",
      tone: "approved" as const,
      note: "Commercial framing and workstation handoff stay explicit.",
    },
    {
      label: "Execution truth",
      value: "Paper-only evaluation",
      tone: viewModel.paperAccessTone,
      note: "Live execution and broker activation remain blocked by policy.",
    },
    {
      label: "Commercial readiness",
      value: "No billing system active",
      tone: "pending" as const,
      note: "No paid activation claim is exposed.",
    },
  ];

  const trustLedgerItems = [
    {
      label: "Fallback-first market data",
      value: "Disclosed",
      tone: "pending" as const,
      note: "Market and intelligence surfaces label fallback reliance.",
    },
    {
      label: "Live execution",
      value: "Blocked",
      tone: "blocked" as const,
      note: "No real-money route is enabled from diagnostics, settings, or the workstation.",
    },
    {
      label: "Broker connector",
      value: "Unconfigured",
      tone: "restricted" as const,
      note: "Broker capability remains local-paper-only until explicitly configured.",
    },
  ];

  return (
    <main className="tpm-foundation-page tpm-utility-page tpm-utility-page-diagnostics">
      <section className="tpm-foundation-card tpm-utility-hero">
        <header className="tpm-foundation-head">
          <div>
            <span>READINESS CENTER</span>
            <h1>{dict.diagnostics.title}</h1>
            <p>{dict.diagnostics.subtitle}</p>
          </div>
          <UtilityStatus
            text={viewModel.paperAccessValue}
            tone={viewModel.paperAccessTone}
          />
        </header>

        <div className="tpm-utility-hero-grid">
          <div>
            <span>{dict.market.selectedAsset}</span>
            <strong>{platformState.selectedAsset.symbol}</strong>
            <small>{platformState.selectedAsset.price}</small>
          </div>
          <div>
            <span>{dict.decision.title}</span>
            <strong>{viewModel.signalLabel}</strong>
            <small>{platformState.decision.confidence}</small>
          </div>
          <div>
            <span>{dict.trade.title}</span>
            <strong>{viewModel.executionIntentValue}</strong>
            <small>{viewModel.ticketOperationalValue}</small>
          </div>
        </div>
      </section>

      <UtilitySection eyebrow="FOUNDATION" title="System readiness">
        <UtilityGrid items={systemItems} />
      </UtilitySection>

      <UtilitySection eyebrow="PLAN INTERFACE" title="Plan-based interface architecture">
        <PlanInterfaceSummary compact currentLayer="demo_free" />
      </UtilitySection>

      <UtilitySection eyebrow="READINESS" title="Product readiness model">
        {planetOsLoadState.status === "ready" ? (
          <UtilityGrid items={planetOsItems} />
        ) : (
          <ProductStateNotice
            compact
            kind={planetOsLoadState.status === "error" ? "recovery" : "loading"}
            title={
              planetOsLoadState.status === "error"
                ? "Readiness snapshot unavailable"
                : "Loading readiness snapshot"
            }
            text="Diagnostics is checking the product readiness model without exposing restricted controls or fake launch claims."
          />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="ENGINES" title="Core engine readiness">
        {planetOsLoadState.status === "ready" && planetEngineItems.length > 0 ? (
          <UtilityGrid items={planetEngineItems} />
        ) : (
          <ProductStateNotice
            compact
            kind={planetOsLoadState.status === "error" ? "recovery" : "loading"}
            title={
              planetOsLoadState.status === "error"
                ? "Engine readiness unavailable"
                : "Loading engine readiness"
            }
            text="The core engines report readiness only; no launch, billing, social, broker/feed, or live-money state is activated."
          />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="PLAN ACCESS" title="Plan-based product access">
        <UtilityGrid items={planLayerItems} />
      </UtilitySection>

      <UtilitySection eyebrow="ASSISTANT" title="Assistant readiness">
        <UtilityGrid items={companionReadinessItems} />
      </UtilitySection>

      <UtilitySection eyebrow="MEMORY" title="Product memory readiness">
        <UtilityGrid items={productMemoryItems} />
      </UtilitySection>

      <UtilitySection eyebrow="MESH" title="Integration mesh">
        {integrationMeshItems.length > 0 ? (
          <UtilityGrid items={integrationMeshItems} />
        ) : (
          <ProductStateNotice
            compact
            kind="loading"
            title="Integration mesh loading"
            text="Diagnostics is aligning product truth, plans, Assistant, blocked conditions, safety, content, reporting, and visual readiness."
          />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="INTELLIGENCE" title="Safety integration readiness">
        <UtilityGrid items={intelligenceGovernanceItems} />
      </UtilitySection>

      <UtilitySection eyebrow="ECONOMY / MEDIA" title="Growth readiness">
        <UtilityGrid items={economyMediaGrowthItems} />
      </UtilitySection>

      <UtilitySection eyebrow="PRODUCT REALITY" title="Workspace and growth readiness">
        <div className="tpm-product-reality-grid">
          <PlanetMapPreview audience="citizen" />
          <CommunityReadinessPanel />
          <MediaOfficeReadinessPanel />
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="STATE" title="Why blocked readiness">
        {stateExplanationLoadState.status === "ready" && stateExplanationHighlights.length > 0 ? (
          <>
            <div className="tpm-state-explanation-grid">
              {stateExplanationHighlights.slice(0, 3).map((explanation) => (
                <StateExplanationCard
                  key={explanation.key}
                  compact
                  explanation={explanation}
                />
              ))}
            </div>
            <SafeNextStepList explanations={stateExplanationHighlights.slice(0, 4)} />
          </>
        ) : (
          <ProductStateNotice
            compact
            kind={stateExplanationLoadState.status === "error" ? "recovery" : "loading"}
            title={
              stateExplanationLoadState.status === "error"
                ? "State explanations unavailable"
                : "Loading state explanations"
            }
            text="The state explanation engine provides user-safe reasons and next steps for blocked, fallback, degraded, and protected conditions."
          />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="JOURNAL / COACH" title="Session coach foundation">
        {journalCoachLoadState.status === "ready" && journalCoachLoadState.snapshot ? (
          <SessionCoachPanel snapshot={journalCoachLoadState.snapshot} />
        ) : (
          <ProductStateNotice
            compact
            kind={journalCoachLoadState.status === "error" ? "recovery" : "loading"}
            title={
              journalCoachLoadState.status === "error"
                ? "Coach readiness unavailable"
                : "Loading coach readiness"
            }
            text="Basic paper-session prompts remain educational only; no financial advice, trading signal, or profit guarantee is allowed."
          />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="PROBES" title="Backend and connector probes">
        {diagnosticsLoadState.status === "error" ? (
          <ProductStateNotice
            compact
            kind="error"
            title="Probe visibility unavailable"
            text="Diagnostics could not load the backend probe snapshot."
            detail="Refresh this page or check /api/health; no live capability is implied."
          />
        ) : diagnosticsLoadState.status === "loading" ? (
          <ProductStateNotice
            compact
            kind="loading"
            title="Loading backend probes"
            text="Waiting for diagnostics to classify ready, fallback, degraded, and blocked systems."
          />
        ) : (
          <UtilityGrid items={probeItems} />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="CONNECTORS" title="Connector safety state">
        {diagnosticsLoadState.status === "ready" ? (
          <UtilityGrid items={connectorItems} />
        ) : (
          <ProductStateNotice
            compact
            kind={
              diagnosticsLoadState.status === "error" ? "not_configured" : "loading"
            }
            title={
              diagnosticsLoadState.status === "error"
                ? "Connector state not loaded"
                : "Loading connector state"
            }
            text="Broker/feed connector truth stays blocked unless diagnostics can show a configured guarded state."
          />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="ROUTES" title="API route visibility">
        {diagnosticsLoadState.status === "ready" ? (
          <UtilityGrid items={routeItems} />
        ) : (
          <ProductStateNotice
            compact
            kind={diagnosticsLoadState.status === "error" ? "recovery" : "loading"}
            title={
              diagnosticsLoadState.status === "error"
                ? "Route visibility needs recovery"
                : "Loading route visibility"
            }
            text="Protected routes remain guarded while route status is being checked."
          />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="SESSION" title="Protected route access">
        <div className="tpm-utility-auth-wrap">
          <AuthSessionPanel
            variant="required"
            title="Operational access"
            note="Protected account and operational API routes stay closed until sign-in. This does not enable broker routing, live execution, public launch, or billing."
          />
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="SAFETY" title="Execution and compliance state">
        <UtilityGrid items={readinessItems} />
      </UtilitySection>

      <UtilitySection eyebrow="WORKSPACE" title="Chart and session binding">
        <UtilityGrid items={chartItems} />
      </UtilitySection>

      <UtilitySection eyebrow="DEPTH" title="Workspace depth and interaction layer">
        <UtilityGrid items={depthItems} />
      </UtilitySection>

      <UtilitySection
        eyebrow="PUBLIC"
        title="Commercial trust and public product state"
        action={
          <Link className="tpm-utility-link" href="/">
            Product entry
          </Link>
        }
      >
        <UtilityGrid items={commercialItems} />
      </UtilitySection>

      <UtilitySection eyebrow="TRUTH" title="Product trust ledger">
        <UtilityGrid items={trustLedgerItems} />
      </UtilitySection>

      <div id="feedback" className="tpm-anchor-target">
        <UtilitySection eyebrow="FEEDBACK" title="Feedback and recovery state">
        {diagnosticsLoadState.status === "ready" && feedbackItems.length > 0 ? (
          <UtilityGrid items={feedbackItems} />
        ) : diagnosticsLoadState.status === "ready" ? (
          <ProductStateNotice
            compact
            kind="not_configured"
            title="Feedback telemetry not configured"
            text="The feedback route remains guarded; no public support or launch claim is exposed."
          />
        ) : (
          <ProductStateNotice
            compact
            kind={diagnosticsLoadState.status === "error" ? "feedback_failed" : "loading"}
            title={
              diagnosticsLoadState.status === "error"
                ? "Feedback state unavailable"
                : "Loading feedback state"
            }
            text="Feedback and hardening visibility is operator-reviewed and never opens a public launch path."
          />
        )}
        </UtilitySection>
      </div>

      <UtilitySection
        eyebrow="AUDIT"
        title={viewModel.auditTitle}
        action={
          <a className="tpm-utility-link" href={`${localePrefix || ""}/settings`}>
            {dict.nav.settings}
          </a>
        }
      >
        {platformState.auditTraceFoundation.recentEvents.length === 0 ? (
          <ProductStateNotice
            compact
            kind="empty"
            title={viewModel.auditEmptyLabel}
            text="Protected audit activity will appear here after settings, account, or paper workflow actions."
          />
        ) : (
          <div className="tpm-utility-event-list">
            {platformState.auditTraceFoundation.recentEvents.map((event) => (
              <div key={event.id} className="tpmv2-list-card">
                <div className="tpmv2-list-row">
                  <strong>{event.kind}</strong>
                  <span>{event.createdAt}</span>
                </div>
                <div className="tpmv2-list-meta">{event.message}</div>
              </div>
            ))}
          </div>
        )}
      </UtilitySection>
    </main>
  );
}

export function PlatformSettingsSurface({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const { platformState, viewModel } = useUtilityPlatformViewModel(locale, dict);
  const preferences = platformState.workspacePreferences;
  const localePrefix = locale ? `/${locale}` : "";
  const localeEntry = getLocaleEntry(locale);
  const accountTypeIdentity = getDefaultAccountTypeIdentity();
  const assistantTier = getAssistantTierSnapshot("evaluation").current;
  const planVisualIdentities = getPlanVisualIdentities();
  const planEntitlementSnapshot = getPlanEntitlementSnapshot("demo_free");
  const currentPlanetLayer = planEntitlementSnapshot.citizenAccess.currentLayer;
  const journalCoachLoadState = useJournalCoachReadiness();

  const productStructureItems = [
    {
      label: "Product mode",
      value: "Commercial evaluation foundation",
      tone: "approved" as const,
      note: "Public entry, workstation, settings, and diagnostics now read like one product.",
    },
    {
      label: "Account authority",
      value: "Manual paper operator",
      tone: viewModel.paperAccessTone,
      note: viewModel.liveAccessValue,
    },
    {
      label: "Account type",
      value: accountTypeIdentity.label,
      tone: accountTypeIdentity.tone,
      note: accountTypeIdentity.note,
    },
    {
      label: "TPM Assistant",
      value: assistantTier.label,
      tone: "pending" as const,
      note: "Free guidance is active; Pro, VIP, and Institutional assistants remain locked or planned until real entitlements exist.",
    },
    {
      label: "Broker readiness",
      value: "Unconfigured / blocked",
      tone: "restricted" as const,
      note: "Future packaging stays placeholder-only until explicitly built and configured.",
    },
  ];

  const productPackagingItems = [
    {
      label: "Plan and billing state",
      value: "No billing system active",
      tone: "pending" as const,
      note: "Future commercial packaging is represented honestly without a fake checkout or paid gate.",
    },
    {
      label: "Workspace access",
      value: "Evaluation workstation visible",
      tone: "approved" as const,
      note: "Public entry and localized workspace remain accessible for product review.",
    },
    {
      label: "Paper access",
      value: viewModel.paperAccessValue,
      tone: viewModel.paperAccessTone,
      note: viewModel.ticketNextStepValue,
    },
    {
      label: "Live activation",
      value: "Blocked",
      tone: "blocked" as const,
      note: "Real-money routing cannot be enabled from settings.",
    },
    {
      label: "Broker integration",
      value: "Unconfigured",
      tone: "restricted" as const,
      note: "No broker readiness, account funding, or live connection is implied.",
    },
  ];

  const onboardingItems = [
    {
      label: "Workspace orientation",
      value: "Topbar -> Assistant -> chart depth -> ticket preflight -> blotter",
      tone: "approved" as const,
      note: "The workstation now teaches a first pass without tutorial clutter.",
    },
    {
      label: "TPM Assistant",
      value: "Interpretive operator assist",
      tone: "pending" as const,
      note: "Context and risk guidance remain grounded, bounded, and non-predictive.",
    },
    {
      label: "Execution layer",
      value: "Paper rehearsal only",
      tone: viewModel.paperAccessTone,
      note: "Guarded ticket controls stay visible without weakening live-trading blocks.",
    },
  ];

  return (
    <main className="tpm-foundation-page tpm-utility-page tpm-utility-page-settings">
      <section className="tpm-foundation-card tpm-utility-hero">
        <header className="tpm-foundation-head">
          <div>
            <span>USER CONTROLS</span>
            <h1>{dict.settings.title}</h1>
            <p>{dict.settings.subtitle}</p>
          </div>
          <UtilityStatus
            text={viewModel.paperAccessValue}
            tone={viewModel.paperAccessTone}
          />
        </header>
      </section>

      <UtilitySection eyebrow="SESSION" title="Login and account session">
        <div className="tpm-utility-auth-wrap">
          <AuthSessionPanel
            title="Account session"
            note="Sign in to synchronize protected account state and guarded operational routes. Live execution and real-money access remain blocked."
          />
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="GLOBAL" title="Theme and language">
        <div className="tpm-utility-control-grid">
          <div className="tpm-utility-control">
            <span>{dict.settings.theme}</span>
            <ThemeSwitcher label={dict.nav.theme} />
            <small>{dict.settings.currentTheme}</small>
          </div>

          <div className="tpm-utility-control">
            <span>{dict.settings.language}</span>
            <LanguageSwitcher locale={locale} label={dict.nav.language} />
            <small>{localeCoverageText(locale)}</small>
          </div>

          <div className="tpm-utility-control">
            <span>{dict.settings.languageCoverage}</span>
            <strong>
              {localeEntry.coverage === "complete"
                ? localeEntry.name
                : dict.settings.fallbackLanguage}
            </strong>
            <small>
              {localeEntry.nativeName} / {localeEntry.direction.toUpperCase()}
            </small>
          </div>
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="ACCOUNT" title="Mode and persistence">
        <div className="tpm-utility-control-grid">
          <div className="tpm-utility-control">
            <span>{dict.settings.mode}</span>
            <div className="tpm-utility-button-row">
              <ToggleButton
                active={platformState.accountMode === "demo"}
                label={viewModel.demoLabel}
                onClick={() => platformState.switchAccountMode("demo")}
              />
              <ToggleButton
                active={platformState.accountMode === "real"}
                label={viewModel.realLabel}
                onClick={() => platformState.switchAccountMode("real")}
              />
            </div>
            <small>{viewModel.liveAccessValue}</small>
          </div>

          <div className="tpm-utility-control">
            <span>{dict.settings.stateSaving}</span>
            <strong>{platformState.dataStateFoundation.storagePersistenceState}</strong>
            <small>{platformState.dataStateFoundation.syncChannel}</small>
          </div>

          <div className="tpm-utility-control">
            <span>Islamic account status</span>
            <strong className={`tpmv2-detail-value ${accountTypeIdentity.tone}`}>
              {accountTypeIdentity.label}
            </strong>
            <small>
              {ACCOUNT_TYPE_IDENTITY_STATES.islamic_requested.label},{" "}
              {ACCOUNT_TYPE_IDENTITY_STATES.islamic_review_required.label},{" "}
              {ACCOUNT_TYPE_IDENTITY_STATES.islamic_configured.label}, and{" "}
              {ACCOUNT_TYPE_IDENTITY_STATES.unavailable.label} are supported status options; no
              certification is claimed.
            </small>
          </div>
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="CHART" title="Workspace chart behavior">
        <div className="tpm-utility-control-grid">
          <div className="tpm-utility-control">
            <span>Chart type</span>
            <div className="tpm-utility-button-row">
              {CHART_TYPES.map((type) => (
                <ToggleButton
                  key={type.id}
                  active={preferences.chartType === type.id}
                  label={type.label}
                  onClick={() =>
                    platformState.setWorkspacePreference("chartType", type.id)
                  }
                />
              ))}
            </div>
          </div>

          <div className="tpm-utility-control">
            <span>{dict.trade.timeframe}</span>
            <div className="tpm-utility-button-row">
              {TIMEFRAMES.map((timeframe) => (
                <ToggleButton
                  key={timeframe}
                  active={platformState.selectedTimeframe === timeframe}
                  label={timeframe}
                  onClick={() => platformState.setSelectedTimeframe(timeframe)}
                />
              ))}
            </div>
          </div>

          <div className="tpm-utility-control">
            <span>Indicators</span>
            <div className="tpm-utility-button-row">
              {INDICATOR_TOOLS.map((indicator) => (
                <ToggleButton
                  key={indicator}
                  active={preferences.activeIndicators.includes(indicator)}
                  label={indicator}
                  onClick={() => platformState.toggleWorkspaceIndicator(indicator)}
                />
              ))}
            </div>
          </div>

          <div className="tpm-utility-control">
            <span>Drawing tool</span>
            <div className="tpm-utility-button-row">
              {DRAWING_TOOLS.map((tool) => (
                <ToggleButton
                  key={tool}
                  active={preferences.activeDrawingTool === tool}
                  label={tool}
                  onClick={() =>
                    platformState.setWorkspacePreference("activeDrawingTool", tool)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="tpm-utility-button-row tpm-utility-reset-row">
          <ToggleButton
            active={preferences.chartZoom > 100}
            label={`Zoom + (${preferences.chartZoom}%)`}
            onClick={() =>
              platformState.setWorkspacePreference(
                "chartZoom",
                Math.min(130, preferences.chartZoom + 10)
              )
            }
          />
          <ToggleButton
            active={preferences.chartZoom < 100}
            label={`Zoom - (${preferences.chartZoom}%)`}
            onClick={() =>
              platformState.setWorkspacePreference(
                "chartZoom",
                Math.max(80, preferences.chartZoom - 10)
              )
            }
          />
          <button
            type="button"
            className="tpm-utility-toggle"
            onClick={platformState.resetChartWorkspace}
          >
            Reset chart workspace
          </button>
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="EXECUTION" title="Paper ticket defaults">
        <div className="tpm-utility-control-grid">
          <label className="tpm-utility-control">
            <span>{dict.trade.amount}</span>
            <input
              className="tpmv2-real-input tpm-utility-input"
              value={platformState.amount}
              onChange={(event) => platformState.setAmount(event.target.value)}
              inputMode="numeric"
            />
            <small>{viewModel.ticketOperationalValue}</small>
          </label>

          <div className="tpm-utility-control">
            <span>{dict.trade.timeframe}</span>
            <div className="tpm-utility-button-row">
              {EXECUTION_DURATIONS.map((duration) => (
                <ToggleButton
                  key={duration}
                  active={platformState.selectedDuration === duration}
                  label={duration}
                  onClick={() => platformState.setSelectedDuration(duration)}
                />
              ))}
            </div>
          </div>

          <div className="tpm-utility-control">
            <span>{viewModel.executionGuardrailsLabel}</span>
            <strong>{viewModel.executionGuardrailChips.join(" / ")}</strong>
            <small>{viewModel.ticketNextStepValue}</small>
          </div>
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="LAYOUT" title="Trading shell panels">
        <div className="tpm-utility-button-row">
          <ToggleButton
            active={preferences.watchlistVisible}
            label={dict.market.title}
            onClick={() => platformState.toggleWorkspacePanel("watchlistVisible")}
          />
          <ToggleButton
            active={preferences.ticketVisible}
            label={dict.trade.title}
            onClick={() => platformState.toggleWorkspacePanel("ticketVisible")}
          />
          <ToggleButton
            active={preferences.blotterExpanded}
            label={dict.journal.historyTitle}
            onClick={() => platformState.toggleWorkspacePanel("blotterExpanded")}
          />
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="DEPTH" title="Workstation depth and shortcut truth">
        <div className="tpm-utility-control-grid">
          <div className="tpm-utility-control">
            <span>Workspace focus</span>
            <div className="tpm-utility-button-row">
              <ToggleButton
                active={platformState.workspaceDepth.focusMode === "balanced"}
                label="Balanced"
                onClick={() => platformState.setWorkspaceFocusMode("balanced")}
              />
              <ToggleButton
                active={platformState.workspaceDepth.focusMode === "chart_focus"}
                label="Chart focus"
                onClick={() => platformState.setWorkspaceFocusMode("chart_focus")}
              />
              <ToggleButton
                active={platformState.workspaceDepth.focusMode === "execution_focus"}
                label="Execution focus"
                onClick={() => platformState.setWorkspaceFocusMode("execution_focus")}
              />
            </div>
            <small>Panel emphasis changes without enabling any real-money path.</small>
          </div>

          <div className="tpm-utility-control">
            <span>Watchlist density</span>
            <div className="tpm-utility-button-row">
              <ToggleButton
                active={platformState.workspaceDepth.watchlistDensity === "standard"}
                label="Standard"
                onClick={() => platformState.setWatchlistDensity("standard")}
              />
              <ToggleButton
                active={platformState.workspaceDepth.watchlistDensity === "dense"}
                label="Dense"
                onClick={() => platformState.setWatchlistDensity("dense")}
              />
            </div>
            <small>Shortcut layer stays layout-only; no order hotkeys are armed.</small>
          </div>

          <div className="tpm-utility-control">
            <span>Shortcut layer</span>
            <strong>Layout-only</strong>
            <small>Shift+1 watchlist, Shift+2 ticket, Shift+3 blotter, Shift+4/5/6 focus.</small>
          </div>
        </div>
      </UtilitySection>

      <UtilitySection
        eyebrow="PRODUCT"
        title="Account and commercial readiness"
        action={
          <Link className="tpm-utility-link" href="/">
            Product entry
          </Link>
        }
      >
        <UtilityGrid items={productStructureItems} />
      </UtilitySection>

      <UtilitySection eyebrow="PRODUCT ACCESS" title="Commercial packaging readiness">
        <UtilityGrid items={productPackagingItems} />
      </UtilitySection>

      <UtilitySection eyebrow="PLAN INTERFACE" title="Experience layers">
        <PlanInterfaceSummary currentLayer="demo_free" />
      </UtilitySection>

      <UtilitySection eyebrow="PLAN IDENTITY" title="Plan visual identity readiness">
        <PlanIdentityGrid currentPlanKey="demo_free" identities={planVisualIdentities} />
      </UtilitySection>

      <UtilitySection eyebrow="CURRENT PLAN" title="Your workspace layer">
        <div className="tpm-plan-layer-current">
          <PlanPlanetLayerCard current layer={currentPlanetLayer} />
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="ACCESS MAP" title="Plan-based product layers">
        <CitizenAccessMap
          currentClass={planEntitlementSnapshot.citizenAccess.currentClass}
          layers={planEntitlementSnapshot.citizenAccess.layers}
        />
      </UtilitySection>

      <UtilitySection eyebrow="PLAN EXPERIENCE" title="Plan capability truth">
        <div className="tpm-plan-experience-grid">
          {planEntitlementSnapshot.plans.map((plan) => (
            <PlanExperienceCard
              key={plan.planId}
              currentPlan={planEntitlementSnapshot.currentPlan}
              layer={planEntitlementSnapshot.citizenAccess.layers.find(
                (layer) => layer.planId === plan.planId
              )}
              plan={plan}
              truth={planEntitlementSnapshot.truth}
            />
          ))}
        </div>
      </UtilitySection>

      <UtilitySection eyebrow="ACADEMY" title="Learning and community readiness">
        <div className="tpm-product-reality-grid">
          <AcademyPreview />
          <CommunityReadinessPanel />
          <VIPRoomsPreview />
        </div>
      </UtilitySection>

      <UtilitySection
        eyebrow="ONBOARDING"
        title="First-use platform guidance"
        action={
          <a className="tpm-utility-link" href={`${localePrefix || ""}/diagnostics`}>
            {dict.nav.diagnostics}
          </a>
        }
      >
        <UtilityGrid items={onboardingItems} />
      </UtilitySection>

      <UtilitySection eyebrow="JOURNAL / COACH" title="Paper-session guidance">
        {journalCoachLoadState.status === "ready" && journalCoachLoadState.snapshot ? (
          <SessionCoachPanel snapshot={journalCoachLoadState.snapshot} />
        ) : (
          <ProductStateNotice
            compact
            kind={journalCoachLoadState.status === "error" ? "recovery" : "loading"}
            title={
              journalCoachLoadState.status === "error"
                ? "Coach readiness unavailable"
                : "Loading coach readiness"
            }
            text="Journal and coach prompts stay paper-safe and educational. No financial advice or trading signal is active."
          />
        )}
      </UtilitySection>

      <UtilitySection eyebrow="COMPLIANCE" title={viewModel.policyPanelLabel}>
        <UtilityGrid
          items={[
            {
              label: viewModel.paperAccessLabel,
              value: viewModel.paperAccessValue,
              tone: viewModel.paperAccessTone,
              note: viewModel.ticketNextStepValue,
            },
            {
              label: viewModel.reviewStatusLabel,
              value: viewModel.reviewStatusDescription,
              tone: viewModel.reviewStatusTone,
            },
            {
              label: viewModel.disclosureSummaryLabel,
              value: viewModel.disclosureSummaryValue,
              tone: viewModel.paperAccessTone,
            },
          ]}
        />

        <div className="tpm-utility-button-row">
          <button
            type="button"
            className="tpm-utility-toggle"
            disabled={!platformState.canAcknowledgeDisclosures}
            onClick={platformState.acceptPendingDisclosures}
          >
            {viewModel.acceptDisclosuresLabel}
          </button>
          <button
            type="button"
            className="tpm-utility-toggle"
            disabled={!platformState.canSubmitAccountReview}
            onClick={platformState.submitActivationReview}
          >
            {viewModel.submitReviewLabel}
          </button>
        </div>
      </UtilitySection>
    </main>
  );
}
