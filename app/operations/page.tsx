import { getDictionary } from "../../lib/i18n/get-dictionary";
import ProductExperienceFrame from "../../modules/product/components/ProductExperienceFrame";
import FeedbackPanel from "../../modules/operations/components/FeedbackPanel";
import OperationalConsole from "../../modules/operations/components/OperationalConsole";

export default function OperationsPage() {
  const locale = "en";
  const dict = getDictionary(locale);

  return (
    <ProductExperienceFrame
      locale={locale}
      dict={dict}
      routeMode="root"
      showFeedbackDock={false}
    >
      <main className="tpm-foundation-page tpm-utility-page">
        <OperationalConsole />
        <FeedbackPanel />
      </main>
    </ProductExperienceFrame>
  );
}
