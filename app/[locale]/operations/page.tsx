import FeedbackPanel from "../../../modules/operations/components/FeedbackPanel";
import OperationalConsole from "../../../modules/operations/components/OperationalConsole";

export default function LocaleOperationsPage() {
  return (
    <main className="tpm-foundation-page tpm-utility-page">
      <OperationalConsole />
      <FeedbackPanel />
    </main>
  );
}
