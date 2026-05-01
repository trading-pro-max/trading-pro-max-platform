import type {
  AlKawnCommandExecutionReport,
  AlKawnCommandExecutionResult,
} from "@/lib/server/universe/command-execution";
import styles from "../../al-kawn-desktop.module.css";

export function AlKawnCommandReportPanel({
  execution,
  report,
}: {
  execution: AlKawnCommandExecutionResult;
  report: AlKawnCommandExecutionReport;
}) {
  return (
    <article className={styles.commandFlowCard}>
      <span>التقرير</span>
      <strong>{report.summary}</strong>
      <small>Mode: {execution.executionMode}</small>
      <small>Report: {execution.reportPath}</small>
      <small>Runtime write: {report.wroteRuntimeFile ? "yes" : "no"}</small>
      <ul>
        {execution.responseLines.map((line) => (
          <li key={`command-report-line-${line}`}>{line}</li>
        ))}
      </ul>
    </article>
  );
}
