# Al-Kawn Command-First Real Execution MVP

## Definition

This MVP makes `/desktop/kawn` a real local command-first surface. Ahmad can type a command, and الكون deterministically classifies it, shows حكم التنفيذ, performs safe internal local execution when supported, shows الدليل, shows التقرير, and returns الخطوة التالية الوحيدة.

## Supported Commands

1. ماذا تستطيع أن تفعل؟
2. اشرح لي ما أراه
3. افحص الكون
4. رتب يومي
5. نفذ دورة داخلية آمنة
6. اعرض الخطوة التالية
7. اعرض Product Truth
8. اعرض حالة Local Day One

## Classification

Every command receives one verdict:

- execute_internal_now
- prepare_internal_report
- requires_ahmad_money_decision
- requires_ahmad_external_decision
- requires_ahmad_legal_decision
- blocked_product_truth
- blocked_secret_exposure
- needs_clarification
- unsupported_yet

## Internal Execution Only

The MVP uses local deterministic logic. It does not call external AI, external accounts, cloud services, email, calendar, drive, bank, broker, payment providers, or public publishing systems.

Safe commands can summarize capabilities, explain the screen, show Product Truth, show Local Day One state, organize a local daily plan, or run a deterministic safe internal cycle summary.

## Gates

- Product Truth يحكم كل تنفيذ.
- المال الحقيقي بيد أحمد فقط.
- Legal decisions require Ahmad.
- External decisions require Ahmad.
- Secret exposure is blocked.
- Local Day One لم يبدأ بعد.

## Real Now

- Command input is live in `/desktop/kawn`.
- Quick commands are clickable.
- Classification and verdict update locally.
- Evidence, report, and one next action update locally.
- `reports/command-execution/al-kawn-command-execution-latest.md` documents the static safe report path.

## Future-Gated

Runtime report writing, command history persistence, richer local automations, external integrations, money execution, legal execution, broker execution, public launch, and Local Day One start remain future-gated.
