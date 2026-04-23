"use client";

import { usePathname, useRouter } from "next/navigation";
import { SHOWCASED_LOCALES } from "../../../lib/i18n/config";

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: string;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function buildHref(target: string) {
    const segments = pathname.split("/").filter(Boolean);
    const hasLocalePrefix = SHOWCASED_LOCALES.includes(
      segments[0] as (typeof SHOWCASED_LOCALES)[number]
    );
    const tail = hasLocalePrefix ? segments.slice(1).join("/") : segments.join("/");
    return tail ? `/${target}/${tail}` : `/${target}`;
  }

  return (
    <label className="tpm-locale-switcher" aria-label={label}>
      <select
        className="tpm-locale-select"
        value={locale}
        onChange={(e) => router.push(buildHref(e.target.value))}
      >
        <option value="ar">العربية</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
