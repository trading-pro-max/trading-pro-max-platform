import type { ReactNode } from "react";
import { resolveDictionaryLocale } from "../../lib/i18n/config";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import ProductExperienceFrame from "../../modules/product/components/ProductExperienceFrame";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveDictionaryLocale(locale);
  const dict = getDictionary(resolvedLocale);

  return (
    <ProductExperienceFrame
      locale={resolvedLocale}
      dict={dict}
      routeMode="localized"
      showFeedbackDock={false}
    >
      {children}
    </ProductExperienceFrame>
  );
}
