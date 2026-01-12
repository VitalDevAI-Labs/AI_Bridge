# Agent Workflow (Template)

> **Use this checklist to guide AI or human agents through every task.** It ties BMAD documents to the AContext logging ritual so execution stays reproducible.

---

## Document Meta

| Field | Value |
|-------|-------|
| **Audience** | AI copilots + developers running tasks |
| **Last Updated** | `<YYYY-MM-DD>` |
| **Inputs** | `Implementation.md`, `Active_Task.md`, `project_structure.md`, `UI_UX_doc.md` |
| **Outputs** | Code, `.acontext/tasks/...`, `task-index.md`, any updated BMAD docs |

---

## 1. Four-Phase Loop

```
PLAN → EXECUTE → DOCUMENT → SHIP
   ↑                         ↓
   └───────────FEEDBACK──────┘
```

### Phase 1 – Plan (Doc-First)
1. Confirm the task exists in `Active_Task.md` or Implementation stage plan.
2. Read the relevant BMAD documents:
   - `Implementation.md` – objectives + success criteria.
   - `project_structure.md` – file placement and naming rules.
   - `UI_UX_doc.md` – required design tokens/components (if UI).
   - `Bug_tracking.md` – if this is a fix or regression.
3. Search `.acontext/tasks/task-index.md` for related history.
4. Copy `tasks/TASK_TEMPLATE.md` and create a new log (`task-YYYYMMDD-NNN-name.md`).
5. Fill **Goal**, **Context**, **BMAD References**, and **Plan** before touching code.

### Phase 2 – Execute (Work + Log)
- Follow the plan while updating the log’s **Steps Taken**, **Decisions Made**, and **Challenges** sections as events occur.
- Note every file created/modified in **Artifacts** so reviewers can cross-check.
- When decisions may affect architecture, flag them for promotion to `decisions/` or BMAD docs.

### Phase 3 – Document & Verify
1. Validate acceptance criteria from `Active_Task.md` and Implementation.
2. Complete **Outcome**, **Validation**, and **Next Steps** sections.
3. Cross-reference related tasks, bug IDs, PR numbers, or design specs.
4. Update `tasks/task-index.md` (chronological entry + status counters + epic category).

### Phase 4 – Ship
- Stage code **and** documentation: `src/`, `.acontext/tasks/...`, `task-index.md`, `Active_Task.md`, etc.
- Write a commit message linking the task log.
- Push and notify stakeholders if required.

---

## 2. Task Log Lifecycle

| Status | Definition | Required Action |
|--------|------------|-----------------|
| `planned` | Template copied, goal/context defined. | Add placeholder entry to index. |
| `in-progress` | Work underway. | Update log daily; link to code branches. |
| `blocked` | Waiting on dependency or decision. | Capture blocker owner + ETA in log + Active_Task. |
| `completed` | Criteria met, code merged, docs updated. | Finalize log, update index stats, close Active_Task entry. |

Archive stale logs (>60 days) to keep the folder tidy.

---

## 3. Prompt Snippets

- **New Feature:** “Read Implementation Stage `<n>` + project structure + UI doc. Create task log `task-YYYYMMDD-NNN-feature.md`, follow workflow above.”
- **Bug Fix:** “Check Bug_tracking + task-index for related work. Create `task-YYYYMMDD-NNN-fix-issue.md`, document reproduction, root cause, fix, and add bug entry.”
- **Refactor:** “Find original log, cite rationale for change, document before/after.”
- More templates: see `QUICK_PROMPTS.md`.

---

## 4. Verification Checklist

Before marking a task complete:
- [ ] Implementation success criteria satisfied.
- [ ] Acceptance criteria from `Active_Task.md` checked off.
- [ ] Tests executed (note command/results).
- [ ] Task log fully populated with references and artifacts.
- [ ] Task-index entry added/updated.
- [ ] Any architectural decisions extracted to `decisions/` or Implementation.
- [ ] Active_Task item updated to `completed` (with actual hours + log link).

---

## 5. Common Questions

| Question | Answer |
|----------|--------|
| “Which file should I edit?” | Check `project_structure.md` + similar logs via `task-index.md`. |
| “Do I need a task log for tiny fixes?” | Optional for trivial (<5 min) changes; otherwise yes. |
| “Where do new requirements go?” | `PRD.md` for product intent, `Product_Backlog.md` for approved future work. |
| “How do I resume a paused task?” | Re-read the log’s **Next Steps** and update status to `in-progress` again. |

---

## 6. Escalation Path

1. Record blocker in task log + `Active_Task.md`.
2. Tag owner/resolver (person or role) with date observed.
3. If blocker affects architecture, add a stub in `decisions/README` for follow-up.
4. Do not proceed until the blocker is cleared or scope adjusted in Implementation.

---

## 7. Metrics to Watch

- Ratio of completed tasks to total tasks in `task-index.md`.
- Average time between log creation and completion.
- Percentage of tasks with missing sections (should trend to zero).
- Number of undocumented decisions discovered during reviews.

Review these during retrospectives to ensure the workflow stays healthy.

---

Keep this workflow lean but strict; consistent logging and verification are what make BMAD + AContext scalable for any future project.
