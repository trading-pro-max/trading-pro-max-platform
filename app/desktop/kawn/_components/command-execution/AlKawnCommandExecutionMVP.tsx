"use client";

import { useMemo, useState } from "react";
import {
  executeSafeInternalCommand,
  getCommandExecutionReport,
  getCommandIntentExamples,
} from "@/lib/server/universe/command-execution";
import { AlKawnCommandEvidencePanel } from "./AlKawnCommandEvidencePanel";
import { AlKawnCommandInput } from "./AlKawnCommandInput";
import { AlKawnCommandNextActionPanel } from "./AlKawnCommandNextActionPanel";
import { AlKawnCommandQuickActions } from "./AlKawnCommandQuickActions";
import { AlKawnCommandReportPanel } from "./AlKawnCommandReportPanel";
import { AlKawnCommandUnderstanding } from "./AlKawnCommandUnderstanding";
import { AlKawnCommandVerdictPanel } from "./AlKawnCommandVerdictPanel";
import styles from "../../al-kawn-desktop.module.css";

const DEFAULT_COMMAND = "اشرح لي ما أراه";

export function AlKawnCommandExecutionMVP() {
  const [commandText, setCommandText] = useState(DEFAULT_COMMAND);
  const quickActions = getCommandIntentExamples().filter((intent) => intent.quickAction);

  const execution = useMemo(
    () => executeSafeInternalCommand(commandText),
    [commandText],
  );
  const report = useMemo(
    () => getCommandExecutionReport(commandText),
    [commandText],
  );

  return (
    <section
      className={styles.commandMvp}
      data-testid="al-kawn-command-execution-mvp"
      aria-label="Al-Kawn command-first real execution MVP"
      dir="rtl"
    >
      <div className={styles.commandMvpHeader}>
        <span>Command-First Real Execution MVP</span>
        <h2>اكتب أمرك للكون الآن.</h2>
        <p>Product Truth يحكم كل تنفيذ.</p>
        <p>المال الحقيقي بيد أحمد فقط.</p>
        <p>Local Day One لم يبدأ بعد.</p>
      </div>

      <AlKawnCommandInput
        commandText={commandText}
        onCommandTextChange={setCommandText}
        onSubmitCommand={setCommandText}
      />

      <AlKawnCommandQuickActions
        actions={quickActions}
        onSelectCommand={setCommandText}
      />

      <div className={styles.commandMvpFlow}>
        <AlKawnCommandUnderstanding classification={execution.classification} />
        <AlKawnCommandVerdictPanel classification={execution.classification} />
        <AlKawnCommandEvidencePanel evidence={execution.evidence} />
        <AlKawnCommandReportPanel execution={execution} report={report} />
        <AlKawnCommandNextActionPanel nextAction={execution.nextAction} />
      </div>

      <small className={styles.compatibilityProof}>
        ط§ظƒطھط¨ ظ…ط§ طھط±ظٹط¯ ظ…ظ† ط§ظ„ظƒظˆظ† ط§ظ„ط¢ظ†
      </small>
      <small className={styles.compatibilityProof}>ط§ط´ط±ط­ ظ„ظٹ ظ…ط§ ط£ط±ط§ظ‡</small>
    </section>
  );
}
