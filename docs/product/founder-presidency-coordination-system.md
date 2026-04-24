# Founder Presidency / Central Coordination System

The Founder Presidency / Central Coordination System is the internal routing layer between ministries, states, councils, and Founder Command.

Ministries may operate internally within their scope. Cross-ministry requests must pass through Presidency Coordination so the product does not grow through untracked side channels.

## Responsibilities

- receive cross-ministry requests
- classify risk and priority
- route Legal, Guardian, Treasury, Engineering, and Founder reviews
- prevent unsafe shortcuts
- keep a message ledger
- report unresolved blockers upward to Founder Command

## Current Truth

- architecture/contracts only
- no autonomous workflow execution
- no launch workflow activation
- no production deployment
- no billing activation
- no broker/feed activation
- no social publishing

## Runtime Contract

The deterministic readiness model lives in `lib/server/planet-os/coordination.ts`.
