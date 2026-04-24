import { resolveLocale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { PlatformDiagnosticsSurface } from "../../../modules/shell/components/PlatformUtilitySurfaces";

export default async function DiagnosticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const dict = getDictionary(resolvedLocale);

  return <PlatformDiagnosticsSurface locale={resolvedLocale} dict={dict} />;
}
