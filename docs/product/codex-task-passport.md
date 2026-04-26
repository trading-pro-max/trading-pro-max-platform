# Codex Task Passport

A Task Passport is the work permit packet that tells Codex exactly what is allowed.

Fields:
- taskId
- title
- mission
- reason
- category
- riskLevel
- workerLevel
- ownerMinistryOrArea
- allowedFiles
- forbiddenFiles
- allowedSurfaces
- forbiddenSurfaces
- requiredReviews
- founderApprovalRequired
- legalReviewRequired
- guardianReviewRequired
- securityReviewRequired
- productTruthRequirements
- publicLanguageRules
- forbiddenScope
- validationCommands
- screenshotRequirements
- rollbackRule
- finalReportFormat
- expectedCommitMessage
- createdAt

Passport invalid states:
- no validation commands
- missing forbidden scope
- missing Product Truth requirements
- task contains secret material
- task has critical blocked scope
- public/private boundary or file jurisdiction is unclear

Current worker levels allowed:
- observer
- drafter
- builder_low

Restricted:
- builder_medium_review_required
- unrestricted builder behavior
- any worker level that can override Founder, Guardian, Legal, Security, or Product Truth.
