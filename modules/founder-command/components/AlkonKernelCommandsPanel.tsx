import type { AlkonKernelSnapshot } from "@/lib/server/alkon-kernel";

export default function AlkonKernelCommandsPanel({
  snapshot,
}: {
  snapshot: AlkonKernelSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-kernel-commands"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Kernel Commands"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Command 0-16</span>
        <h2>Kernel command chain</h2>
        <p>
          Every kernel command is private, read-only, and governed by public
          trust, Product Truth, evidence, memory, and Ahmad final authority.
        </p>
      </div>
      <div className="alkon-domain-list">
        {snapshot.commandStatuses.map((command) => (
          <div key={command.commandId} data-tone={command.status}>
            <small>{command.label}</small>
            <strong>{command.status}</strong>
            <p>{command.nextAction}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
