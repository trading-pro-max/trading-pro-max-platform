import { getDictionary } from "../../lib/i18n/get-dictionary";
import ProductExperienceFrame from "../../modules/product/components/ProductExperienceFrame";
import { PlatformDiagnosticsSurface } from "../../modules/shell/components/PlatformUtilitySurfaces";

export default function DiagnosticsPage() {
  const locale = "en";
  const dict = getDictionary(locale);

  return (
    <ProductExperienceFrame locale={locale} dict={dict} routeMode="root">
      <PlatformDiagnosticsSurface locale={locale} dict={dict} />
    </ProductExperienceFrame>
  );
}
