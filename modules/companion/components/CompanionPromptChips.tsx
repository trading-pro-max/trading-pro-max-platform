import type { TPMCompanionPrompt } from "../types";

type CompanionPromptChipsProps = {
  activePromptId: string;
  onSelectPrompt: (promptId: string) => void;
  prompts: TPMCompanionPrompt[];
};

export default function CompanionPromptChips({
  activePromptId,
  onSelectPrompt,
  prompts,
}: CompanionPromptChipsProps) {
  return (
    <div className="tpm-companion-prompt-row" role="toolbar" aria-label="Assistant guided prompts">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          type="button"
          className={activePromptId === prompt.id ? "active" : undefined}
          aria-pressed={activePromptId === prompt.id}
          onClick={() => onSelectPrompt(prompt.id)}
        >
          {prompt.label}
        </button>
      ))}
    </div>
  );
}
