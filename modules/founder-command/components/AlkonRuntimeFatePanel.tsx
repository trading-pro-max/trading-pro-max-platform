import type { AlkonRuntimeSnapshot } from "@/lib/server/alkon-runtime";

export default function AlkonRuntimeFatePanel({
  snapshot,
}: {
  snapshot: AlkonRuntimeSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Next Fate</span>
        <h2>Safe recommendations only</h2>
        <p>
          Next Fate recommends monitoring, review, draft work, restriction, or
          black-hole isolation. It never executes deletion or external action.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.nextSafeFates.map((fate, index) => (
          <li key={`${fate.fate}-${index}`}>
            <strong>{fate.fate}</strong>
            <span>{fate.nextSafeAction}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
