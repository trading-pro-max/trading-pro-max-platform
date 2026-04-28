import type { BrandClearanceSnapshot } from "@/lib/server/brand-clearance";

export default function BrandSearchTasksPanel({
  snapshot,
}: {
  snapshot: BrandClearanceSnapshot;
}) {
  const firstTasks = snapshot.trademarkSearchTasks.slice(0, 4);

  return (
    <article className="tpm-founder-card brand-search-tasks-panel">
      <span>Search Tasks</span>
      <h3>{snapshot.trademarkSearchTasks.length + snapshot.domainSearchTasks.length} manual tasks</h3>
      <ul>
        {firstTasks.map((task) => (
          <li key={task.id}>
            {task.registry}: {task.status.replaceAll("_", " ")}
          </li>
        ))}
      </ul>
      <small>No external calls, no scraping, no purchase, no payment.</small>
    </article>
  );
}
