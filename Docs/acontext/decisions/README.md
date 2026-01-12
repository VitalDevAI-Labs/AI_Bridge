# Decisions – Architecture Log Template

> Record durable technical or product decisions here once they outgrow individual task logs. Doing so prevents future teams from revisiting the same debates.

---

## Naming Convention

```
decision-YYYYMMDD-brief-topic.md
```

Example: `decision-20251205-state-management.md`

---

## When to Log a Decision

- Choosing a core technology or library.
- Defining a cross-cutting pattern (state, navigation, error handling).
- Accepting a trade-off that affects multiple teams.
- Locking in data schemas or network contracts.

Skip entries for trivial styling choices or short-lived experiments; keep those in task logs.

---

## Template

```markdown
# Decision: <Topic>

**ID**: decision-YYYYMMDD-<topic>  
**Date**: YYYY-MM-DD  
**Status**: proposed | accepted | implemented | deprecated | superseded  
**Owner**: <name/role>  
**Related Tasks**: [task-YYYYMMDD-NNN](../tasks/task-YYYYMMDD-NNN.md)  
**Impacted Docs**: Implementation.md §, project_structure.md §, etc.

## Context
Short narrative explaining the problem, constraints, and triggers.

## Decision
Clear statement of the chosen approach.

## Rationale
- Key benefits.
- How it aligns with goals/principles.

## Alternatives Considered
| Option | Pros | Cons | Reason Not Chosen |
|--------|------|------|-------------------|

## Consequences
- Positive outcomes.
- Risks or trade-offs.
- Mitigations.

## Review / Sunset
- Criteria that would cause us to revisit this decision.
- Target review date if applicable.

## References
- Links to research, discussions, or external docs.
```

---

## Workflow Integration

1. Capture initial reasoning inside the relevant task log.
2. When the decision becomes reusable knowledge, promote it here.
3. Update Implementation/project_structure/UI_UX docs to reflect the new standard.
4. Reference this decision from future task logs or code comments as needed.

Maintaining this log ensures that architectural knowledge remains searchable and auditable long after the original contributors have moved on.
