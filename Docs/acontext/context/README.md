# Context Bundles (Template)

> This folder will eventually house feature-specific “context bundles” that gather everything a new contributor needs (docs, task logs, code maps). Until then, keep this guide so teams know how to populate it when ready.

---

## Purpose

- Collect links to PRD sections, Implementation stages, task logs, decisions, artifacts, and code for a single feature.
- Provide onboarding kits for rotating developers or agents.
- Reduce time spent hunting for scattered context across `.acontext` and BMAD docs.

---

## When to Create a Bundle

| Trigger | Example |
|---------|---------|
| Feature spans multiple sprints/stages | Notifications, reporting, automation. |
| New engineer joining midstream | Need curated reading list to get productive quickly. |
| Repeated handoffs causing confusion | Documented bundles reduce redundant ramp-up time. |

---

## Naming

```
<feature-name>-context.md
```

Example: `task-management-context.md`

---

## Template

```markdown
# Feature Context: <Feature Name>

**Stage / Epic**: <Implementation stage or PRD epic>  
**Status**: planned | active | complete | deprecated  
**Last Updated**: YYYY-MM-DD  
**Primary Owner**: <name/role>

## Overview
One-paragraph description and value statement.

## BMAD References
- PRD: `<link or section>`
- Implementation: `<stage subsection>`
- Product_Backlog: `<entry IDs>`
- Active_Task: `<current tasks>`

## Related Work
### Task Logs
- [task-YYYY...](../tasks/task-YYYY...) — summary.

### Decisions
- [decision-YYYY...](../decisions/decision-YYYY...) — summary.

### Artifacts
- [artifact-YYYY...](../artifacts/artifact-YYYY...) — description.

## Code Map
| Path | Description |
|------|-------------|
| `src/...` | |

## Common Tasks
- How to add `<feature detail>`.
- How to debug `<scenario>`.
- How to extend `<component/service>`.

## Known Issues
- Link to Bug_tracking entries or task logs.

## Future Enhancements
- Bullet list from Product_Backlog.

## Onboarding Checklist
- [ ] Read PRD/Implementation sections above.
- [ ] Review listed task logs.
- [ ] Run through smoke tests.
- [ ] Pair with owner for review.

## References
- External docs, designs, user interviews.
```

---

## Process

1. Start a bundle stub when a feature enters Implementation.
2. Add links each time a related task log finishes.
3. Update status + notes when handing off the feature.
4. Archive bundles when the feature is deprecated.

Until bundles are needed, this README simply documents the approach so the team can activate it quickly.
