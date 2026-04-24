import type { ReactNode } from "react";
import { resolveLocale } from "../../lib/i18n/config";
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
  const resolvedLocale = resolveLocale(locale);
  const dict = getDictionary(resolvedLocale);

  return (
    <ProductExperienceFrame
      locale={resolvedLocale}
      dict={dict}
      routeMode="localized"
    >
      {children}
    </ProductExperienceFrame>
  );
}
