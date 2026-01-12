# AContext Reference (Template)

> **AContext is the dynamic memory layer for BMAD projects.** Use this file to explain what goes into `.acontext/`, how it complements the permanent BMAD documents, and how teams should keep it healthy.

---

## Document Meta

| Field | Value |
|-------|-------|
| **Owner** | `<AContext steward>` |
| **Purpose** | Teach contributors how to capture and retrieve execution context. |
| **Last Updated** | `<YYYY-MM-DD>` |
| **Related Docs** | `AGENT_WORKFLOW.md`, `Developer Playbook.md`, `.acontext/tasks/TASK_TEMPLATE.md`. |

---

## 1. What Lives in AContext?

| Concern | Store In | Notes |
|---------|----------|-------|
| Task execution history | `.acontext/tasks/` | Step-by-step logs, outcomes, artifacts. |
| Architecture decisions | `.acontext/decisions/` | Rationale + alternatives for significant choices. |
| Code snapshots / diffs | `.acontext/artifacts/` | Optional snapshots for tricky changes. |
| Feature bundles | `.acontext/context/` | Curated packages for recurring onboarding. |
| Prompting aids | `.acontext/QUICK_PROMPTS.md` | Copy/paste scripts for developers. |
| Workflow guardrails | `.acontext/AGENT_WORKFLOW.md` | Step-by-step instructions for agents. |

**Rule of thumb:** BMAD docs capture *what must be true*; AContext captures *how we made it true*.

---

## 2. Directory Map

```
.acontext/
├─ README.md                # This overview
├─ Developer Playbook.md    # Full workflow and rituals
├─ AGENT_WORKFLOW.md        # Task-level checklist for agents
├─ QUICK_PROMPTS.md         # Copy-paste prompts for common scenarios
├─ tasks/
│  ├─ TASK_TEMPLATE.md      # Canonical task log structure
│  ├─ task-index.md         # Master registry of all logs
│  └─ task-YYYYMMDD-*.md    # Individual task logs (examples or live entries)
├─ decisions/
│  └─ README.md             # How to log decisions (future-ready)
├─ artifacts/
│  └─ README.md             # How to capture code snapshots (future-ready)
└─ context/
   └─ README.md             # How to assemble feature bundles (future-ready)
```

---

## 3. When to Capture Context

| Moment | AContext Action |
|--------|-----------------|
| **New task** | Copy `TASK_TEMPLATE`, fill Goal + Context, link to Active_Task entry. |
| **During work** | Append Steps, Decisions, Challenges as they happen. |
| **Design choice** | Summarize reasoning in task log; if durable, promote to `decisions/`. |
| **Complex code change** | Note artifacts in task log; optionally capture snapshot in `artifacts/`. |
| **Feature completion** | Update task log outcome, task-index, Implementation checklist. |

Work never “counts” until the log + index reflect it.

---

## 4. Retrieval Workflow

1. **Start with BMAD docs** (`Implementation.md`, `project_structure.md`, `UI_UX_doc.md`) to understand scope and guardrails.
2. **Open `tasks/task-index.md`** to search by date, status, epic, or keyword.
3. **Read linked task logs** for detailed history and decision reasoning.
4. **Check `decisions/`** (when populated) for architecture-level conclusions.
5. **Review `artifacts/` or `context/`** if they exist for the feature.

Use `rg`/`ripgrep` across `.acontext/` for keyword searches when the index grows large.

---

## 5. Logging Standards

- **One log per meaningful task.** If work spans multiple days, keep the same log and add dated updates.
- **Name files predictably:** `task-YYYYMMDD-NNN-brief-description.md`.
- **Link everything:** BMAD sections, code paths, related tasks, bug IDs.
- **List artifacts:** Every created/modified file plus new docs or scripts.
- **Close the loop:** Each log ends with Outcome + Next Steps so another contributor can resume instantly.

---

## 6. Maintenance Cadence

| Frequency | Action |
|-----------|--------|
| Daily | Update running task logs and task-index. |
| Weekly | Review open logs, archive stale or duplicate entries, ensure blockers are captured. |
| Monthly | Summarize key decisions into BMAD docs; prune or archive old logs to `tasks/archive/`. |

Assign a steward to audit the folder regularly so it remains trustworthy.

---

## 7. Extending AContext

The `artifacts/`, `decisions/`, and `context/` directories begin as placeholders. When you’re ready to activate them:

1. Copy the README templates in each folder.
2. Create the first entry using the provided naming conventions.
3. Reference the new entry from relevant task logs or BMAD docs.
4. Update this README with any process tweaks so the next team knows how to contribute.

---

## 8. Quick Checklist

- [ ] Every task log traces to an Active_Task entry and Implementation stage.
- [ ] Task-index reflects the latest status counts.
- [ ] Decisions that affect architecture live in `decisions/` or Implementation.
- [ ] Logs list all touched files and link to commits when applicable.
- [ ] Agents know where to look for prompts (`QUICK_PROMPTS.md`) and workflows (`AGENT_WORKFLOW.md`).

Maintain this README as a friendly orientation so new humans or agents can understand the intent of AContext before diving into individual logs.
