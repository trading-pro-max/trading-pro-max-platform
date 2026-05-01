[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$desktop = [Environment]::GetFolderPath("Desktop")
$root = Join-Path -Path $desktop -ChildPath "AL-KAWN"

$folders = @(
  "00_ORIGIN",
  "01_ACTIVE",
  "01_ACTIVE/al-kawn-platform",
  "02_WORLDS",
  "02_WORLDS/Pro-Max-Galaxy",
  "02_WORLDS/Pro-Max-Galaxy/Trading-Pro-Max-Earth",
  "02_WORLDS/Future-Mobile",
  "02_WORLDS/Future-Worlds",
  "03_PRIVATE",
  "03_PRIVATE/Vault",
  "03_PRIVATE/Decisions",
  "03_PRIVATE/Daily",
  "03_PRIVATE/Notes",
  "04_RIGHTS",
  "04_RIGHTS/Ownership",
  "04_RIGHTS/Brand",
  "04_RIGHTS/Assets",
  "04_RIGHTS/Legal-Readiness",
  "05_REPORTS",
  "05_REPORTS/Wake-Reports",
  "05_REPORTS/Audits",
  "05_REPORTS/Architecture",
  "05_REPORTS/Validation",
  "90_INBOX",
  "90_INBOX/To-Classify",
  "99_LEGACY",
  "99_LEGACY/Old-Projects-Do-Not-Delete"
)

function New-AlKawnDirectory {
  param(
    [Parameter(Mandatory = $true)]
    [string] $RelativePath
  )

  $target = Join-Path -Path $root -ChildPath $RelativePath

  if (Test-Path -LiteralPath $target -PathType Leaf) {
    Write-Warning "Skipped file conflict: $target"
    return
  }

  if (-not (Test-Path -LiteralPath $target -PathType Container)) {
    New-Item -ItemType Directory -Path $target | Out-Null
    Write-Host "Created folder: $target"
  }
  else {
    Write-Host "Folder exists: $target"
  }

  $readme = Join-Path -Path $target -ChildPath "README.md"
  if (-not (Test-Path -LiteralPath $readme)) {
    $readmeContent = @"
# AL-KAWN Workspace Folder

This folder belongs to Ahmad's private personal-device universe.

- الكون يبقى داخل أجهزة أحمد الشخصية فقط.
- الاستخدام شخصي لأحمد فقط.
- لا حذف قبل الجرد والتصنيف.
- لا نقل للريبو النشط قبل تقرير migration.
- Product Truth يحكم كل شيء.

This script creates folders and README files only. It does not move the active repo, delete files, inspect private folders, publish anything, sign anything, or activate money/broker/legal/external systems.
"@
    Set-Content -LiteralPath $readme -Value $readmeContent -Encoding UTF8
    Write-Host "Created README: $readme"
  }
  else {
    Write-Host "README exists: $readme"
  }
}

Write-Host "Al-Kawn professional workspace setup preview"
Write-Host "Root: $root"
Write-Host "No active repo will be moved."
Write-Host "No files will be deleted."
Write-Host "No private folders will be scanned."
Write-Host "No public, money, broker, legal, signing, or upload action is performed."

foreach ($folder in $folders) {
  New-AlKawnDirectory -RelativePath $folder
}

Write-Host "Workspace folder tree prepared locally."
Write-Host "Next safe step: keep the active repo unchanged until Ahmad reviews a migration report."
