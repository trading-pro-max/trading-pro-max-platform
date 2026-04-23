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
        <div className="tpm-foundation-card tpm-product-workstation-head">
          <div>
            <span className="tpm-product-kicker">Default evaluation workspace</span>
            <h2>The mature workstation remains visible under the public product layer.</h2>
          </div>
          <p>
            External evaluators can move directly from restrained product framing into the
            full operator workstation without losing paper-only, fallback-first, or blocked
            live-execution truth.
          </p>
        </div>

        <TradingWorkstation locale={locale} dict={dict} />
      </section>
    </ProductExperienceFrame>
  );
}
