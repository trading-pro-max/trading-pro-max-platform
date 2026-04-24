# User Skill Profile

The User Skill Profile adapts guidance without manipulating users or increasing risk. Unknown users default to beginner-safe, conservative, learning-oriented guidance.

Runtime:
- `lib/server/user-profile/types.ts`
- `lib/server/user-profile/skill-profile.ts`

Skill levels:
- `beginner`
- `intermediate`
- `advanced`
- `professional`
- `learning_only`

Risk profiles:
- `learning`
- `conservative`
- `balanced`
- `active`
- `high_caution`

The profile can adapt explanation depth, assistant tone, journal prompt depth, coach reminders, warnings, and preflight explanations.

Hard boundaries:
- no overtrading encouragement
- no manipulation
- no profit promises
- no risky-behavior push
- no gambling-style triggers
