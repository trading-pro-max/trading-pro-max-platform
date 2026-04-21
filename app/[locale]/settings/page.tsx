import { getDictionary } from "../../../lib/i18n/get-dictionary";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const items = [
    { label: dict.settings.mode, value: dict.common.paper },
    { label: dict.settings.language, value: dict.settings.currentLanguage },
    { label: dict.settings.stateSaving, value: dict.common.enabled },
    { label: dict.settings.maxOpenTrades, value: "3" },
    { label: dict.settings.sessionLossLimit, value: "-150$" },
    { label: dict.settings.design, value: dict.settings.responsiveFirst },
  ];

  return (
    <main className="tpm-foundation-page">
      <section className="tpm-foundation-card">
        <header className="tpm-foundation-head">
          <div>
            <h1>{dict.settings.title}</h1>
            <p>{dict.settings.subtitle}</p>
          </div>
        </header>

        <div className="tpm-foundation-grid">
          {items.map((item) => (
            <div key={item.label} className="tpm-foundation-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}