import "server-only";
import type {
  FounderBoundaryAction,
  FounderBoundaryActionCategory,
} from "./types";

const neverAloneCatalog: Record<
  Exclude<FounderBoundaryActionCategory, "safe_internal_work">,
  string[]
> = {
  money_payment_receiving_funds: [
    "payment activation",
    "Stripe / PayPal / bank integration",
    "receiving customer money",
    "payouts",
    "withdrawals",
    "invoices",
    "subscription activation",
    "pricing activation",
    "bank account linking",
    "storing payment credentials",
  ],
  real_trading_broker: [
    "real-money trading",
    "live broker connection",
    "broker API key activation",
    "real order execution",
    "buy/sell real order",
    "live execution automation",
    "changing real account risk",
    "enabling broker feed claims",
  ],
  legal_official_claims: [
    "FINMA approval claim",
    "licensed claim",
    "regulated claim",
    "Swiss-certified claim",
    "legal 100% approval",
    "investment advice claim",
    "guaranteed profit",
    "risk-free claim",
    "official legal publication",
  ],
  public_launch_customers: [
    "public launch",
    "public onboarding",
    "public website activation",
    "public app release",
    "customer registration",
    "customer money handling",
    "public Universe exposure",
    "public ALKON exposure",
  ],
  brand_domains_ownership: [
    "final brand adoption",
    "rename",
    "trademark filing",
    "domain purchase",
    "domain transfer",
    "global ownership claim",
    "exclusivity claim",
  ],
  personal_data_secrets_documents: [
    "upload personal documents externally",
    "store secrets in Git",
    "commit API keys",
    "share private documents",
    "expose sensitive reports",
    "connect Gmail / Calendar / Drive without approval",
    "process private documents externally",
    "remove redaction",
  ],
  external_accounts_integrations: [
    "bank accounts",
    "payment providers",
    "brokers",
    "app stores",
    "Apple Developer",
    "Google Play Console",
    "hosting production",
    "domain registrar",
    "GitHub production secrets",
    "external calendar/email/drive",
  ],
  irreversible_destructive_actions: [
    "delete database",
    "delete protected reports",
    "delete protected routes",
    "force push",
    "production reset",
    "disable Product Truth",
    "remove Protection Core",
    "remove audit logs",
    "disable kill switch",
    "remove security gates",
  ],
  final_founder_decisions: [
    "accept final product",
    "accept visual identity",
    "start Local Day One",
    "start public launch",
    "approve legal state",
    "approve money state",
    "approve broker state",
    "approve brand state",
    "approve global expansion",
  ],
};

function toActionId(label: string) {
  return label.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase();
}

function categoryReason(category: FounderBoundaryActionCategory) {
  switch (category) {
    case "money_payment_receiving_funds":
      return "Money, payment, receiving funds, payouts, bank, pricing, and payment credentials always require Ahmad.";
    case "real_trading_broker":
      return "Real trading, real orders, broker access, broker keys, and broker/feed claims always require Ahmad.";
    case "legal_official_claims":
      return "Legal, regulatory, licensing, FINMA, investment advice, performance, and risk claims always require Ahmad and qualified review.";
    case "public_launch_customers":
      return "Public launch, public onboarding, customer handling, and public Universe/ALKON exposure always require Ahmad.";
    case "brand_domains_ownership":
      return "Brand adoption, renaming, trademarks, domains, ownership, and exclusivity always require Ahmad.";
    case "personal_data_secrets_documents":
      return "Personal documents, secrets, private reports, and external processing always require explicit Ahmad approval.";
    case "external_accounts_integrations":
      return "External accounts and production integrations always require Ahmad approval.";
    case "irreversible_destructive_actions":
      return "Irreversible deletion, force push, production reset, security removal, and audit removal always require Ahmad.";
    case "final_founder_decisions":
      return "Final founder acceptance and strategic decisions can never be delegated.";
    default:
      return "Safe internal work only.";
  }
}

export function getNeverAloneActions(): FounderBoundaryAction[] {
  return Object.entries(neverAloneCatalog).flatMap(([category, labels]) =>
    labels.map((label) => ({
      id: `never_${toActionId(label)}`,
      label,
      category: category as Exclude<FounderBoundaryActionCategory, "safe_internal_work">,
      decision: "never_alone_blocked_until_ahmad",
      reason: categoryReason(category as FounderBoundaryActionCategory),
      productTruthImpact: "Requires Ahmad approval and remains blocked unless Product Truth, legal, safety, and evidence gates allow the action.",
    }))
  );
}
