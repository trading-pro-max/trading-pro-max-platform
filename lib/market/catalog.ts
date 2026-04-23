import type { AssetClass } from "@/modules/shell/types/platform-state";

export type MarketInstrumentDefinition = {
  id: string;
  symbol: string;
  providerSymbol: string;
  name: string;
  assetClass: AssetClass;
  priceDecimals: number;
  baselinePrice: number;
  baseCurrency: string;
  quoteCurrency: string;
  dailyDrift: number;
  intradayVolatility: number;
  volumeBase: number;
};

export const MARKET_INSTRUMENTS: readonly MarketInstrumentDefinition[] = [
  {
    id: "eurusd",
    symbol: "EUR/USD",
    providerSymbol: "EURUSD",
    name: "Euro / US Dollar",
    assetClass: "fx",
    priceDecimals: 4,
    baselinePrice: 1.0842,
    baseCurrency: "EUR",
    quoteCurrency: "USD",
    dailyDrift: 0.0014,
    intradayVolatility: 0.0011,
    volumeBase: 6200,
  },
  {
    id: "gbpusd",
    symbol: "GBP/USD",
    providerSymbol: "GBPUSD",
    name: "British Pound / US Dollar",
    assetClass: "fx",
    priceDecimals: 4,
    baselinePrice: 1.2678,
    baseCurrency: "GBP",
    quoteCurrency: "USD",
    dailyDrift: 0.0018,
    intradayVolatility: 0.0013,
    volumeBase: 5400,
  },
  {
    id: "usdjpy",
    symbol: "USD/JPY",
    providerSymbol: "USDJPY",
    name: "US Dollar / Japanese Yen",
    assetClass: "fx",
    priceDecimals: 2,
    baselinePrice: 151.42,
    baseCurrency: "USD",
    quoteCurrency: "JPY",
    dailyDrift: 0.0012,
    intradayVolatility: 0.0009,
    volumeBase: 6000,
  },
  {
    id: "btcusd",
    symbol: "BTC/USD",
    providerSymbol: "BTCUSD",
    name: "Bitcoin / US Dollar",
    assetClass: "crypto",
    priceDecimals: 0,
    baselinePrice: 84220,
    baseCurrency: "BTC",
    quoteCurrency: "USD",
    dailyDrift: 0.0065,
    intradayVolatility: 0.0078,
    volumeBase: 24000,
  },
  {
    id: "ethusd",
    symbol: "ETH/USD",
    providerSymbol: "ETHUSD",
    name: "Ethereum / US Dollar",
    assetClass: "crypto",
    priceDecimals: 0,
    baselinePrice: 1945,
    baseCurrency: "ETH",
    quoteCurrency: "USD",
    dailyDrift: 0.0052,
    intradayVolatility: 0.0061,
    volumeBase: 18000,
  },
  {
    id: "xauusd",
    symbol: "XAU/USD",
    providerSymbol: "XAUUSD",
    name: "Gold / US Dollar",
    assetClass: "commodity",
    priceDecimals: 1,
    baselinePrice: 2331,
    baseCurrency: "XAU",
    quoteCurrency: "USD",
    dailyDrift: 0.0024,
    intradayVolatility: 0.0019,
    volumeBase: 7600,
  },
] as const;

export const DEFAULT_MARKET_SYMBOL = MARKET_INSTRUMENTS[0].symbol;

function canonicalMarketSymbol(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function getMarketInstrument(symbol?: string | null) {
  if (!symbol) return MARKET_INSTRUMENTS[0];

  const canonicalSymbol = canonicalMarketSymbol(symbol);

  return (
    MARKET_INSTRUMENTS.find(
      (instrument) =>
        canonicalMarketSymbol(instrument.symbol) === canonicalSymbol ||
        canonicalMarketSymbol(instrument.providerSymbol) === canonicalSymbol
    ) ?? MARKET_INSTRUMENTS[0]
  );
}

export function hasMarketInstrument(symbol?: string | null) {
  if (!symbol) return false;

  const canonicalSymbol = canonicalMarketSymbol(symbol);

  return MARKET_INSTRUMENTS.some(
    (instrument) =>
      canonicalMarketSymbol(instrument.symbol) === canonicalSymbol ||
      canonicalMarketSymbol(instrument.providerSymbol) === canonicalSymbol
  );
}
