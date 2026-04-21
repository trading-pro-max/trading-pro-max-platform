const SETTINGS_ITEMS = [
  { label: "الوضع", value: "Paper Trading" },
  { label: "اللغة", value: "العربية" },
  { label: "حفظ الحالة", value: "مفعل" },
  { label: "حد الصفقات المفتوحة", value: "3" },
  { label: "حد خسارة الجلسة", value: "-150$" },
  { label: "التصميم", value: "Responsive-First" },
];

export default function SettingsPage() {
  return (
    <main className="tpm-foundation-page">
      <section className="tpm-foundation-card">
        <header className="tpm-foundation-head">
          <div>
            <h1>الإعدادات</h1>
            <p>هيكل الإعدادات الأساسي للمنصة.</p>
          </div>
        </header>

        <div className="tpm-foundation-grid">
          {SETTINGS_ITEMS.map((item) => (
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