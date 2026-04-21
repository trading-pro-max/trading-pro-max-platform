import type { TopbarProps } from "../types/view-props";

export function Topbar({
  paperLabel,
  liveFeedLabel,
  stableLabel,
  balance,
}: TopbarProps) {
  return (
    <header className="tpm-topbar">
      <div className="tpm-topbar-left">
        <div className="tpm-badge">{paperLabel}</div>
        <div className="tpm-badge">{liveFeedLabel}</div>
        <div className="tpm-badge">{stableLabel}</div>
      </div>

      <div className="tpm-balance">{balance}</div>
    </header>
  );
}