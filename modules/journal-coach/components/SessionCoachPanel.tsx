import type { JournalCoachSnapshot } from "@/lib/server/journal-coach/types";
import DecisionReplayCard from "./DecisionReplayCard";
import JournalEntryComposer from "./JournalEntryComposer";
import JournalPromptCard from "./JournalPromptCard";

type SessionCoachPanelProps = {
  snapshot: JournalCoachSnapshot;
};

export default function SessionCoachPanel({ snapshot }: SessionCoachPanelProps) {
  return (
    <section className="tpm-session-coach-panel" aria-label="Journal and session coach foundation">
      <header>
        <span>Journal / Coach</span>
        <h2>Paper-session guidance foundation</h2>
        <p>
          Basic prompts are active for Free. Pro journal depth and VIP coaching remain planned or locked.
        </p>
      </header>

      <div className="tpm-session-coach-grid">
        {snapshot.prompts.slice(0, 4).map((prompt) => (
          <JournalPromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      <div className="tpm-session-coach-daily-grid">
        <JournalEntryComposer snapshot={snapshot} />
        <DecisionReplayCard replay={snapshot.decisionReplay} />
      </div>

      <footer>
        <span>No financial advice</span>
        <span>No trading signals</span>
        <span>No profit guarantee</span>
        <span>Pro: {snapshot.planAccess.pro}</span>
        <span>VIP: {snapshot.planAccess.vip}</span>
      </footer>
    </section>
  );
}
