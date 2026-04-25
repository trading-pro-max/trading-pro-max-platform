import type { FounderLocalCommandSnapshot } from "../types";

type FounderNextActionsPanelProps = {
  snapshot: FounderLocalCommandSnapshot;
};

export default function FounderNextActionsPanel({
  snapshot,
}: FounderNextActionsPanelProps) {
  return (
    <section className="tpm-founder-local-panel tpm-founder-local-panel-wide">
      <header>
        <span>Next safe actions</span>
        <h3>Proceed locally, keep activation blocked</h3>
      </header>
      <div className="tpm-founder-local-split-list">
        <article>
          <h4>Do next</h4>
          <ul>
            {snapshot.nextSafeActions.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Do not do</h4>
          <ul>
            {snapshot.whatNotToDoToday.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
