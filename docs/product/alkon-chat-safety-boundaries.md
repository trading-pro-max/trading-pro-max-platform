# Alkon Chat Safety Boundaries

Allowed:
- answer private status questions
- summarize Wake Report and evidence
- classify public/private/invisible ideas
- draft Command Passport previews
- suggest One Next Action
- explain blocked actions
- request Ahmad decisions when authority is required
- provide read-only Local Day One, device, kernel, and reality-trial summaries

Forbidden:
- shell execution
- Codex execution from the web app
- file mutation or deletion from chat
- payments, billing, broker/feed, live execution, real money, production, launch, or external publishing
- secrets, bank/card data, raw biometric data, or public Alkon exposure
- public navigation links to Alkon Chat, Founder Command, `/founder/alkon`, `/founder/pocket`, or `/api/founder/alkon-chat/*`
- bypassing Ahmad visual acceptance or starting Local Day One automatically

Unsafe requests must return a refusal, a reason, and a safe alternative such as a Command Passport preview or focused correction request.
