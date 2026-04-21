import { resolveDictionaryLocale } from "../../lib/i18n/config";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import { TradingWorkstation } from "../../modules/shell/components/TradingWorkstation";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveDictionaryLocale(locale);
  const dict = getDictionary(locale);

  return <TradingWorkstation locale={resolvedLocale} dict={dict} />;
}