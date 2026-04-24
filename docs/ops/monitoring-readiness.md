# Trading Pro Max Monitoring Readiness

Monitoring is a production readiness contract, not a simulated service.

## Required Configuration

- `TPM_MONITORING_PROVIDER` or `TPM_OPS_EXTERNAL_MONITOR_PROVIDER`
- `TPM_MONITORING_ENDPOINT` or `TPM_OPS_EXTERNAL_MONITOR_URL`
- `TPM_MONITORING_KEY` or `TPM_OPS_EXTERNAL_MONITOR_KEY`

The endpoint must be HTTPS. The key must be stored in the deployment secret
manager and must not be committed. Validation checks provider/endpoint/key
presence and basic shape only; it never prints secret values.

Supported provider labels are `custom`, `sentry`, `datadog`, `grafana`,
`newrelic`, `honeycomb`, `cloudwatch`, and `azure-monitor`.

Manual placeholders are blocked for production readiness. `localhost`,
`127.0.0.1`, example domains, and `.test` endpoints do not count as configured
external monitoring except inside `--simulate-safe`, which is a validator logic
test only.

## Truth States

- `configured_guarded`: provider, HTTPS endpoint, and key are present.
- `unconfigured`: one or more required monitoring values are missing.

`/api/health`, `/api/diagnostics/probes`, and authenticated ops telemetry keep
reporting monitoring as unconfigured until the env contract is satisfied.

## What This Does Not Claim

- No fake incident delivery is simulated.
- No public alert channel is enabled.
- No unattended remediation or remote control is enabled.
- Notification delivery remains separate and unconfigured.

## Operator Check

1. Configure the provider, HTTPS endpoint, and key in the deployment secret
   manager.
2. Run `npm run production:validate`.
3. Capture `/api/health`.
4. Sign in as an operator and capture `/api/ops/telemetry`.
5. Confirm monitoring reports `configured_guarded` before production launch
   readiness is considered closed.
