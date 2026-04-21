export const DEFAULT_LOCALE = "en";
export const SHOWCASED_LOCALES = ["ar", "en"] as const;

const RTL_LANGS = ["ar", "fa", "he", "ur", "ps", "ku"];

export function canonicalizeLocale(input?: string) {
  return (input || DEFAULT_LOCALE).replace(/_/g, "-").toLowerCase();
}

export function resolveDictionaryLocale(input?: string) {
  const normalized = canonicalizeLocale(input);
  const base = normalized.split("-")[0];

  if (base === "ar") return "ar";
  if (base === "en") return "en";

  return DEFAULT_LOCALE;
}

export function getDirection(input?: string) {
  const normalized = canonicalizeLocale(input);
  const base = normalized.split("-")[0];
  return RTL_LANGS.includes(base) ? "rtl" : "ltr";
}