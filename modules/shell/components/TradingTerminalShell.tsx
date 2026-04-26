"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import type { AccountMode } from "../types/platform-state";
import type { WorkstationStatusTone } from "./trading-workstation-view-model";
import ProductLogo from "../../brand/components/ProductLogo";
import PlatformPulse from "./PlatformPulse";
import ShellControls from "./ShellControls";
import ShellStatusBadges, { type ShellStatusBadge } from "./ShellStatusBadges";
import SwissPrecisionClock from "./SwissPrecisionClock";

function modeButtonStyle(active: boolean): CSSProperties {
  if (!active) return {};

  return {
    background: "linear-gradient(180deg, var(--tpm-accent), var(--tpm-accent-strong))",
    borderColor: "transparent",
    color: "#041412",
  };
}

function toneClassFromValue(value: string) {
  const normalized = value.trim();

  if (normalized.startsWith("+")) return "positive";
  if (normalized.startsWith("-")) return "negative";

  return "neutral";
}

function statusToneClass(tone: WorkstationStatusTone) {
  if (tone === "approved") return "ready";
  if (tone === "blocked") return "blocked";
  if (tone === "pending") return "planned";
  return "inactive";
}

type TradingTerminalShellProps = {
  accountMode: AccountMode;
  balance: string;
  demoLabel: string;
  diagnosticsHref: string;
  diagnosticsLabel: string;
  locale: string;
  marketStatus: string;
  modeLabel: string;
  onModeChange: (mode: AccountMode) => void;
  paperAccessLabel: string;
  paperAccessTone: WorkstationStatusTone;
  paperAccessValue: string;
  realLabel: string;
  selectedAssetChange: string;
  selectedAssetPrice: string;
  selectedAssetSymbol: string;
  settingsHref: string;
  settingsLabel: string;
};

export default function TradingTerminalShell({
  accountMode,
  balance,
  demoLabel,
  diagnosticsHref,
  diagnosticsLabel,
  locale,
  marketStatus,
  modeLabel,
  onModeChange,
  paperAccessLabel,
  paperAccessTone,
  paperAccessValue,
  realLabel,
  selectedAssetChange,
  selectedAssetPrice,
  selectedAssetSymbol,
  settingsHref,
  settingsLabel,
}: TradingTerminalShellProps) {
  const workspaceStatusItems: ShellStatusBadge[] = [
    { label: `${paperAccessLabel}: ${paperAccessValue}`, tone: statusToneClass(paperAccessTone) },
    { label: "Paper-safe", tone: "ready" as const },
    { label: marketStatus, tone: "planned" as const },
  ];

  return (
    <header
      className="tpm-terminal-topbar tpmv2-card tpmv2-topbar"
      data-shell-layer="terminal_topbar"
      data-terminal-topbar="true"
    >
      <Link className="tpm-shell-logo-home-link" href="/" aria-label="Pro Max home">
        <ProductLogo
          className="tpm-shell-logo tpm-shell-compact-mark tpmv2-topbar-brand tpm-foundation-nav-brand"
          animated
          motionIntensity="low"
          state="paper_safe"
          surface="workstation"
          subtitle="Trading terminal"
          variant="topbar"
        />
      </Link>

      <div className="tpmv2-topbar-market">
        <div className="tpmv2-topbar-market-main tpmv2-topbar-market-compact">
          <div className="tpmv2-topbar-market-strip">
            <div className="tpmv2-topbar-market-symbol">{selectedAssetSymbol}</div>
            <div className="tpmv2-topbar-market-price">{selectedAssetPrice}</div>
            <div
              className={`tpmv2-topbar-market-change ${toneClassFromValue(
                selectedAssetChange
              )}`}
            >
              {selectedAssetChange}
            </div>
            <span className="tpmv2-topbar-market-state">{marketStatus}</span>
          </div>
        </div>
      </div>

      <ShellStatusBadges items={workspaceStatusItems} variant="workspace" />

      <div className="tpm-terminal-runtime">
        <SwissPrecisionClock compact />
        <PlatformPulse />
      </div>

      <div className="tpmv2-topbar-controls">
        <ShellControls
          authTitle="Workspace session"
          diagnosticsHref={diagnosticsHref}
          diagnosticsLabel={diagnosticsLabel}
          locale={locale}
          settingsHref={settingsHref}
          settingsLabel={settingsLabel}
          variant="workspace"
        />

        <div className="tpmv2-topbar-toggle" aria-label="Paper account mode">
          <span className="tpmv2-mode-label">{modeLabel}</span>

          <button
            type="button"
            className="tpmv2-badge"
            style={modeButtonStyle(accountMode === "demo")}
            onClick={() => onModeChange("demo")}
          >
            {demoLabel}
          </button>

          <button
            type="button"
            className="tpmv2-badge"
            style={modeButtonStyle(accountMode === "real")}
            onClick={() => onModeChange("real")}
          >
            {realLabel}
          </button>

          <span className="tpmv2-badge tpmv2-topbar-balance">{balance}$</span>
        </div>
      </div>
    </header>
  );
}
