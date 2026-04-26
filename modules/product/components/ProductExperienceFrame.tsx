import type { ReactNode } from "react";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import PublicAppShell from "../../shell/components/PublicAppShell";

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
  return (
    <PublicAppShell dict={dict} locale={locale} routeMode={routeMode}>
      {children}
    </PublicAppShell>
  );
}
