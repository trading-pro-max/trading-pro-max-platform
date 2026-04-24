import ar from "./dictionaries/ar";
import en from "./dictionaries/en";
import { resolveDictionaryLocale, type DictionaryLocale } from "./config";

type DeepDictionary<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepDictionary<T[K]>;
};

export type Dictionary = DeepDictionary<typeof en>;

const dictionaries: Record<DictionaryLocale, Dictionary> = {
  ar,
  en,
};

export function getDictionary(locale?: string): Dictionary {
  const resolved = resolveDictionaryLocale(locale);
  return dictionaries[resolved] ?? en;
}
