import { DEFAULT_LOCALE } from "../lib/i18n/config";
import { getDictionary } from "../lib/i18n/get-dictionary";
import ProductExperienceFrame from "../modules/product/components/ProductExperienceFrame";
import PublicProductEntry from "../modules/product/components/PublicProductEntry";
import TradingWorkstation from "../modules/shell/components/TradingWorkstationBridge";

export default function HomePage() {
  const locale = DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <ProductExperienceFrame locale={locale} dict={dict} routeMode="root">
      <PublicProductEntry
        workspaceHref={`/${locale}`}
        diagnosticsHref="/diagnostics"
        settingsHref="/settings"
      />

      <section id="workspace-experience" className="tpm-product-workstation-shell">
        <TradingWorkstation locale={locale} dict={dict} showFeedbackDock={false} />
      </section>
    </ProductExperienceFrame>
  );
}
