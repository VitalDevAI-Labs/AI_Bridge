# BMAD Context-Driven Development Framework

> **Transform any project into a context-aware, agent-friendly development environment**

This documentation framework implements the **BMAD (Business Model Architecture Documentation) approach** combined with **AContext execution tracking** to create a systematic, repeatable development workflow that works with human developers and AI agents alike.

---

## 🎯 What This Framework Does

**For Developers:**
- Provides clear project context and guidelines for every task
- Eliminates "where do I start?" and "what should I build?" confusion
- Creates a shared understanding across team members
- Maintains project history and decision rationale

**For AI Agents:**
- Gives agents comprehensive context about your project
- Enforces consistent coding standards and file organization
- Tracks all work with detailed execution logs
- Prevents agents from making assumptions or "hallucinating" requirements

**For Teams:**
- Enables seamless handoffs between developers
- Maintains institutional knowledge even as team members change
- Provides clear escalation paths for blockers and decisions
- Creates audit trails for all development work

---

## 📁 Framework Structure

```
docs/
├── README.md                    # This guide
├── Implementation.md            # Current development plan & stages
├── project_management/          # Product & task management
│   ├── PRD-MVP.md              # Product requirements & vision
│   ├── Product_Backlog.md      # Future features & ideas
│   └── Active_Task.md          # Current sprint tasks
├── rule_book/                   # Development standards
│   ├── project_structure.md    # File organization rules
│   ├── UI_UX_doc.md            # Design system & components
│   └── Bug_tracking.md         # Known issues & fixes
└── acontext/                    # Execution tracking & workflows
    ├── Developer Playbook.md   # Complete workflow guide
    ├── AGENT_WORKFLOW.md       # Step-by-step task execution
    ├── QUICK_PROMPTS.md        # Copy-paste agent prompts
    ├── README.md               # AContext system overview
    └── tasks/                  # Execution logs & history
        ├── TASK_TEMPLATE.md    # Template for new task logs
        ├── task-index.md       # Master registry of all work
        └── task-YYYYMMDD-*.md  # Individual task execution logs
```

---

## 🚀 Quick Start Guide

### Step 1: Copy Framework to Your Project

```bash
# Clone or copy this docs folder to your project root
cp -r /path/to/this/docs /your/project/docs
```

### Step 2: Customize Core Documents

Fill out these **7 essential files** with your project information:

#### 1. **`project_management/PRD-MVP.md`** - Product Vision
- Define what you're building and why
- List all features and user stories
- Set success metrics and goals

#### 2. **`Implementation.md`** - Development Plan
- Replace `<Name>` with your project name
- Fill in your tech stack (React, Node.js, etc.)
- Define development stages and milestones
- Set current stage and objectives

#### 3. **`rule_book/project_structure.md`** - File Organization
- Define your folder structure (`src/`, `components/`, etc.)
- Set naming conventions for files and functions
- Specify where different types of code should live

#### 4. **`rule_book/UI_UX_doc.md`** - Design Standards
- Define your color palette and typography
- List reusable components and their usage
- Set accessibility and responsive design rules

#### 5. **`project_management/Product_Backlog.md`** - Future Work
- List features not in current development
- Capture ideas and enhancement requests
- Prioritize future development phases

#### 6. **`project_management/Active_Task.md`** - Current Work
- Break down current stage into specific tasks
- Set acceptance criteria for each task
- Track task status and ownership

#### 7. **`rule_book/Bug_tracking.md`** - Issue Management
- Document known bugs and their status
- Track fixes and their implementation
- Maintain troubleshooting knowledge

### Step 3: Start Development with Context

Use this prompt with any AI agent or share with team members:

```
You are working on [PROJECT NAME] in this directory.

MANDATORY: Before any coding, read these context documents:
- docs/project_management/PRD-MVP.md (product vision)
- docs/Implementation.md (current development plan)  
- docs/rule_book/project_structure.md (file organization)
- docs/rule_book/UI_UX_doc.md (design standards)
- docs/rule_book/Bug_tracking.md (known issues)

WORKFLOW RULES:
1. Every task must align with Implementation.md stages
2. All files must follow project_structure.md conventions
3. UI work must comply with UI_UX_doc.md standards
4. Check Bug_tracking.md before starting any fix
5. Create task log in docs/acontext/tasks/ for significant work

If code conflicts with documentation, update docs first, then code.
```

---

## 🔄 Development Workflow

### The BMAD Development Cycle

```
PLAN → EXECUTE → DOCUMENT → SHIP
   ↑                         ↓
   └───────────FEEDBACK──────┘
```

