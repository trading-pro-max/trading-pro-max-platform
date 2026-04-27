import type { AlkonChatResponse } from "@/lib/server/alkon-chat";

type ResponseProof = {
  proofId: string;
  label: string;
  response: AlkonChatResponse;
};

export default function AlkonChatMessageList({
  responses,
}: {
  responses: ResponseProof[];
}) {
  return (
    <div className="alkon-chat-message-list" aria-label="Alkon response previews">
      {responses.map(({ proofId, label, response }) => (
        <article
          key={proofId}
          className="alkon-chat-message"
          data-chat-proof={proofId}
        >
          <div className="alkon-chat-message-head">
            <span>{label}</span>
            <strong>{response.decision.replaceAll("_", " ")}</strong>
          </div>
          <p>{response.response}</p>
          <div className="alkon-chat-section-grid">
            {response.sections.slice(0, 4).map((section) => (
              <div key={`${proofId}-${section.title}`} data-tone={section.tone ?? "default"}>
                <span>{section.title}</span>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
