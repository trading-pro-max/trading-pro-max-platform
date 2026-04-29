import type { AlKawnDesktopReport } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnReportCenter({ reports }: { reports: AlKawnDesktopReport[] }) {
  return (
    <section className={styles.panel} aria-label="report center">
      <div className={styles.sectionTitle}>
        <span>Report Center</span>
        <h2>Report center</h2>
      </div>
      {reports.map((report) => (
        <article key={report.id}>
          <strong>{report.title}</strong>
          <small>{report.path}</small>
          <em>{report.status}: {report.summary}</em>
        </article>
      ))}
    </section>
  );
}
