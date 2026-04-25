import Link from "next/link";
import type { ReactNode } from "react";
import { getDirection } from "../../../lib/i18n/config";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import AuthSessionPanel from "../../auth/components/AuthSessionPanel";
import ProductLogo from "../../brand/components/ProductLogo";
import { CompanionLauncher } from "../../companion/components";
import { LanguageSwitcher } from "../../shell/components/LanguageSwitcher";
import PlatformPulse from "../../shell/components/PlatformPulse";
import SwissPrecisionClock from "../../shell/components/SwissPrecisionClock";
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
  const feedbackHref = `${diagnosticsHref}#feedback`;
  const rootAnchor = (hash: string) => (routeMode === "localized" ? `/${hash}` : `/${hash}`);

  const navItems = [
    { href: "/", label: "Home" },
    { href: workspaceHref, label: "Trading Workspace" },
    { href: rootAnchor("#markets"), label: "Markets" },
    { href: rootAnchor("#plans"), label: "Plans" },
    { href: rootAnchor("#apps-platforms"), label: "Apps / Platforms" },
    { href: rootAnchor("#academy"), label: "Academy" },
    { href: rootAnchor("#community"), label: "Community" },
    { href: rootAnchor("#support"), label: "Support" },
    { href: settingsHref, label: dict.nav.settings },
    { href: diagnosticsHref, label: dict.nav.diagnostics },
  ];
  const primaryNavLabels = new Set([
    "Home",
    "Trading Workspace",
    "Markets",
    "Plans",
    "Apps / Platforms",
    "Support",
  ]);
  const primaryNavItems = navItems.filter((item) => primaryNavLabels.has(item.label));
  const secondaryNavItems = navItems.filter((item) => !primaryNavLabels.has(item.label));

  return (
    <div
      dir={dir}
      lang={locale}
      className={`tpm-foundation-frame tpm-foundation-frame-${routeMode}`}
    >
      <header className="tpm-foundation-nav-shell">
        <nav className="tpm-foundation-nav">
          <ProductLogo
            className="tpm-foundation-nav-brand"
            motionIntensity="low"
            state="paper_safe"
            subtitle={dict.shell.foundation}
            variant="nav"
          />

          <div className="tpm-foundation-nav-links">
            {primaryNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="tpm-foundation-link">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="tpm-foundation-nav-actions">
            <SwissPrecisionClock compact />
            <PlatformPulse />
            <AuthSessionPanel
              variant="nav"
              title="Protected account access"
            />
            <ThemeSwitcher label={dict.nav.theme} />
            <LanguageSwitcher locale={locale} label={dict.nav.language} />
          </div>
        </nav>

        {routeMode === "root" ? (
          <div className="tpm-foundation-secondary-nav" aria-label="Public sections">
            {secondaryNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="tpm-foundation-link">
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <main className="tpm-foundation-body">{children}</main>
      <CompanionLauncher
        diagnosticsHref={diagnosticsHref}
        feedbackHref={feedbackHref}
        locale={locale}
        settingsHref={settingsHref}
      />
    </div>
  );
}
