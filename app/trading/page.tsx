import { DEFAULT_LOCALE } from "../../lib/i18n/config";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import TradingWorkstation from "../../modules/shell/components/TradingWorkstationBridge";

export const metadata = {
  title: "Pro Max Trading | Trading Workspace",
  description:
    "The canonical paper-safe Pro Max Trading workspace inside Pro Max Center.",
};

export default function TradingPage() {
  const locale = DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return <TradingWorkstation locale={locale} dict={dict} />;
}
