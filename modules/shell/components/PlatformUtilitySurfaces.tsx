"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getLocaleEntry } from "../../../lib/i18n/config";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import AuthSessionPanel from "../../auth/components/AuthSessionPanel";
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

function toneFromStatus(tone: WorkstationStatusTone) {
  return `tpmv2-status-tag ${tone}`;
}

function toneFromProbeStatus(status: DiagnosticsProbeStatus): WorkstationStatusTone {
  if (status === "ready") return "approved";
  if (status === "fallback" || status === "auth_required") return "pending";
  if (status === "blocked" || status === "unconfigured") return "restricted";
  return "blocked";
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
    <section className="tpm-foundation-card tpm-utility-card">
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
          <span>{item.label}</span>
          <strong className={item.tone ? `tpmv2-detail-value ${item.tone}` : undefined}>
            {item.value}
          </strong>
          {item.note ? <small>{item.note}</small> : null}
        </div>
      ))}
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

function useDiagnosticsHealth() {
  const [health, setHealth] = useState<DiagnosticsHealthSnapshot | null>(null);

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
        setHealth(payload.health);
      } catch {
        if (!active) return;
        setHealth(null);
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

  return health;
}

export function PlatformDiagnosticsSurface({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const { platformState, viewModel } = useUtilityPlatformViewModel(locale, dict);
  const diagnosticsHealth = useDiagnosticsHealth();
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
    <main className="tpm-foundation-page tpm-utility-page">
      <section className="tpm-foundation-card tpm-utility-hero">
        <header className="tpm-foundation-head">
          <div>
            <span>TPM SYSTEM</span>
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

      <UtilitySection eyebrow="PROBES" title="Backend and connector probes">
        <UtilityGrid items={probeItems} />
      </UtilitySection>

      <UtilitySection eyebrow="CONNECTORS" title="Connector safety state">
        <UtilityGrid items={connectorItems} />
      </UtilitySection>

      <UtilitySection eyebrow="ROUTES" title="API route visibility">
        <UtilityGrid items={routeItems} />
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
          <div className="tpmv2-empty">{viewModel.auditEmptyLabel}</div>
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
      value: "Topbar -> IQ / Brain -> chart depth -> ticket preflight -> blotter",
      tone: "approved" as const,
      note: "The workstation now teaches a first pass without tutorial clutter.",
    },
    {
      label: "TPM IQ / Brain",
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
    <main className="tpm-foundation-page tpm-utility-page">
      <section className="tpm-foundation-card tpm-utility-hero">
        <header className="tpm-foundation-head">
          <div>
            <span>TPM CONTROL</span>
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
