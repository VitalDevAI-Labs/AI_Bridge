# Active Tasks (Developer-Friendly)

> Groomed queue for the current implementation stage. IDs and links must match Product_Backlog and Notion.

---

## 1) How This File Fits
- Handoff from `Product_Backlog` to execution.
- Flow: `PRD` -> `Product_Backlog` -> `Active_Task` (this file) -> `.acontext/tasks` -> Code.
- Items here are manually synced with Notion; no auto-sync expected.

---

## 2) Stage Snapshot (roll-up)

| Stage | Owner | Ready | In Progress | Blocked | Review | Done | Notes |
|-------|-------|-------|-------------|---------|--------|------|-------|
| `<Stage name>` | `<Lead>` | 0 | 0 | 0 | 0 | 0 | `<risks or scope callouts>` |

Update counts when tasks move.

---

## 3) Task Board (one-liners)

| ID | Title | Stage/Epic | Status | Priority | Owner | Due | Log | Notion |
|----|-------|------------|--------|----------|-------|-----|-----|--------|
| `TASK-001` | `<Outcome>` | `<Stage/Epic>` | not-started/in-progress/blocked/review/completed | H/M/L | `<name>` | `YYYY-MM-DD` | `.acontext/tasks/task-YYYYMMDD-XXX.md` | `<Notion link/ID>` |

Keep this table in sync with the YAML entries below.

---

## 4) Lean Task Entry Template (YAML)

```yaml
- id: TASK-001
  title: "Outcome-based title"
  stage: "Implementation stage or epic"
  status: not-started | in-progress | blocked | review | completed
  priority: high | med | low
  owner: "Name or agent"
  start_date: null     # fill when work starts
  due_date: null       # optional
  backlog_id: PB-001   # link to Product_Backlog
  notion: "Notion task URL or ID"
  task_log: ".acontext/tasks/task-YYYYMMDD-XXX.md"
  summary: >
    1-2 sentences on scope and outcome.
  acceptance_criteria:
    - "Testable condition #1"
  dependencies:
    tech: []
    design: []
  blockers: []          # describe if status=blocked
  validation:
    manual: "Steps or scenarios"
    automated: "Tests to run"
  notes: >
    Brief context, links to decisions if any.
```

---

## 5) Status Model
- `not-started`: Ready to pick up; DoR met.
- `in-progress`: Work + log active.
- `blocked`: Waiting on dependency/decision; note owner in `blockers`.
- `review`: Code ready; validation captured in log.
- `completed`: Acceptance criteria met; docs/log updated.

---

## 6) Definition of Ready (developer-focused)
- Acceptance criteria are testable.
- Blocking dependencies known/owned.
- Design/spec link exists if UI involved.
- Owner and log path planned.

If any box is unchecked, keep status below `not-started` and leave it in Product_Backlog.

---

## 7) Rituals
- When you pick a task: create/update `.acontext/tasks/...` from `TASK_TEMPLATE`, set status `in-progress`.
- Update status daily; reflect blockers in `blockers` field and table.
- When complete: mark `completed`, update `.acontext` log outcome, and mirror in Implementation stage checklist.

---

## 8) Promotion Rule
- Only add tasks here when the linked `Product_Backlog` item is `ready`.
- Once added: set `status` to `not-started` and ensure Notion ID + log path are filled.
- Move off this file (archive/remove) after the stage ships to keep it lean.
