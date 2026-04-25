# Founder Approval Workflows

Founder approval workflows keep sensitive actions disciplined inside TPM Planet OS.

## Lifecycle

| State | Meaning |
| --- | --- |
| draft | item exists but has not been reviewed |
| pending_guardian_review | Guardian review is required before Founder review |
| pending_legal_review | Legal review is required before Founder review |
| pending_treasury_review | Treasury review is required for money, billing, Pro/VIP, or partnership claims |
| pending_engineering_review | Engineering review is required for product, production, broker/feed, or system claims |
| reviewed_by_guardian | Guardian review completed |
| reviewed_by_legal | Legal Counsel review completed where required |
| ready_for_founder | item passed required review and is ready for Founder decision |
| approved | Founder approved the reviewed item |
| rejected | Founder rejected the item with a reason |
| blocked | item cannot proceed until remediated |
| archived | item is closed and retained for audit/history |

## Applies To

- media posts
- AI video scripts
- Pro/VIP campaigns
- public announcements
- Islamic account wording
- launch wording
- pricing and billing wording
- broker/feed wording
- sensitive assistant capabilities
- community policy changes
- desktop/mobile command app sensitive actions

## Approval Rules

- Founder approval does not bypass Guardian hard blocks.
- Founder approval does not bypass Legal hard blocks.
- Blocked content cannot be approved without remediation.
- Every approval is auditable.
- Every rejection should include a reason.
- Every approved item must still reflect true configured capability.
- Launch, billing, broker, feed, live trading, and real-money wording require real gates before approval can mean activation.

## Audit Fields

- item id
- module
- lifecycle state
- risk level
- Guardian review result
- Legal review result
- Founder decision
- decision reason
- timestamp
- rollback note where applicable

## Planet Earth Approval Center Alignment

The Founder Approval Center uses these workflows for media, AI video, Pro/VIP, Islamic wording, launch wording, billing/pricing wording, broker/feed wording, assistant capability changes, ministry policy changes, and command app sensitive actions. Critical blocks remain blocked until remediated.

## Deep Foundation Rule

Founder approval cannot override a Critical block without remediation. Guardian and Legal hard blocks remain hard blocks, even inside the private command app.
