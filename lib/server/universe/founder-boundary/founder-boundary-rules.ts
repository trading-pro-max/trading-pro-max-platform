import "server-only";
import type { FounderBoundaryRule } from "./types";

export function getFounderBoundaryRules(): FounderBoundaryRule[] {
  return [
    {
      id: "internal_safe_execution",
      label: "Safe internal execution",
      wording: "الكون ينفذ الأعمال الداخلية الآمنة مباشرة.",
      scope: "Audit, organize, report, validate, detect conflicts, and propose next safe action inside Ahmad's private environment.",
    },
    {
      id: "ahmad_final_authority",
      label: "Ahmad final authority",
      wording:
        "أحمد يوافق على الأمور الرسمية والقانونية والمالية والإطلاق والبروكر والاسم والقرارات النهائية.",
      scope: "Official, legal, money, launch, broker, brand, domain, irreversible, personal secrets, external accounts, and final decisions.",
    },
    {
      id: "payment_receiving_money",
      label: "Payment and receiving money",
      wording: "الدفع واستلام الأموال يتطلبان موافقة أحمد دائمًا.",
      scope: "Payments, receiving funds, payouts, withdrawals, subscriptions, pricing, banks, and payment providers.",
    },
    {
      id: "real_trading_broker",
      label: "Real trading and broker execution",
      wording: "التداول الحقيقي وتنفيذ البروكر يتطلبان موافقة أحمد دائمًا.",
      scope: "Real-money trading, live broker connection, broker API keys, real orders, and account risk changes.",
    },
    {
      id: "secrets_documents",
      label: "Secrets and private documents",
      wording:
        "الأسرار والوثائق الخاصة لا تخرج من سيطرة أحمد إلا بموافقة صريحة.",
      scope: "Private documents, secrets, sensitive reports, external document processing, and redaction removal.",
    },
    {
      id: "product_truth_override",
      label: "Product Truth override",
      wording: "الكون لا يتجاوز Product Truth.",
      scope: "Product Truth remains above automation, visuals, plans, and execution.",
    },
  ];
}
