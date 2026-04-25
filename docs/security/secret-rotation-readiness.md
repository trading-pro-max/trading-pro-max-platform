# Secret Rotation Readiness

## Purpose

Secret rotation readiness defines how Trading Pro Max will later prove secret freshness without exposing the secret itself.

## Current State

Rotation is policy-defined only. No production rotation is active in this pass.

## Future Requirements

- Owner authentication
- Trusted device confirmation
- Step-up confirmation
- Audit event
- Secret manager integration
- Rotation timestamp or attestation without raw value
- Guardian/Legal review for high-risk categories

## Forbidden Outputs

- Raw secret values
- Token fragments
- Password fragments
- Broker credentials
- Payment credentials
- Social tokens
- Secret hashes that can be used as identifiers

## Safe Outputs

- `rotation_required`
- `planned`
- `required_before_activation`
- `policy_defined`
- `status_only_no_values`
