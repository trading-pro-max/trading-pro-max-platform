import { MARKET_INSTRUMENTS } from "../../../lib/market/catalog";
import type { Asset } from "../../shell/types/platform-state";

export const MARKET_ASSETS: Asset[] = MARKET_INSTRUMENTS.map((instrument) => ({
  id: instrument.id,
  symbol: instrument.symbol,
  name: instrument.name,
  assetClass: instrument.assetClass,
  priceDecimals: instrument.priceDecimals,
  status: instrument.assetClass === "crypto" ? "Active" : "Open",
  price: instrument.baselinePrice.toLocaleString("en-US", {
    minimumFractionDigits: instrument.priceDecimals,
    maximumFractionDigits: instrument.priceDecimals,
  }),
  change: "+0.00%",
  sourceLabel: "Local seed fallback",
  lastUpdatedAt: "",
}));
