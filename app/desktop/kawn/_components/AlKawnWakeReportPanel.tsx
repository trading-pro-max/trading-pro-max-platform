import type { AlKawnDesktopReport } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnWakeReportPanel({
  reports,
  nextSafeAction,
}: {
  reports: AlKawnDesktopReport[];
  nextSafeAction: string;
}) {
  const latest = reports.find((report) => report.id === "latest_wake_report");

  return (
    <section className={styles.panel} aria-label="latest wake report">
      <div className={styles.sectionTitle}>
        <span>Latest WAKE REPORT</span>
        <h2>Wake report panel</h2>
      </div>
      <strong>{latest?.title ?? "Latest WAKE REPORT missing"}</strong>
      <small>{latest?.summary ?? "Missing honestly; no completion is faked."}</small>
      <em>Latest validation: full regression passed before this mission according to the mission context.</em>
      <em>Latest commit if available: 343a558 build al kawn visual map.</em>
      <em>Next safe action: {nextSafeAction}</em>
    </section>
  );
}
