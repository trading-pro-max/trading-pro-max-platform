import { getDictionary } from "../../lib/i18n/get-dictionary";
import ProductExperienceFrame from "../../modules/product/components/ProductExperienceFrame";
import { PlatformSettingsSurface } from "../../modules/shell/components/PlatformUtilitySurfaces";

export default function SettingsPage() {
  const locale = "en";
  const dict = getDictionary(locale);

  return (
    <ProductExperienceFrame locale={locale} dict={dict} routeMode="root">
      <PlatformSettingsSurface locale={locale} dict={dict} />
    </ProductExperienceFrame>
  );
}
