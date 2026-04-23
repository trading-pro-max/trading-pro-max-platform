import { MARKET_INSTRUMENTS, getMarketInstrument } from "@/lib/market/catalog";

const SUPPORTED_SYMBOLS = new Set(MARKET_INSTRUMENTS.map((item) => item.symbol));

function canonicalSymbol(value: string) {
  return value.toUpperCase().replace(/\s+/g, "").replace("-", "/");
}

export function normalizeWatchlistSymbols(
  input: unknown,
  fallbackSymbols: string[] = [MARKET_INSTRUMENTS[0].symbol]
) {
  const source = Array.isArray(input) ? input : [];
  const seen = new Set<string>();
  const symbols: string[] = [];
  const unsupported: string[] = [];

  for (const value of source) {
    if (typeof value !== "string") continue;
    const candidate = value.trim();
    if (!candidate) continue;

    const normalized = getMarketInstrument(canonicalSymbol(candidate)).symbol;
    const isSupported =
      SUPPORTED_SYMBOLS.has(normalized) &&
      canonicalSymbol(candidate) === canonicalSymbol(normalized);
    const key = canonicalSymbol(normalized);
    if (seen.has(key)) continue;
    seen.add(key);

    if (isSupported) {
      symbols.push(normalized);
    } else {
      unsupported.push(candidate);
    }
  }

  if (symbols.length > 0) {
    return { symbols, unsupported };
  }

  return {
    symbols: [...fallbackSymbols],
    unsupported,
  };
}

export function normalizeWatchlistTags(input: unknown) {
  const source = Array.isArray(input)
    ? input
    : typeof input === "string"
    ? input.split(",")
    : [];
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const value of source) {
    if (typeof value !== "string") continue;
    const normalized = value.trim().replace(/\s+/g, " ");
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(normalized);
    if (tags.length >= 8) break;
  }

  return tags;
}

export function normalizeWatchlistNotes(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 480) : "";
}

export function normalizeWatchlistIntent(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 120) : "";
}

export function buildWatchlistMergePreview(input: {
  existingNames: string[];
  incomingNames: string[];
}) {
  const existing = new Set(
    input.existingNames.map((name) => name.trim().toLowerCase()).filter(Boolean)
  );
  const additions: string[] = [];
  const collisions: string[] = [];

  for (const name of input.incomingNames) {
    const normalized = name.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (existing.has(key)) {
      collisions.push(normalized);
      continue;
    }
    existing.add(key);
    additions.push(normalized);
  }

  return {
    additions,
    collisions,
  };
}
