"use client";

import type { MarketRailProps } from "../../shell/types/view-props";

export function MarketRail({
  brandTitle,
  brandSubtitle,
  title,
  searchPlaceholder,
  assets,
  selectedAssetIndex,
  onSelectAsset,
}: MarketRailProps) {
  return (
    <aside className="tpm-sidebar">
      <div className="tpm-brand">
        <div className="tpm-logo">TPM</div>
        <div>
          <h1>{brandTitle}</h1>
          <p>{brandSubtitle}</p>
        </div>
      </div>

      <section className="tpm-panel">
        <div className="tpm-panel-title">{title}</div>
        <div className="tpm-market-search">{searchPlaceholder}</div>

        <div className="tpm-asset-list">
          {assets.map((asset, index) => (
            <button
              key={asset.symbol}
              className={index === selectedAssetIndex ? "tpm-asset active" : "tpm-asset"}
              onClick={() => onSelectAsset(index)}
            >
              <span>{asset.symbol}</span>
              <small>{asset.status}</small>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}