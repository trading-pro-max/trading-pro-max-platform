import type { TPMCompanionMessage, TPMCompanionPrompt } from "../types";
import CompanionPromptChips from "./CompanionPromptChips";

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

function roleLabel(role: TPMCompanionMessage["role"]) {
  if (role === "user") return "You";
  if (role === "system") return "Platform truth";
  return "TPM Assistant";
}

export default function CompanionMessageList({
  activePromptId,
  messages,
  onSelectPrompt,
  prompts,
}: CompanionMessageListProps) {
  return (
    <div className="tpm-companion-message-stack">
      <CompanionPromptChips
        activePromptId={activePromptId}
        onSelectPrompt={onSelectPrompt}
        prompts={prompts}
      />

      <div className="tpm-companion-message-list">
        {messages.map((message) => (
          <article
            key={message.id}
            className="tpm-companion-message"
            data-tone={messageTone(message.state)}
          >
            <span>{roleLabel(message.role)}</span>
            <strong>{message.title}</strong>
            <p>{message.body}</p>
            {message.safeNextStep ? <small>{message.safeNextStep}</small> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
