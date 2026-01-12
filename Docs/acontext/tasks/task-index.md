# Task Log Index (Template)

> Maintain this file as the searchable table of contents for `.acontext/tasks`. Keep summaries short, statuses accurate, and statistics up to date.

---

## How to Update
1. When a new task log is created, add a placeholder entry under **Chronological Listing** (status = `planned`).
2. As work progresses, update the **Status Board** counts and move entries between sections.
3. When a task completes, mark acceptance criteria in the log, add a summary here, and link to related docs.
4. At the end of each sprint/stage, archive older entries if needed and refresh stats.

---

## Status Board

| Status | Count | Notes |
|--------|-------|-------|
| Planned | 0 | — |
| In Progress | 0 | — |
| Blocked | 0 | — |
| Ready for Review | 0 | — |
| Completed | 0 | — |
| Cancelled | 0 | — |

Update these numbers whenever the underlying tasks change.

---

## Stage / Epic Overview

| Stage / Epic | Total Tasks | Completed | In Progress | Blocked | Links |
|--------------|-------------|-----------|-------------|---------|-------|
| Stage 0 – Foundations | 0 | 0 | 0 | 0 | `<anchor or NA>` |
| Stage 1 – Core Experience | 0 | 0 | 0 | 0 | |
| Stage 2 – Expansion | 0 | 0 | 0 | 0 | |
| Stage 3 – Polish & Hardening | 0 | 0 | 0 | 0 | |
| Stage 4 – Launch & Feedback | 0 | 0 | 0 | 0 | |

Rename or add rows to match your Implementation stages.

---

## Chronological Listing

Use the template below for each log. Keep entries sorted newest → oldest within each month.

```
### YYYY-MM

**[task-YYYYMMDD-NNN-brief-name](./task-YYYYMMDD-NNN-brief-name.md)**  
- **Date:** YYYY-MM-DD  
- **Stage/Epic:** `<Stage or epic>`  
- **Status:** `planned/in-progress/blocked/completed`  
- **Summary:** `<1–2 sentences>`  
- **Tags:** `#scope #tech #component`
```

Add additional months as needed. Provide enough detail for someone skimming the index to decide whether to open the log.

---

## Active Tasks (Detailed)

List in-progress or blocked items with extra context so leads can spot issues without opening each log.

```
### In Progress
- [task-YYYYMMDD-XYZ](./task-YYYYMMDD-XYZ.md) — Owner, ETA, key dependency.

### Blocked
- [task-YYYYMMDD-ABC](./task-YYYYMMDD-ABC.md) — Waiting on <owner>. Blocker: <description>.
```

---

## Completed Highlights

Use this section for weekly or stage summaries.

```
### Week of YYYY-MM-DD
- task-YYYYMMDD-XYZ — Delivered <result>. Linked to Implementation Stage <n>.
- task-YYYYMMDD-ABC — Fixed <bug>. Updated Bug_tracking entry BUG-###.
```

---

## Statistics

| Metric | Value |
|--------|-------|
| Total Tasks Logged | 0 |
| Average Duration (creation → completion) | `N/A` |
| Tasks Completed This Sprint | 0 |
| Open Blockers | 0 |

Add any other metrics your team cares about (e.g., ratio of feature vs bug tasks).

---

## Archive Guidance

- Move old logs to `tasks/archive/` when the folder exceeds ~50 active files.
- Keep their entries here but note the archive path.
- Update git history accordingly so references remain valid.

---

Maintain this index diligently—future agents will rely on it to find history fast.
