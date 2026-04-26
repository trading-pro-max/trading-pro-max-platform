import { resolveLocale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import ProductExperienceFrame from "../../../modules/product/components/ProductExperienceFrame";
import { PlatformSettingsSurface } from "../../../modules/shell/components/PlatformUtilitySurfaces";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const dict = getDictionary(resolvedLocale);

  return (
    <ProductExperienceFrame
      locale={resolvedLocale}
      dict={dict}
      routeMode="localized"
    >
      <PlatformSettingsSurface locale={resolvedLocale} dict={dict} />
    </ProductExperienceFrame>
  );
}
