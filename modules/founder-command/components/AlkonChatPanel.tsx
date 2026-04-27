import type { AlkonSovereignCommandInterfaceSnapshot } from "@/lib/server/alkon-chat";
import AlkonChatComposer from "./AlkonChatComposer";
import AlkonChatMessageList from "./AlkonChatMessageList";

export default function AlkonChatPanel({
  snapshot,
}: {
  snapshot: AlkonSovereignCommandInterfaceSnapshot;
}) {
  return (
    <section
      id="alkon-chat"
      className="alkon-chat-panel"
      data-proof-section="alkon-ask-alkon-area"
      aria-label="Ask Alkon command mind"
    >
      <div className="alkon-chat-title-row">
        <div>
          <span>Command Mind</span>
          <h2>Ask Alkon</h2>
          <p>
            Ahmad speaks. Alkon judges from Kernel, Zero Truth, Wake Report,
            Evidence, Memory, devices, and Local Day One gates.
          </p>
        </div>
        <div className="alkon-chat-state">
          <span>Read-only</span>
          <strong>No execution</strong>
        </div>
      </div>

      <AlkonChatMessageList
        responses={[
          {
            proofId: "status-response",
            label: "Truth now",
            response: snapshot.statusResponse,
          },
          {
            proofId: "next-action-response",
            label: "One next action",
            response: snapshot.nextActionResponse,
          },
          {
            proofId: "unsafe-request-blocked",
            label: "Unsafe request blocked",
            response: snapshot.unsafeRequestResponse,
          },
        ]}
      />
      <AlkonChatComposer promptChips={snapshot.promptChips} />
    </section>
  );
}
