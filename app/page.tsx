import { DEFAULT_LOCALE } from "../lib/i18n/config";
import { getDictionary } from "../lib/i18n/get-dictionary";
import ProductExperienceFrame from "../modules/product/components/ProductExperienceFrame";
import PublicProductEntry from "../modules/product/components/PublicProductEntry";

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
    </ProductExperienceFrame>
  );
}
