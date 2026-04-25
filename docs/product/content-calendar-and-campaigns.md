# Content Calendar And Campaigns

The content calendar organizes media work without publishing externally. It gives each content item a lifecycle, risk class, and approval path.

## Content Lifecycle

1. idea
2. draft
3. brand review
4. Guardian review
5. Legal review
6. Founder approval
7. scheduled
8. published
9. blocked
10. archived

Published means actually released on an external channel. This document does not publish anything.

## Risk Classification

### Safe Auto Publish Later

Future low-risk examples after publishing infrastructure exists:

- education
- platform tips
- paper-mode explanation
- fallback or blocked state explanation
- academy content
- non-sensitive product updates

Even safe auto-publish must respect brand and claim rules.

### Approval Required

- Pro/VIP claims
- AI capability claims
- Islamic account wording
- launch wording
- broker/feed/live wording
- billing/pricing wording
- ads
- performance discussion

### Blocked

- guaranteed profit
- win-rate claims
- risk-free wording
- sure signal
- fake live trading
- fake broker/feed/billing
- fake public launch
- fake Islamic/Sharia certification
- misleading urgency
- gambling-style marketing
- financial advice
- legal advice
- copied competitor content

## Campaign Fields

Each campaign should define:

- objective
- audience
- channel
- language/region
- content items
- approval owner
- risk class
- launch dependency
- rollback message if needed

## Founder Rule

High-risk campaign language requires Founder approval after Guardian and Legal review.

## Planet Earth Media Workflow

Media items move through idea, draft, brand review, Guardian review, Legal review, Founder approval, scheduled, published, blocked, and archived states. In the current architecture, scheduled and published remain future states only because no external posting system is connected.

Runtime readiness mirrors this lifecycle through the Content Factory Engine. Safe education may become a safe_auto_publish candidate later, but sensitive claims still require Brand, Guardian, Legal, and Founder review, and blocked claims must be rewritten.
## Campaign Readiness Truth

Content calendar and campaign systems remain internal draft/readiness concepts.

Allowed now:

- educational ideas
- product update drafts
- trust/safety copy drafts
- AI video script outlines
- campaign planning notes

Blocked now:

- external publishing
- social scheduling
- connected social accounts
- follower/view/ads metrics
- unreviewed Pro/VIP claims
- guaranteed profit claims
- fake partnership claims
