import { resolveDictionaryLocale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { PlatformSettingsSurface } from "../../../modules/shell/components/PlatformUtilitySurfaces";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveDictionaryLocale(locale);
  const dict = getDictionary(resolvedLocale);

  return <PlatformSettingsSurface locale={resolvedLocale} dict={dict} />;
}
