# Quick Prompts (Template)

> Copy, customize, and paste these snippets when guiding an AI agent or teammate. Every prompt enforces the BMAD → Active_Task → AContext workflow so nothing slips.

---

## Document Meta

| Field | Value |
|-------|-------|
| **Owner** | `<Workflow lead>` |
| **Last Updated** | `<YYYY-MM-DD>` |
| **Reference Docs** | `Developer Playbook.md`, `AGENT_WORKFLOW.md`, `Active_Task.md`. |

---

## 1. Start a Standard Feature Task
```
Task: <describe> from Implementation.md Stage <n>, Active_Task <ID>.

Before coding:
1. Read Docs/Implementation.md section <anchor>.
2. Read Docs/project_structure.md for file placement + naming.
3. Read Docs/UI_UX_doc.md if UI touches exist.
4. Check Docs/.acontext/tasks/task-index.md for related history.

Action:
1. Create task log Docs/.acontext/tasks/task-YYYYMMDD-NNN-<name>.md from TASK_TEMPLATE.
2. Log goal, context, BMAD references, and plan before coding.
3. Work per AGENT_WORKFLOW; capture steps, decisions, challenges, artifacts.
4. Update task-index + Active_Task entry when done.

Start now.
```

---

## 2. Quick / Low-Risk Task
```
Quick task: <describe>. Minimal scope.
- Read Implementation.md + project_structure.md only.
- Create a short task log (goal + outcome).
- Implement, sanity check, update log, push.
Skip extended discovery unless you find blockers.
```

---

## 3. Bug Investigation
```
Bug: <symptom>.

Process:
1. Read Docs/Bug_tracking.md for similar issues.
2. Search Docs/.acontext/tasks/task-index.md for related work.
3. Create log task-YYYYMMDD-NNN-fix-<name>.md.
4. Document reproduction steps, root cause, fix, validation.
5. Add/Update Bug_tracking entry with severity + solution.
6. Update Active_Task + task-index.
```

---

## 4. Research / Spike
```
Research: <topic> (Implementation.md research item <R#>).
- Read Implementation.md research requirements.
- Create task log task-YYYYMMDD-NNN-research-<topic>.md.
- Test/evaluate options, capture findings + recommendation.
- Update Implementation.md (mark research complete + note decision).
- Do not implement yet unless explicitly approved.
```

---

## 5. Resume Existing Task
```
Resume task-YYYYMMDD-NNN-<name>.
1. Read the log's Next Steps + Challenges.
2. Confirm acceptance criteria in Active_Task.md.
3. Continue work, logging new steps.
4. Update Next Steps/status when pausing or finishing.
```

---

## 6. Pre-Commit Checklist
```
Before committing:
- Verify Implementation + Active_Task criteria met.
- Confirm task log is complete.
- Update task-index + Active_Task.
- Stage code + Docs/.acontext/tasks/... + Docs/.acontext/tasks/task-index.md + any BMAD docs touched.
- Commit message: "<type>: <summary> (task-YYYYMMDD-NNN-<name>)".
```

---

## 7. Review Request
```
Review <feature/bug>.
Check:
1. Task log completeness and references.
2. Alignment with project_structure & UI_UX_doc.
3. Implementation scope vs Implementation.md stage.
4. Tests + validation steps run.
5. Task-index + Active_Task updated.
Report findings + blockers.
```

---

## 8. Stage Readiness Check
```
Verify Stage <n> completion.
- Read Implementation.md Stage <n> tasks + success criteria.
- Ensure each task has a completed log + Active_Task entry.
- Confirm outstanding bugs handled or recorded.
- Summarize ready/not ready + gaps.
```

---

### Tips
- Add modifiers like “Explain reasoning as you go” or “Pause for approval before writing files” when needed.
- Mention file paths or Acceptance Criteria IDs to focus the agent.

Keep this file short and opinionated so prompts remain consistent as the workflow evolves.
