import type { TPMCompanionMessage, TPMCompanionPrompt } from "../types";

type CompanionMessageListProps = {
  activePromptId: string;
  messages: TPMCompanionMessage[];
  onSelectPrompt: (promptId: string) => void;
  prompts: TPMCompanionPrompt[];
};

function messageTone(state: TPMCompanionMessage["state"]) {
  if (state === "blocked") return "blocked";
  if (state === "planned") return "planned";
  if (state === "fallback") return "fallback";
  return "ready";
}

export default function CompanionMessageList({
  activePromptId,
  messages,
  onSelectPrompt,
  prompts,
}: CompanionMessageListProps) {
  return (
    <div className="tpm-companion-message-stack">
      <div className="tpm-companion-prompt-row" role="toolbar" aria-label="Companion guided prompts">
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

      <div className="tpm-companion-message-list">
        {messages.map((message) => (
          <article
            key={message.id}
            className="tpm-companion-message"
            data-tone={messageTone(message.state)}
          >
            <span>{message.role === "companion" ? "TPM Companion" : "Platform truth"}</span>
            <strong>{message.title}</strong>
            <p>{message.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
