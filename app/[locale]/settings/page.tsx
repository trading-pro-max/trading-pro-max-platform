import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { PlatformSettingsSurface } from "../../../modules/shell/components/PlatformUtilitySurfaces";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <PlatformSettingsSurface locale={locale} dict={dict} />;
}
