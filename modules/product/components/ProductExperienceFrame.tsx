import Link from "next/link";
import type { ReactNode } from "react";
import { getDirection } from "../../../lib/i18n/config";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import AuthSessionPanel from "../../auth/components/AuthSessionPanel";
import { FeedbackDock } from "../../operations/components/FeedbackPanel";
import { LanguageSwitcher } from "../../shell/components/LanguageSwitcher";

type ProductExperienceFrameProps = {
  children: ReactNode;
  locale: string;
  dict: Dictionary;
  routeMode: "root" | "localized";
  showFeedbackDock?: boolean;
};

export default function ProductExperienceFrame({
  children,
  locale,
  dict,
  routeMode,
  showFeedbackDock = true,
}: ProductExperienceFrameProps) {
  const dir = getDirection(locale);
  const workspaceHref = `/${locale}`;
  const diagnosticsHref =
    routeMode === "localized" ? `/${locale}/diagnostics` : "/diagnostics";
  const operationsHref =
    routeMode === "localized" ? `/${locale}/operations` : "/operations";
  const settingsHref =
    routeMode === "localized" ? `/${locale}/settings` : "/settings";

  const navItems = [
    { href: "/", label: dict.nav.product },
    { href: workspaceHref, label: dict.nav.trade },
    { href: operationsHref, label: dict.nav.operations },
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

        <LanguageSwitcher locale={locale} label={dict.nav.language} />
        <AuthSessionPanel variant="nav" />
      </nav>

      <div className="tpm-foundation-body">{children}</div>
      {showFeedbackDock ? <FeedbackDock /> : null}
    </div>
  );
}
