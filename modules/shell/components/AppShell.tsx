import type { ReactNode } from "react";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import PrivateFounderShell from "./PrivateFounderShell";
import PublicAppShell from "./PublicAppShell";

export type ShellMode = "public" | "workspace" | "founder_private";

type AppShellProps = {
  checkedAt?: string;
  children: ReactNode;
  dict?: Dictionary;
  locale?: string;
  mode: ShellMode;
  routeMode?: "root" | "localized";
};

export default function AppShell({
  checkedAt,
  children,
  dict,
  locale = "en",
  mode,
  routeMode = "root",
}: AppShellProps) {
  if (mode === "public" && dict) {
    return (
      <PublicAppShell dict={dict} locale={locale} routeMode={routeMode}>
        {children}
      </PublicAppShell>
    );
  }

  if (mode === "founder_private") {
    return (
      <PrivateFounderShell checkedAt={checkedAt}>
        {children}
      </PrivateFounderShell>
    );
  }

  return <>{children}</>;
}
