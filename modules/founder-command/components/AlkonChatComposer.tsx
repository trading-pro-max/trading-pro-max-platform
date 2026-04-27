export default function AlkonChatComposer({
  promptChips,
}: {
  promptChips: string[];
}) {
  return (
    <div className="alkon-chat-composer" aria-label="Read-only Ask Alkon composer">
      <div className="alkon-chat-input-preview" aria-label="Ask Alkon preview input">
        Ask Alkon: What is the truth now?
      </div>
      <div className="alkon-chat-prompt-row" aria-label="Ask Alkon prompt chips">
        {promptChips.map((prompt) => (
          <span key={prompt}>{prompt}</span>
        ))}
      </div>
      <p>
        Preview-only. Alkon answers, judges, drafts, and prepares. It does not
        execute shell, Codex, payments, live trading, billing, broker/feed, launch,
        or external calls.
      </p>
    </div>
  );
}
