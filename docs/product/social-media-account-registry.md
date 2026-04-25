# Social Media Account Registry

This registry defines the future account inventory for Trading Pro Max media operations. It does not connect accounts, create tokens, publish content, or claim ownership of handles.

## Registry Fields

Each future channel should track:

- channel name
- intended handle
- region/language
- owner role
- connection state: not_connected, pending_review, connected_later
- credential storage location
- 2FA owner
- Legal review state
- Guardian review state
- Founder approval state
- publish permission state

## Initial Channel Plan

| Channel | Purpose | Current State |
| --- | --- | --- |
| X / Twitter | fast product and education updates | not_connected |
| Instagram | visual product and academy clips | not_connected |
| TikTok | short education and walkthroughs | not_connected |
| YouTube | tutorials and product explainers | not_connected |
| Facebook | broad announcements | not_connected |
| LinkedIn | professional product and company updates | not_connected |
| Telegram | future updates/community bridge | not_connected |
| Discord | future community support | not_connected |
| Reddit | education and product discussion later | not_connected |
| Blog / Newsroom | owned long-form content | not_connected |

## Credential Rule

No social credential, token, cookie, session, recovery code, or API key may be committed to Git. Future connections must use deployment secret storage and owner-controlled account security.

## Truth Rule

A channel is not active until the account exists, access is secured, publishing policy is approved, and the Founder authorizes use.
## Registry Truth

The social media account registry is readiness-only. No account is connected, no API token is stored, no posting is active, and no followers, views, ads, or campaign metrics are claimed.

Future channels may include major social, video, messaging, community, and newsroom destinations, but each channel requires Legal, Guardian, brand, and Founder review before connection or publication.
