# Founder Approval Workflows

Founder approval workflows keep sensitive actions disciplined inside TPM Planet OS.

## Lifecycle

| State | Meaning |
| --- | --- |
| draft | item exists but has not been reviewed |
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

