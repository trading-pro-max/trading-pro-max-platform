import TradingWorkstation from "../../modules/shell/components/TradingWorkstationBridge";
import { resolveDictionaryLocale } from "../../lib/i18n/config";
import { getDictionary } from "../../lib/i18n/get-dictionary";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string }> | { locale?: string };
}) {
  const resolved = await Promise.resolve(params as any);
  const locale = resolveDictionaryLocale((resolved as any)?.locale ?? "en");
  const dict = await getDictionary(locale as any);

  return <TradingWorkstation locale={locale as any} dict={dict} />;
}
