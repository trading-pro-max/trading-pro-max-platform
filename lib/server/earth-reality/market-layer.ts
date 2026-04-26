import type { EarthRealityCheck } from "./types";

export function getEarthMarketLayerChecks(): EarthRealityCheck[] {
  return [
    {
      checkId: "earth_market_paper_safe_workspace",
      layer: "market",
      surface: "trading_workspace",
      requirement:
        "Trading Workspace remains paper-safe, chart-first, and honest about fallback context.",
      decision: "pass",
      reason:
        "Execution remains paper-only; broker/feed/live/real-money routing are blocked or inactive.",
      userImpact: "Users can practice without accidental real execution.",
      trustImpact: "Market data state is not misrepresented as live broker truth.",
      safetyImpact: "No real-money path exists.",
      requiredFix: "Keep chart labels and status badges explicit.",
      publicCopyRule: "Use Paper-safe, Live inactive, Broker/feed inactive.",
      validationRule: "Workspace must not claim live execution or broker connectivity.",
    },
    {
      checkId: "earth_market_markets_surface_truth",
      layer: "market",
      surface: "markets",
      requirement:
        "Markets page must list supported/planned markets without live-feed or brokerage claims.",
      decision: "pass",
      reason:
        "Public market sections separate Forex, Crypto, Commodities, Indices, and future Stocks readiness.",
      userImpact: "Users understand what they can inspect and what is future.",
      trustImpact: "No fake live-feed or exchange connection is implied.",
      safetyImpact: "Market session awareness stays atmosphere/readiness only.",
      requiredFix: "Keep market categories marked active/planned/future.",
      publicCopyRule: "Say Markets and paper-ready context, not live feed.",
      validationRule: "Markets public copy must avoid broker activation claims.",
    },
  ];
}
