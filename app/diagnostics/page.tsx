const DIAGNOSTIC_ITEMS = [
  { label: "Runtime", value: "جاهز" },
  { label: "Shell", value: "مغلق" },
  { label: "Market Layer", value: "هيكل جاهز" },
  { label: "Execution Layer", value: "ورقي" },
  { label: "Risk Layer", value: "أساسي" },
  { label: "Storage", value: "محلي" },
];

export default function DiagnosticsPage() {
  return (
    <main className="tpm-foundation-page">
      <section className="tpm-foundation-card">
        <header className="tpm-foundation-head">
          <div>
            <h1>التشخيص</h1>
            <p>صفحة الهيكل الفني الأساسية للمنصة.</p>
          </div>
        </header>

        <div className="tpm-foundation-grid">
          {DIAGNOSTIC_ITEMS.map((item) => (
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