"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_STORAGE_KEY } from "../../../lib/constants/storage";
import {
  SUPPORTED_LOCALES,
  SUPPORTED_LOCALE_CODES,
  resolveLocale,
} from "../../../lib/i18n/config";

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: string;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = resolveLocale(locale);

  function buildHref(target: string) {
    const segments = pathname.split("/").filter(Boolean);
    const hasLocalePrefix = SUPPORTED_LOCALE_CODES.includes(segments[0]);
    const tail = hasLocalePrefix ? segments.slice(1).join("/") : segments.join("/");
    return tail ? `/${target}/${tail}` : `/${target}`;
  }

  function selectLocale(target: string) {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, target);
    } catch {}

    router.push(buildHref(target));
  }

  return (
    <label className="tpm-locale-switcher" aria-label={label}>
      <select
        className="tpm-locale-select"
        value={activeLocale}
        onChange={(event) => selectLocale(event.target.value)}
      >
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeName}
            {item.coverage === "fallback" ? " (EN fallback)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
