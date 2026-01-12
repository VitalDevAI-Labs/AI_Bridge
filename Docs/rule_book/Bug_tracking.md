# Bug Tracking & Known Issues (Context and History)

> **Log every bug here with enough context so future contributors can learn from prior fixes.** Consult this file before attempting a fix to avoid duplicating work.

---

## 1. Purpose
- File bugs before fixing them to create searchable history
- Search for existing similar bugs and link them
- Document root cause and verification steps for learning
- Prevent duplicate investigations

---

## 2. Usage Rules
- File a bug before you fix it
- Search for existing similar bugs and link them
- Update with root cause and verification steps
- Keep as institutional memory

---

## 3. Severity Definitions

| Severity | Definition | Examples |
|----------|-----------|----------|
| **P0** | Production breakage, data loss, security | Auth completely broken, data corruption, security vulnerability |
| **P1** | Major feature impaired, no reasonable workaround | Table view crashes, search doesn't work, RLS policy leak |
| **P2** | Minor bug or cosmetic issue | Button misaligned, toast too long, minor UI glitch |

---

## 4. Bug Entry Template

```yaml
id: BUG-YYYYMMDD-NNN
title: "<Concise summary>"
date_reported: YYYY-MM-DD
reported_by: "<Name or agent>"
severity: P0 | P1 | P2
area: auth | links | prompts | table | ui | perf | build | infra
status: open | investigating | blocked | fixed | wont-fix

context:
  expected: "<What should happen>"
  actual: "<What actually happens>"

reproduction:
  steps:
    - "<Step 1>"
    - "<Step 2>"
    - "<Step 3>"
  environment:
    branch: "<Branch>"
    browser: "<Browser/OS>"
    supabase: "<Supabase project if relevant>"

investigation:
  logs: "<Relevant logs or screenshots>"
  hypotheses: "<Theories considered>"
  root_cause: "<Confirmed cause>"

fix:
  summary: "<What was changed>"
  files: []  # List of modified files
  pr: "<PR link or commit>"

validation:
  manual: "<Test steps to verify>"
  automated: "<Tests added>"
  regression_risk: "<Potential side effects>"

status: open | in-progress | fixed | wont-fix
linked_issues: []  # Related bug IDs or PRs
```

---

## 5. Known Issues

### Active Bugs

*(Currently tracking Stage 2 complete with mock data - no critical active bugs)*

---

### Pending Integration
- Prompt Bank Supabase integration (Phase 2)
- Full-text search implementation using tsvector indexes

---

### Fixed Bugs

*(Archive completed bug fixes here with resolution date)*

Example format:
```
**BUG-20YYMMDD-001**: Auth infinite loading
- **Fixed**: 2024-XX-XX
- **Root Cause**: Missing RPC function
- **Solution**: Created get_email_by_username function
```

---

### Won't Fix / By Design

*(Document decisions not to fix certain behaviors)*

---

## 6. Common Issue Patterns

### Authentication Issues
- **RPC function missing**: Causes infinite loading on sign-in
- **RLS policies**: Check policies if data access fails
- **Profile creation**: Verify database trigger is active

### Data Access Issues
- **RLS enforcement**: Ensure policies are correct per Implementation.md
- **Username resolution**: Verify RPC function exists and works

### UI Issues
- **Theme consistency**: Always test in both light/dark modes
- **Responsive layout**: Verify on mobile, tablet, desktop breakpoints
- **Form validation**: Ensure Zod schemas match backend expectations

---

## 7. Quick Troubleshooting

| Symptom | Likely Cause | Check |
|---------|-------------|-------|
| Infinite loading | Missing RPC function | Supabase SQL Editor |
| Profile not found | Database trigger not running | Check trigger setup |
| 406 errors | RLS policy issues | Review profiles table policies |
| Username conflicts | Duplicate usernames | Database constraint should prevent this |
| Sign-in failures | Username doesn't exist | Verify user signed up correctly |

---

## 8. Integration with BMAD Workflow

- Create task log in `.acontext/tasks/` when fixing bugs
- Reference bug ID in commit messages
- Update this file with resolution details
- Document architectural decisions in `.acontext/decisions/` if bug reveals deeper issues

---

### Search Before Filing

Before creating a new bug entry:
1. Search this file for similar issues
2. Check `.acontext/tasks/` for related work
3. Review Implementation.md for known limitations
4. Check Supabase logs for backend issues

---

**Remember**: Every bug is a learning opportunity. Document thoroughly so the team avoids repeating the same investigations.
