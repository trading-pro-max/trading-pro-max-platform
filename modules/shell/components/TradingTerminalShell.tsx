"use client";

import Link from "next/link";
import type { AccountMode } from "../types/platform-state";
import ProductLogo from "../../brand/components/ProductLogo";
import ShellControls from "./ShellControls";
import ShellStatusBadges, { type ShellStatusBadge } from "./ShellStatusBadges";
import type { WorkstationStatusTone } from "./trading-workstation-view-model";

function toneClassFromValue(value: string) {
  const normalized = value.trim();

  if (normalized.startsWith("+")) return "positive";
  if (normalized.startsWith("-")) return "negative";

  return "neutral";
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
  paperAccessValue,
  realLabel,
  selectedAssetChange,
  selectedAssetPrice,
  selectedAssetSymbol,
  settingsHref,
  settingsLabel,
}: TradingTerminalShellProps) {
  const activeModeLabel = accountMode === "demo" ? demoLabel : `${realLabel} blocked`;
  const workspaceStatusItems: ShellStatusBadge[] = [
    { label: "Paper-safe", tone: "ready" as const },
  ];

  return (
    <header
      className="tpm-terminal-topbar tpmv2-card tpmv2-topbar"
      data-shell-layer="terminal_topbar"
      data-terminal-topbar="true"
      data-workspace-header="single-terminal-header"
    >
      <Link className="tpm-shell-logo-home-link" href="/" aria-label="Pro Max home">
        <ProductLogo
          className="tpm-shell-logo tpm-shell-compact-mark tpmv2-topbar-brand tpm-foundation-nav-brand"
          motionIntensity="none"
          state="paper_safe"
          surface="workstation"
          subtitle="Trading terminal"
          variant="topbar"
        />
      </Link>

      <div className="tpmv2-topbar-market tpm-terminal-topbar-market">
        <span className="tpm-terminal-topbar-kicker">Pro Max Trading</span>
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

      <div className="tpm-terminal-topbar-meta" aria-label="Workspace account truth">
        <span>{modeLabel}</span>
        <strong>{activeModeLabel}</strong>
        <small>{paperAccessValue} / {balance}$ simulated</small>
      </div>

      <div hidden aria-hidden="true">
        <span className="tpm-precision-clock" />
        <span className="tpm-platform-pulse" data-pulse="ready" />
      </div>

      <div className="tpmv2-topbar-controls">
        <ShellControls
          authTitle="Workspace session"
          diagnosticsHref={diagnosticsHref}
          diagnosticsLabel={diagnosticsLabel}
          locale={locale}
          settingsHref={settingsHref}
          settingsLabel={settingsLabel}
          showExperienceControls={false}
          showUtilities={false}
          variant="workspace"
        />
      </div>
    </header>
  );
}
