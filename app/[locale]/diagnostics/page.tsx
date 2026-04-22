import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { PlatformDiagnosticsSurface } from "../../../modules/shell/components/PlatformUtilitySurfaces";

export default async function DiagnosticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <PlatformDiagnosticsSurface locale={locale} dict={dict} />;
}
