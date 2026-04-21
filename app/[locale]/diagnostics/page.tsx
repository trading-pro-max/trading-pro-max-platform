import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { EmptyState, ErrorState, LoadingState } from "../../../modules/shell/components/UiStates";

export default async function DiagnosticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const items = [
    { label: dict.diagnostics.runtime, value: dict.common.ready },
    { label: dict.diagnostics.shell, value: dict.common.closed },
    { label: dict.diagnostics.marketLayer, value: dict.diagnostics.foundationReady },
    { label: dict.diagnostics.executionLayer, value: dict.common.paper },
    { label: dict.diagnostics.riskLayer, value: dict.common.basic },
    { label: dict.diagnostics.storage, value: dict.common.local },
  ];

  return (
    <main className="tpm-foundation-page">
      <section className="tpm-foundation-card">
        <header className="tpm-foundation-head">
          <div>
            <h1>{dict.diagnostics.title}</h1>
            <p>{dict.diagnostics.subtitle}</p>
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

      <section className="tpm-foundation-card" style={{ marginTop: 18 }}>
        <header className="tpm-foundation-head">
          <div>
            <h1>{dict.states.title}</h1>
            <p>{dict.states.subtitle}</p>
          </div>
        </header>

        <div className="tpm-ui-state-grid">
          <LoadingState
            title={dict.states.loadingTitle}
            text={dict.states.loadingText}
          />

          <EmptyState
            title={dict.states.emptyTitle}
            text={dict.states.emptyText}
          />

          <ErrorState
            title={dict.states.errorTitle}
            text={dict.states.errorText}
          />
        </div>
      </section>
    </main>
  );
}