#### Phase 1: Plan (Doc-First)
1. **Check Active Tasks**: Find your task in `Active_Task.md`
2. **Read Context**: Review relevant sections in Implementation.md
3. **Understand Structure**: Check `project_structure.md` for file placement
4. **Review Standards**: Check `UI_UX_doc.md` for design requirements
5. **Search History**: Look in `acontext/tasks/task-index.md` for related work

#### Phase 2: Execute (Work + Log)
1. **Create Task Log**: Copy `acontext/tasks/TASK_TEMPLATE.md`
2. **Name It**: `task-YYYYMMDD-NNN-brief-description.md`
3. **Fill Context**: Goal, dependencies, plan before coding
4. **Code & Log**: Update log with steps, decisions, challenges
5. **Track Files**: List every file created/modified

#### Phase 3: Document & Verify
1. **Validate Success**: Check acceptance criteria from `Active_Task.md`
2. **Complete Log**: Fill outcome, validation, next steps
3. **Update Index**: Add entry to `task-index.md`
4. **Cross-Reference**: Link to related tasks, PRs, decisions

#### Phase 4: Ship
1. **Stage Everything**: Code AND documentation changes
2. **Commit Message**: Reference task log ID
3. **Update Status**: Mark task complete in `Active_Task.md`
4. **Notify Team**: Share completion and any blockers

---

## 🤖 Working with AI Agents

### Essential Agent Prompts

#### Starting a New Feature
```
Task: [DESCRIBE TASK]
Source: Implementation.md Stage [N], Active_Task [ID]

Before coding:
1. Read docs/Implementation.md section [X]
2. Read docs/rule_book/project_structure.md for file placement
3. Read docs/rule_book/UI_UX_doc.md if UI work involved
4. Check docs/acontext/tasks/task-index.md for related history

Action:
1. Create task log docs/acontext/tasks/task-YYYYMMDD-NNN-[name].md
2. Fill goal, context, BMAD references, and plan
3. Follow docs/acontext/AGENT_WORKFLOW.md
4. Update task-index and Active_Task when done
```

#### Investigating a Bug
```
Bug: [DESCRIBE BUG]

Process:
1. Check docs/rule_book/Bug_tracking.md for previous context
2. Create task log task-YYYYMMDD-NNN-fix-[name].md
3. Document reproduction steps, root cause, fix
4. Add entry to Bug_tracking.md with resolution
```

#### Continuing Previous Work
```
Resume: task-YYYYMMDD-NNN-[name]

Process:
1. Read the task log's "Next Steps" and "Challenges"
2. Continue work, logging new progress
3. Update status when pausing or completing
```

### Agent Success Metrics
- ≥ 95% of commits reference a task log
- All task logs completed within 24 hours of work
- Active_Task.md stays synchronized with actual work
- No orphaned code that doesn't trace to requirements

---

## 📋 Document Reference Guide

### Core BMAD Documents

| Document | Purpose | When to Update | Key Sections |
|----------|---------|----------------|--------------|
| **PRD-MVP.md** | Product vision & requirements | When scope changes | Features, user stories, success metrics |
| **Implementation.md** | Current development plan | Weekly or per stage | Current stage, tech stack, exit criteria |
| **project_structure.md** | File organization rules | When adding new patterns | Directory structure, naming conventions |
| **UI_UX_doc.md** | Design system & standards | When design evolves | Components, colors, typography |
| **Product_Backlog.md** | Future features & ideas | When new ideas emerge | Prioritized feature list |
| **Active_Task.md** | Current sprint work | Daily | Task status, acceptance criteria |
| **Bug_tracking.md** | Known issues & fixes | When bugs found/fixed | Bug status, reproduction steps |

### AContext Execution Documents

| Document | Purpose | When to Use | Key Information |
|----------|---------|-------------|-----------------|
| **Developer Playbook.md** | Complete workflow guide | First day, when confused | End-to-end process, troubleshooting |
| **AGENT_WORKFLOW.md** | Step-by-step task execution | Every task | 4-phase workflow, verification checklist |
| **QUICK_PROMPTS.md** | Copy-paste agent prompts | When working with AI | Ready-to-use prompt templates |
| **task-index.md** | Master registry of all work | Daily updates | Chronological work history |
| **TASK_TEMPLATE.md** | Template for new logs | Starting any significant task | Standard log structure |

---

## 🔍 Finding Information Quickly

### Common Questions & Where to Look

