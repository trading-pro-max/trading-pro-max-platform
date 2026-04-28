# Pro Max Trading Living Core Death Audit

Status: active_with_notes

Legacy-layer risks found:

- `/en` had been treated as primary workspace identity.
- Public route links could make Trading feel like locale machinery instead of a living product.
- Workspace CSS remains broad and layered.
- Shell module still holds mixed public/workspace/private shell concerns.

Fixes:

- `/trading` added as canonical route.
- Home, header, Apps / Platforms, Brain/Companion defaults, Local Day One references, smoke routes, and tests point to `/trading`.
- `/en` remains compatibility only.

Postponed:

- Broad CSS split.
- Deep shell folder split.
- Removal or redirect of `/en`.
