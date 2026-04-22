import TradingWorkstation from "../../modules/shell/components/TradingWorkstationBridge";
import { resolveDictionaryLocale } from "../../lib/i18n/config";
import { getDictionary } from "../../lib/i18n/get-dictionary";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = resolveDictionaryLocale(requestedLocale ?? "en");
  const dict = getDictionary(locale);

  return <TradingWorkstation locale={locale} dict={dict} />;
}
