import Link from "next/link";
import type { ReactNode } from "react";
import { getDirection } from "../../../lib/i18n/config";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import AuthSessionPanel from "../../auth/components/AuthSessionPanel";
import { LanguageSwitcher } from "../../shell/components/LanguageSwitcher";
import { ThemeSwitcher } from "../../shell/components/ThemeSwitcher";

type ProductExperienceFrameProps = {
  children: ReactNode;
  locale: string;
  dict: Dictionary;
  routeMode: "root" | "localized";
};

export default function ProductExperienceFrame({
  children,
  locale,
  dict,
  routeMode,
}: ProductExperienceFrameProps) {
  const dir = getDirection(locale);
  const workspaceHref = `/${locale}`;
  const diagnosticsHref =
    routeMode === "localized" ? `/${locale}/diagnostics` : "/diagnostics";
  const settingsHref =
    routeMode === "localized" ? `/${locale}/settings` : "/settings";

  const navItems = [
    { href: "/", label: dict.nav.product },
    { href: workspaceHref, label: dict.nav.trade },
    { href: diagnosticsHref, label: dict.nav.diagnostics },
    { href: settingsHref, label: dict.nav.settings },
  ];

  return (
    <div dir={dir} lang={locale} className="tpm-foundation-frame">
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

        <div className="tpm-foundation-nav-actions">
          <AuthSessionPanel
            variant="nav"
            title="Protected account access"
          />
          <ThemeSwitcher label={dict.nav.theme} />
          <LanguageSwitcher locale={locale} label={dict.nav.language} />
        </div>
      </nav>

      <div className="tpm-foundation-body">{children}</div>
    </div>
  );
}
