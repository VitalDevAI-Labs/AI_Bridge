# Artifacts – Code Snapshot Guide (Template)

> Use this folder to capture narrative snapshots of important files when git diffs are not enough. Keep it lightweight until you have a concrete need; the template below shows how to contribute entries.

---

## When to Create an Artifact

- A refactor fundamentally changes how a module works.
- A workaround or spike introduces non-obvious patterns.
- A file encodes domain knowledge that should be searchable without checking out code.
- You want before/after context tied to a specific task log.

Skip artifacts for trivial edits, formatting, or changes already well documented in a task log.

---

## Naming

```
artifact-YYYYMMDD-src-path-to-file.md
```

Example: `artifact-20251210-src-services-notificationService.md`

---

## Template

```markdown
# Artifact: src/path/to/file.ts

**Date**: YYYY-MM-DD  
**Related Task**: [task-YYYYMMDD-NNN-name](../tasks/task-YYYYMMDD-NNN-name.md)  
**Type**: initial | refactor | investigation  
**Status**: active | deprecated

## Snapshot
Explain the current structure or include a trimmed code block illustrating the important sections. Focus on the essence, not the entire file.

## Why This Matters
- Reason the file exists.
- Constraints that shaped the implementation.

## Alternatives Considered
- Option A – pros/cons.
- Option B – pros/cons.

## Future Considerations
- Known limitations.
- Signals to revisit this implementation.

## References
- Links to commits, decisions, or documentation.
```

---

## Process

1. Create the Markdown file following the template.
2. Link to it from the associated task log and, if appropriate, Implementation or project_structure.
3. Update or retire the artifact when the underlying file changes significantly.

---

Keep this folder empty until a real need arises. The template above ensures consistency once you start capturing artifacts.
