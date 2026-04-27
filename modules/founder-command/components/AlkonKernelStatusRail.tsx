import type { AlkonChatContext } from "@/lib/server/alkon-chat";

export default function AlkonKernelStatusRail({
  context,
}: {
  context: AlkonChatContext;
}) {
  const rows = [
    ["Kernel 0-16", `${context.kernel.statusLabel}; ${context.kernel.commandCount} commands`],
    ["Zero Truth", context.kernel.zeroTruthLabel],
    ["Reality Trial", context.kernel.realityTrialLabel],
    ["Evidence", context.kernel.evidenceLabel],
    ["Daily Loop", "Private operating loop active with notes"],
  ];

  return (
    <aside className="alkon-kernel-status-rail" aria-label="Alkon kernel status">
      <div className="alkon-rail-head">
        <span>Private Brain</span>
        <h2>Kernel 0-16</h2>
        <p>Command law stays private, read-only, and governed by Ahmad final authority.</p>
      </div>
      <dl className="alkon-command-facts">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="alkon-rail-truth">
        <span>Zero Truth</span>
        <p>{context.blockers[0]}</p>
      </div>
    </aside>
  );
}
