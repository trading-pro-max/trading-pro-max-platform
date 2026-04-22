import Link from "next/link";
import type { ReactNode } from "react";
import { getDirection, resolveDictionaryLocale } from "../../lib/i18n/config";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import { LanguageSwitcher } from "../../modules/shell/components/LanguageSwitcher";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveDictionaryLocale(locale);
  const dict = getDictionary(resolvedLocale);
  const dir = getDirection(resolvedLocale);

  const navItems = [
    { href: `/${resolvedLocale}`, label: dict.nav.trade },
    { href: `/${resolvedLocale}/diagnostics`, label: dict.nav.diagnostics },
    { href: `/${resolvedLocale}/settings`, label: dict.nav.settings },
  ];

  return (
    <div dir={dir} lang={resolvedLocale} className="tpm-foundation-frame">
      <nav className="tpm-foundation-nav">
        <div className="tpm-foundation-nav-brand">
          <div className="tpm-foundation-nav-logo">TPM</div>
          <div>
            <strong>Trading Pro Max</strong>
            <span>{dict.shell.foundation}</span>
          </div>
        </div>

        <div className="tpm-foundation-nav-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="tpm-foundation-link">
              {item.label}
            </Link>
          ))}
        </div>

        <LanguageSwitcher locale={resolvedLocale} label={dict.nav.language} />
      </nav>

      <div className="tpm-foundation-body">{children}</div>
    </div>
  );
}
