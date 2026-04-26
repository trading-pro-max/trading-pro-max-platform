"use client";

import Link from "next/link";
import AuthSessionPanel from "../../auth/components/AuthSessionPanel";
import EnvironmentModeControl from "./EnvironmentModeControl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

type ShellControlsProps = {
  authTitle?: string;
  diagnosticsHref: string;
  diagnosticsLabel?: string;
  locale: string;
  settingsHref: string;
  settingsLabel?: string;
  showAuth?: boolean;
  showUtilities?: boolean;
  variant: "public" | "workspace";
};

export default function ShellControls({
  authTitle,
  diagnosticsHref,
  diagnosticsLabel = "Diagnostics",
  locale,
  settingsHref,
  settingsLabel = "Settings",
  showAuth = true,
  showUtilities = true,
  variant,
}: ShellControlsProps) {
  const authVariant = variant === "workspace" ? "topbar" : "nav";

  return (
    <div
      className={`tpm-shell-controls tpm-shell-controls-${variant}`}
      data-shell-controls={variant}
    >
      {showUtilities ? (
        <div className="tpm-shell-utility-links" aria-label="Utility links">
          <Link className="tpm-shell-utility-link" href={settingsHref}>
            {settingsLabel}
          </Link>
          <Link className="tpm-shell-utility-link" href={diagnosticsHref}>
            {diagnosticsLabel}
          </Link>
        </div>
      ) : null}

      {showAuth ? (
        <AuthSessionPanel
          variant={authVariant}
          title={authTitle ?? "Protected account access"}
        />
      ) : null}

      <ThemeSwitcher label="Theme" />
      <EnvironmentModeControl label="Adaptive Atmosphere" />
      <LanguageSwitcher locale={locale} label="Language" />
    </div>
  );
}