| Question | Check This Document | Specific Section |
|----------|-------------------|------------------|
| "What am I building?" | PRD-MVP.md | Features & User Stories |
| "What should I work on next?" | Active_Task.md | Current Tasks |
| "Where does this file go?" | project_structure.md | Directory Structure |
| "How should this UI look?" | UI_UX_doc.md | Components & Design Tokens |
| "Has this been tried before?" | task-index.md | Search by keyword |
| "What's the current tech stack?" | Implementation.md | Stack section |
| "Is this a known bug?" | Bug_tracking.md | Known Issues |
| "What's planned for later?" | Product_Backlog.md | Future Features |

### Search Strategies

1. **Start with BMAD docs** for scope and standards
2. **Check task-index.md** for historical context
3. **Use file search** across `acontext/` for keywords
4. **Review related task logs** for detailed implementation history

---

## 🛠 Maintenance & Best Practices

### Daily Rituals
- [ ] Update running task logs with progress
- [ ] Check Active_Task.md for status changes
- [ ] Commit code with task log references

### Weekly Rituals
- [ ] Review task-index.md for accuracy
- [ ] Archive completed task logs if needed
- [ ] Update Implementation.md stage progress
- [ ] Promote important decisions to permanent docs

### Monthly Rituals
- [ ] Review and update all BMAD documents
- [ ] Archive old task logs to keep system fast
- [ ] Update workflow documents based on lessons learned
- [ ] Validate cross-references between documents

### Quality Gates (Before Any Code Review)

- [ ] **Context**: Task log exists and references BMAD docs
- [ ] **Scope**: Work matches Implementation.md stage
- [ ] **Structure**: Files follow project_structure.md rules
- [ ] **Design**: UI complies with UI_UX_doc.md standards
- [ ] **Tests**: Coverage updated or deferred with reason
- [ ] **Docs**: All relevant documents updated

---

## 🚨 Troubleshooting Common Issues

### "Agent is creating files in wrong places"
**Solution**: Update `project_structure.md` with clearer rules and enforce in code reviews

### "UI doesn't match design standards"
**Solution**: Require agents to quote relevant `UI_UX_doc.md` sections before coding

### "Missing task logs for completed work"
**Solution**: Reinforce "one log per task" rule; only skip for <5 minute changes

### "Active_Task.md is out of sync"
**Solution**: Add daily check-in ritual; tie task completion to doc updates

### "Duplicate work being done"
**Solution**: Always search `task-index.md` before starting new work

### "Context documents are stale"
**Solution**: Assign document owners; review and update during sprint planning

---

## 🎓 Advanced Usage

### Custom Workflows
- Modify `AGENT_WORKFLOW.md` for team-specific processes
- Add custom prompts to `QUICK_PROMPTS.md`
- Create project-specific task templates

### Integration with Tools
- Link task logs to GitHub issues/PRs
- Connect to project management tools
- Integrate with CI/CD for automated validation

### Scaling for Large Teams
- Assign document stewards for each BMAD doc
- Create feature-specific context bundles
- Implement automated consistency checking

### Multi-Project Usage
- Maintain separate docs folder per project
- Share common templates across projects
- Version control documentation alongside code

---

## 📈 Success Indicators

Your BMAD framework is working well when:

✅ **New team members** can be productive within one day  
✅ **AI agents** consistently follow project standards  
✅ **Code reviews** focus on logic, not structure or standards  
✅ **Project context** is never lost during handoffs  
✅ **Decisions** are documented and easily retrievable  
✅ **Work** is never duplicated or conflicts with existing code  
✅ **Standards** are consistently applied across all code  

---

## 🤝 Contributing to This Framework

### Improving Documentation
1. Update documents when you find gaps or confusion
2. Add examples and clarifications based on real usage
3. Keep cross-references updated when structure changes

### Sharing Improvements
1. Document successful patterns in `acontext/decisions/`
2. Update workflow documents with lessons learned
3. Share effective prompts and templates with the team

### Version Control
- Commit documentation changes with code changes
- Tag major framework updates for easy rollback
- Maintain changelog for framework evolution

---

## 📞 Getting Help

### Quick Reference
- **Workflow confusion**: Read `acontext/Developer Playbook.md`
- **Agent not working**: Check `acontext/AGENT_WORKFLOW.md`
- **Need prompts**: Use `acontext/QUICK_PROMPTS.md`
- **Historical context**: Search `acontext/tasks/task-index.md`

### Escalation Path
1. **Check documentation** first (this README + specific docs)
2. **Search task history** for similar issues
3. **Create task log** documenting the problem
4. **Update relevant docs** with solution for next time

---

**Remember**: The goal is context-driven development where every decision is documented, every task is tracked, and every team member (human or AI) has the context they need to be productive immediately.

Start small, be consistent, and let the framework evolve with your project needs.