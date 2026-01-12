## Bug Tracking (Context and History)

Log every bug here with enough context so future contributors can learn from prior fixes. Consult this file before attempting a fix to avoid duplicating work.

Usage Rules
- File a bug before you fix it
- Search for existing similar bugs and link them
- Update with root cause and verification steps

Severity
- P0: production breakage, data loss, security
- P1: major feature impaired, no reasonable workaround
- P2: minor bug or cosmetic issue

Template
```
Title: <concise summary>
ID: BUG-YYYYMMDD-XXX
Reported by: <name/agent>
Date: <yyyy-mm-dd>
Severity: P0 | P1 | P2
Area: auth | links | table | ui | perf | build | infra

Context
- Expected:
- Actual:

Reproduction Steps
1. 
2. 
3. 

Environment
- Branch: 
- Node: 
- Browser/OS:
- Supabase project:

Investigation
- Logs/screenshots:
- Hypotheses considered:
- Root cause:

Fix
- Change summary:
- Files touched:

Verification
- Manual test steps:
- Automated tests (if any):
- Regression risk:

Status: Open | In Progress | Resolved | Won't Fix
Linked Issues/PRs:
```

Known Issues
- None recorded yet.


