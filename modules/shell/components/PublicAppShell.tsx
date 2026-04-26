import type { ReactNode } from "react";
import Link from "next/link";
import { getDirection } from "../../../lib/i18n/config";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import ProductLogo from "../../brand/components/ProductLogo";
import { CompanionLauncher } from "../../companion/components";
import ShellControls from "./ShellControls";
import ShellNavigation, { type ShellNavigationItem } from "./ShellNavigation";
import ShellStatusBadges, { PUBLIC_SHELL_STATUS_BADGES } from "./ShellStatusBadges";
import SwissPrecisionClock from "./SwissPrecisionClock";
import PlatformPulse from "./PlatformPulse";

type PublicAppShellProps = {
  children: ReactNode;
  dict: Dictionary;
  locale: string;
  routeMode: "root" | "localized";
};

function publicSectionHref(routeMode: PublicAppShellProps["routeMode"], hash: string) {
  return routeMode === "localized" ? `/${hash}` : `/${hash}`;
}

export default function PublicAppShell({
  children,
  dict,
  locale,
  routeMode,
}: PublicAppShellProps) {
  const dir = getDirection(locale);
  const workspaceHref = `/${locale}`;
  const diagnosticsHref =
    routeMode === "localized" ? `/${locale}/diagnostics` : "/diagnostics";
  const settingsHref =
    routeMode === "localized" ? `/${locale}/settings` : "/settings";
  const feedbackHref = `${diagnosticsHref}#feedback`;
  const primaryNavItems: ShellNavigationItem[] = [
    { href: "/", label: "Home" },
    { href: workspaceHref, label: "Trading Workspace" },
    { href: publicSectionHref(routeMode, "#markets"), label: "Markets" },
    { href: publicSectionHref(routeMode, "#plans"), label: "Plans" },
    { href: publicSectionHref(routeMode, "#apps-platforms"), label: "Apps / Platforms" },
    { href: publicSectionHref(routeMode, "#academy"), label: "Academy" },
    { href: publicSectionHref(routeMode, "#community"), label: "Community" },
    { href: publicSectionHref(routeMode, "#support"), label: "Support" },
  ];

  return (
    <div
      dir={dir}
      lang={locale}
      className={`tpm-app-shell tpm-public-shell tpm-public-shell-${routeMode} tpm-foundation-frame tpm-foundation-frame-${routeMode}`}
      data-shell-mode="public"
    >
      <header className="tpm-foundation-nav-shell tpm-public-shell-header">
        <nav className="tpm-foundation-nav tpm-shell-nav-row" aria-label="Pro Max Trading public navigation">
          <Link
            className="tpm-shell-logo-home-link"
            href="/"
            aria-label="Pro Max home"
          >
            <ProductLogo
              className="tpm-shell-logo tpm-foundation-nav-brand"
              motionIntensity="low"
              state="paper_safe"
              subtitle={dict.shell.foundation}
              variant="nav"
            />
          </Link>

          <ShellNavigation
            items={primaryNavItems}
            label="Public product sections"
            variant="public"
          />

          <ShellControls
            authTitle="Protected account access"
            diagnosticsHref={diagnosticsHref}
            diagnosticsLabel={dict.nav.diagnostics}
            locale={locale}
            settingsHref={settingsHref}
            settingsLabel={dict.nav.settings}
            variant="public"
          />
        </nav>

        <div className="tpm-public-shell-status-row">
          <ShellStatusBadges items={PUBLIC_SHELL_STATUS_BADGES} variant="public" />
          <div className="tpm-shell-runtime-status">
            <SwissPrecisionClock compact />
            <PlatformPulse />
          </div>
        </div>
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
