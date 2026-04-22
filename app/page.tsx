import TradingWorkstation from "../modules/shell/components/TradingWorkstationBridge";
import { resolveDictionaryLocale } from "../lib/i18n/config";
import { getDictionary } from "../lib/i18n/get-dictionary";

export default async function LocalHomePage() {
  const locale = resolveDictionaryLocale("en");
  const dict = await getDictionary(locale as any);

  return <TradingWorkstation locale={locale as any} dict={dict} />;
}
