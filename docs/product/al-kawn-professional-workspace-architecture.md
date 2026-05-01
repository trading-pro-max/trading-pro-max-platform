# Al-Kawn Professional Workspace Architecture

## Blueprint

```text
Desktop
└── AL-KAWN
    ├── 00_ORIGIN
    ├── 01_ACTIVE
    │   └── al-kawn-platform
    ├── 02_WORLDS
    │   ├── Pro-Max-Galaxy
    │   │   └── Trading-Pro-Max-Earth
    │   ├── Future-Mobile
    │   └── Future-Worlds
    ├── 03_PRIVATE
    │   ├── Vault
    │   ├── Decisions
    │   ├── Daily
    │   └── Notes
    ├── 04_RIGHTS
    │   ├── Ownership
    │   ├── Brand
    │   ├── Assets
    │   └── Legal-Readiness
    ├── 05_REPORTS
    │   ├── Wake-Reports
    │   ├── Audits
    │   ├── Architecture
    │   └── Validation
    ├── 90_INBOX
    │   └── To-Classify
    └── 99_LEGACY
        └── Old-Projects-Do-Not-Delete
```

## Script

`scripts/setup-al-kawn-professional-workspace.ps1` creates folders and README files only when Ahmad runs it manually.

The script does not move the active repo, delete files, overwrite existing README files, inspect private folders, publish, sign, upload, or activate money/broker/legal/external systems.

## Order Rules

- لا حذف قبل الجرد والتصنيف.
- لا نقل للريبو النشط قبل تقرير migration.
- كل مشروع داخل الكون له مجلد كامل مستقل.
- كل المشاريع تعمل معًا عبر Al-Kawn Core.
- الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات.
