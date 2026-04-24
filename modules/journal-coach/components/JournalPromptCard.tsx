import type { JournalCoachPrompt } from "@/lib/server/journal-coach/types";

type JournalPromptCardProps = {
  prompt: JournalCoachPrompt;
};

export default function JournalPromptCard({ prompt }: JournalPromptCardProps) {
  return (
    <article className="tpm-journal-prompt-card" data-state={prompt.state}>
      <div>
        <span>{prompt.state}</span>
        <h3>{prompt.title}</h3>
      </div>
      <p>{prompt.prompt}</p>
      <small>{prompt.safeReason}</small>
    </article>
  );
}
