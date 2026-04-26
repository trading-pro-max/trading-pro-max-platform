# TPM Assistant Intents

The Assistant intent registry is defined in `lib/server/companion/intents.ts`. It classifies daily-use requests into allowed intents or blocked intents, then routes responses through deterministic safe templates.

## Allowed Intents

- `explain_platform_state`
- `explain_blocked_state`
- `explain_plan_access`
- `explain_account_type`
- `explain_paper_mode`
- `explain_feed_fallback`
- `explain_billing_inactive`
- `explain_live_disabled`
- `explain_real_money_blocked`
- `explain_market_context`
- `open_workspace_request`
- `guide_to_apps_platforms`
- `guide_to_support`
- `guide_to_settings`
- `guide_to_diagnostics`
- `guide_to_feedback`
- `draft_feedback`
- `journal_prompt`
- `coach_prompt`
- `session_summary`
- `learning_help`
- `personal_reality_calm`
- `personal_reality_focus`
- `personal_reality_chart_comfort`
- `personal_reality_low_motion`
- `personal_reality_static`
- `personal_reality_high_contrast`
- `personal_reality_learning`
- `personal_reality_explain_locked`
- `reset_experience`
- `explain_upgrade_path_without_billing`

Compatibility alias:

- `explain_plan_upgrade_without_billing`

## Blocked Intents

- `execute_trade`
- `enable_live`
- `enable_real_money`
- `activate_broker`
- `activate_feed`
- `activate_billing`
- `provide_signal`
- `reveal_secrets`
- `expose_alkon`
- `expose_codex`
- `bypass_auth`
- `guarantee_profit`
- `provide_win_rate`
- `fake_vip_activation`
- `fake_institutional_activation`
- `fake_billing`
- `fake_launch`
- `publish_social`
- `provide_legal_advice`
- `provide_financial_advice`

## Response Rule

Every blocked intent returns:

- blocked reason
- safe alternative
- no execution authority
- no fake unlock
- no secret exposure
- no internal governance detail for normal users

## Deterministic Test Samples

`/api/companion/context` returns deterministic sample classifications for:

- activate live trading
- use real money
- show broker secret
- guarantee profit
- what is VIP
- why billing inactive
- why Institutional future
- start me
- where is the mobile app
- how do I get support
- make the platform calmer
- bigger chart
- why locked
- low motion
- why is that area separate
- help me journal
- explain paper mode
- draft feedback

These samples are readiness evidence only. They do not create an action endpoint.
