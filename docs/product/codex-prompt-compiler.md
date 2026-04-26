# Codex Prompt Compiler

The Codex Prompt Compiler turns a valid Task Passport and Execution Permit into a Codex-ready prompt.

Prompt must include:
- project
- mission
- scope
- allowed files
- forbidden files
- non-negotiables
- Product Truth
- public language rule
- validation commands
- screenshot requirements if visual
- final response format
- commit message
- do not expand scope

Prompt must not include:
- secrets
- private user data
- real tokens
- production credentials
- instructions to activate billing, broker/feed, live execution, social publishing, or launch
- instructions to run unsafe external actions

Generated readiness text may include:
- manual copy/paste guidance
- CLI command text
- cloud command text
- GitHub comment text

The web app does not execute any generated command text.
