import type { AlkonGenesisSnapshot } from "@/lib/server/alkon-genesis";

export default function AlkonGenesisGatesPanel({
  snapshot,
}: {
  snapshot: AlkonGenesisSnapshot;
}) {
  const firstReport = snapshot.reports[0];

  return (
    <section className="tpm-founder-panel" data-private-genesis-gates="true">
      <div className="tpm-founder-panel-head">
        <span>Genesis Gates</span>
        <h2>Meaning to birth gate</h2>
        <p>
          Meaning, human need, market, law, treasury, security, prototype,
          proof, Prime World protection, Founder, and birth gates decide every
          seed fate.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {firstReport.gates.map((gate) => (
          <li key={gate.gateId}>
            <span>{gate.gateId}</span>
            <strong>{gate.status}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
