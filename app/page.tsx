import TradingWorkstation from "../modules/shell/components/TradingWorkstationBridge";
import { resolveDictionaryLocale } from "../lib/i18n/config";
import { getDictionary } from "../lib/i18n/get-dictionary";

export default function LocalHomePage() {
  const locale = resolveDictionaryLocale("en");
  const dict = getDictionary(locale);

  return <TradingWorkstation locale={locale} dict={dict} />;
}
