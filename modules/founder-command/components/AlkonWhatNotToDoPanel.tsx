import type { AlkonChatContext } from "@/lib/server/alkon-chat";

export default function AlkonWhatNotToDoPanel({
  context,
}: {
  context: AlkonChatContext;
}) {
  return (
    <section className="alkon-what-not-to-do-panel" aria-label="What not to do">
      <div className="alkon-rail-head">
        <span>What Not To Do</span>
        <h2>No unsafe activation</h2>
        <p>
          Local Day One is {context.localDayOneStatusLabel}. Visual gate is{" "}
          {context.visualAcceptanceLabel}.
        </p>
      </div>
      <ul className="alkon-device-list">
        {context.whatNotToDo.slice(0, 7).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
