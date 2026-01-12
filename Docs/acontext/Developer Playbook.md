# Developer Playbook (BMAD + AContext)

> **This playbook is the operating manual for anyone building inside a BMAD + AContext workspace.** Keep it close, update it as processes evolve, and make sure every new human or agent reads it before writing code.

---

## Document Meta

| Field | Value |
|-------|-------|
| **Purpose** | Describe the end-to-end workflow from task intake to push. |
| **Audience** | Product engineers, AI agents, reviewers. |
| **Last Updated** | `<YYYY-MM-DD>` |
| **Inputs** | `PRD.md`, `Product_Backlog.md`, `Active_Task.md`, `Implementation.md`, `.acontext/*`. |

---

## 1. Operating Principles

1. **Docs before code.** Every task starts with PRD ⟶ Backlog ⟶ Active Tasks ⟶ Implementation review.
2. **One log per effort.** No meaningful work happens off the record; `.acontext/tasks` is the canonical journal.
3. **Code + docs commit together.** Context lives alongside implementation to prevent drift.
4. **Promote learnings.** Decisions that outlive a task graduate into `Implementation.md`, `project_structure.md`, or `.acontext/decisions`.
5. **Keep flow visible.** Active_Task and task-index must match reality at all times.

---

## 2. First-Day Checklist (Humans & Agents)

- [ ] Read `PRD.md` for product intent.
- [ ] Read `Implementation.md` to understand the current stage and its exit criteria.
- [ ] Skim `project_structure.md` and `UI_UX_doc.md` to internalize constraints.
- [ ] Review `.acontext/README.md`, `Developer Playbook.md` (this file), and `AGENT_WORKFLOW.md`.
- [ ] Open `.acontext/tasks/task-index.md` to familiarize yourself with recent work.
- [ ] Confirm local environment/tooling from repo `README` (if present).

---

## 3. Task Lifecycle

| Stage | Actions | Primary Docs |
|-------|---------|--------------|
| **Intake** | Select task from `Active_Task.md`, confirm acceptance criteria and dependencies. | `PRD.md`, `Product_Backlog.md`, `Active_Task.md`. |
| **Planning** | Read Implementation stage section, confirm file locations + design references. | `Implementation.md`, `project_structure.md`, `UI_UX_doc.md`, `task-index.md`. |
| **Execution** | Build, test, and log progress. | `.acontext/tasks/<log>.md`, repo source. |
| **Verification** | Ensure criteria met, update docs and index. | Task log, `Active_Task.md`, `Implementation.md`. |
| **Delivery** | Commit code + documentation, push, note follow-ups. | Git history, review comments. |

---

## 4. Standard Prompt Skeletons

### Starting a New Feature
```
Task: <describe>
Source: Implementation.md Stage <n>, Active_Task <ID>.
Before coding: Read Implementation.md section, project_structure.md rules, UI_UX_doc.md components.
Create task log task-YYYYMMDD-NNN-<name>.md using TASK_TEMPLATE.
Follow AGENT_WORKFLOW, log steps/decisions, keep Active_Task updated.
```

### Investigating a Bug
```
Bug: <describe>
Check Bug_tracking.md + task-index for previous context.
Create task log task-YYYYMMDD-NNN-fix-<name>.md.
Document reproduction steps, root cause, fix, and add entry to Bug_tracking.md.
```

### Continuing Work
```
Resume task-YYYYMMDD-NNN-<name>.
Read its "Next Steps" and Challenges. Continue work, logging new progress.
Update status when pausing or completing.
```

More copy/paste templates live in `QUICK_PROMPTS.md`.

---

## 5. Review Gates

Before code review or merging, confirm:

- **Context**: Task log exists, referenced in commit message, and includes BMAD cross-links.
- **Scope**: Feature matches Implementation stage + Active_Task acceptance criteria.
- **Structure**: Files respect `project_structure.md`; naming and aliases correct.
- **Design**: UI touches comply with `UI_UX_doc.md`.
- **Tests**: Unit/e2e coverage updated or explicitly deferred in Next Steps.
- **Docs**: `Active_Task.md`, task log, task-index, and any impacted BMAD docs updated.

Use this checklist for peer reviews or self-QA.

---

## 6. Troubleshooting & Coaching

| Symptom | Likely Cause | Remedy |
|---------|--------------|--------|
| Files in wrong folders | `project_structure.md` ignored | Re-read section + enforce in review. |
| UI mismatches | `UI_UX_doc.md` skipped | Require quoting relevant spec before coding. |
| Missing logs | Agent rushed or task labeled “trivial” incorrectly | Reinforce “log-per-task” rule; allow exceptions only under 5 minutes. |
| Stale Active_Task | Owners not updating daily | Add check-in ritual; tie completion to verifying doc updates. |
| Duplicate work | `task-index.md` not consulted | Add “search index first” step to prompts. |

---

## 7. Maintenance Rituals

| Cadence | Task |
|---------|------|
| Daily | Review new commits for documentation completeness. |
| Twice weekly | Audit `task-index.md` vs actual logs, ensure stats accurate. |
| Sprint boundary | Promote new decisions into BMAD docs; prune or archive old logs. |
| Monthly | Revisit workflow documents (this playbook, AGENT_WORKFLOW, QUICK_PROMPTS) to reflect lessons learned. |

---

## 8. Escalation / Change Management

- **Scope adjustments:** Update PRD + Product_Backlog + Implementation simultaneously; note rationale in `.acontext/decisions`.
- **Hotfixes:** Create dedicated task log + bug entry even if turnaround is urgent; commit message should highlight “hotfix”.
- **New tooling:** Document in project_structure + Implementation before using in code.
- **On-call incidents:** Capture timeline in `.acontext/tasks`, root cause in Bug_tracking, mitigation plan in Implementation.

---

## 9. Reference Map

| Document | Why It Matters |
|----------|----------------|
| `PRD.md` | Product vision + personas. |
| `Product_Backlog.md` | Approved but unscheduled work. |
| `Active_Task.md` | Groomed tasks for the current stage. |
| `Implementation.md` | Stage plan, stack choices, success criteria. |
| `project_structure.md` | File system rules + naming. |
| `UI_UX_doc.md` | Design tokens + component specs. |
| `Bug_tracking.md` | Known issues and fixes. |
| `.acontext/AGENT_WORKFLOW.md` | Task-level checklist. |
| `.acontext/QUICK_PROMPTS.md` | Prompting shortcuts. |
| `.acontext/tasks/*` | Detailed execution history. |

---

## 10. Success Metrics

- ≥ 95% of commits reference a task log.
- Active_Task and Implementation remain in sync (no orphan tasks).
- Task logs finalized within 24 hours of code completion.
- Decisions promoted to permanent docs within one sprint.
- New contributors reach productive flow within one day using this playbook.

Track these in retrospectives to ensure the process adds value instead of friction.

---

Keep this playbook living: whenever you change the workflow, document it here first so prompts, task templates, and agent scripts can stay aligned.
