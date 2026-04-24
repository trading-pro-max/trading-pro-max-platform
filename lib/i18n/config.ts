export const DEFAULT_LOCALE = "en";

export type LocaleDirection = "ltr" | "rtl";
export type DictionaryLocale = "ar" | "en";
export type TranslationCoverage = "complete" | "fallback";

export type LocaleRegistryEntry = {
  code: string;
  name: string;
  nativeName: string;
  direction: LocaleDirection;
  dictionaryLocale: DictionaryLocale;
  coverage: TranslationCoverage;
  coverageLabel: string;
  aliases?: readonly string[];
};

export const SUPPORTED_LOCALES: readonly LocaleRegistryEntry[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "complete",
    coverageLabel: "Human-reviewed English pack",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    dictionaryLocale: "ar",
    coverage: "complete",
    coverageLabel: "Human-reviewed Arabic RTL pack",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until German pack is reviewed",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until French pack is reviewed",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Spanish pack is reviewed",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Italian pack is reviewed",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Portuguese pack is reviewed",
    aliases: ["pt-br", "pt-pt"],
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Turkish pack is reviewed",
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Dutch pack is reviewed",
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Polish pack is reviewed",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Russian pack is reviewed",
  },
  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Українська",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Ukrainian pack is reviewed",
  },
  {
    code: "zh-cn",
    name: "Chinese Simplified",
    nativeName: "简体中文",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Simplified Chinese pack is reviewed",
    aliases: ["zh-hans", "zh"],
  },
  {
    code: "zh-tw",
    name: "Chinese Traditional",
    nativeName: "繁體中文",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Traditional Chinese pack is reviewed",
    aliases: ["zh-hant", "zh-hk"],
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Japanese pack is reviewed",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Korean pack is reviewed",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Hindi pack is reviewed",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    direction: "rtl",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback with RTL layout until Urdu pack is reviewed",
  },
  {
    code: "fa",
    name: "Persian",
    nativeName: "فارسی",
    direction: "rtl",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback with RTL layout until Persian pack is reviewed",
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Indonesian pack is reviewed",
  },
  {
    code: "ms",
    name: "Malay",
    nativeName: "Bahasa Melayu",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Malay pack is reviewed",
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Vietnamese pack is reviewed",
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Thai pack is reviewed",
  },
  {
    code: "el",
    name: "Greek",
    nativeName: "Ελληνικά",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Greek pack is reviewed",
  },
  {
    code: "ro",
    name: "Romanian",
    nativeName: "Română",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Romanian pack is reviewed",
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Swedish pack is reviewed",
  },
  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Norwegian pack is reviewed",
    aliases: ["nb", "nn"],
  },
  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Danish pack is reviewed",
  },
  {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
    direction: "ltr",
    dictionaryLocale: "en",
    coverage: "fallback",
    coverageLabel: "English fallback until Finnish pack is reviewed",
  },
] as const;

export const SHOWCASED_LOCALES = SUPPORTED_LOCALES.map((locale) => locale.code);
export const SUPPORTED_LOCALE_CODES = SHOWCASED_LOCALES;

const DEFAULT_LOCALE_ENTRY =
  SUPPORTED_LOCALES.find((locale) => locale.code === DEFAULT_LOCALE) ??
  SUPPORTED_LOCALES[0];

export function canonicalizeLocale(input?: string) {
  return (input || DEFAULT_LOCALE).replace(/_/g, "-").toLowerCase();
}

export function getLocaleEntry(input?: string): LocaleRegistryEntry {
  const normalized = canonicalizeLocale(input);
  const base = normalized.split("-")[0];

  return (
    SUPPORTED_LOCALES.find((locale) => locale.code === normalized) ??
    SUPPORTED_LOCALES.find((locale) => locale.aliases?.includes(normalized)) ??
    SUPPORTED_LOCALES.find((locale) => locale.code === base) ??
    DEFAULT_LOCALE_ENTRY
  );
}

export function isSupportedLocale(input?: string) {
  const normalized = canonicalizeLocale(input);
  const base = normalized.split("-")[0];

  return SUPPORTED_LOCALES.some(
    (locale) =>
      locale.code === normalized ||
      locale.code === base ||
      Boolean(locale.aliases?.includes(normalized))
  );
}

export function resolveLocale(input?: string) {
  return getLocaleEntry(input).code;
}

export function resolveDictionaryLocale(input?: string): DictionaryLocale {
  return getLocaleEntry(input).dictionaryLocale;
}

export function getDirection(input?: string): LocaleDirection {
  return getLocaleEntry(input).direction;
}

export function getTranslationCoverage(input?: string): TranslationCoverage {
  return getLocaleEntry(input).coverage;
}
