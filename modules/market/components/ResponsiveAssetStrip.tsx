"use client";

import type { Asset } from "../../shell/types/platform-state";

export function ResponsiveAssetStrip({
  title,
  searchPlaceholder,
  assets,
  selectedAssetIndex,
  onSelectAsset,
}: {
  title: string;
  searchPlaceholder: string;
  assets: Asset[];
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
}) {
  return (
    <section className="tpm-responsive-market">
      <div className="tpm-panel-title">{title}</div>
      <div className="tpm-market-search">{searchPlaceholder}</div>

      <div className="tpm-responsive-asset-strip">
        {assets.map((asset, index) => (
          <button
            key={asset.symbol}
            className={index === selectedAssetIndex ? "tpm-responsive-asset active" : "tpm-responsive-asset"}
            onClick={() => onSelectAsset(index)}
          >
            <strong>{asset.symbol}</strong>
            <small>{asset.status}</small>
          </button>
        ))}
      </div>
    </section>
  );
}