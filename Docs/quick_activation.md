# BMAD Quick Activation Guide

> **Get your project running with BMAD context-driven development in 30 minutes**

This guide walks you through activating the BMAD framework in any project with specific examples and templates you can copy-paste.

---

## 🚀 30-Minute Activation Checklist

- [ ] **5 min**: Copy docs folder to your project
- [ ] **15 min**: Fill out 7 core documents with your project info
- [ ] **5 min**: Test with an AI agent using provided prompts
- [ ] **5 min**: Create your first task log

---

## Step 1: Copy Framework (2 minutes)

### Option A: Direct Copy
```bash
# Copy the entire docs folder to your project root
cp -r /path/to/bmad-docs/docs /your/project/docs
```

### Option B: Git Clone Method
```bash
# Clone the BMAD repository
git clone https://github.com/your-repo/bmad-framework.git
cd your-project
cp -r ../bmad-framework/docs ./docs
```

### Option C: Manual Download
1. Download the docs folder as ZIP
2. Extract to your project root
3. Rename if needed to match your structure

**Verify**: You should now have `docs/` folder with all subfolders in your project.

---

## Step 2: Customize Core Documents (15 minutes)

### Document 1: Product Vision (3 minutes)
**File**: `docs/project_management/PRD-MVP.md`

**Replace these sections:**
```markdown
# [YOUR PROJECT NAME] - Product Requirements Document

## Product Overview
**What**: [Describe your app/system in 1-2 sentences]
**Why**: [The problem you're solving]
**Who**: [Target users/customers]

## Core Features (MVP)
1. **[Feature 1]**: [Description and user value]
2. **[Feature 2]**: [Description and user value]
3. **[Feature 3]**: [Description and user value]

## Success Metrics
- [Metric 1]: [Target number]
- [Metric 2]: [Target number]
- [Metric 3]: [Target number]
```

**Example for a Task Management App:**
```markdown
# TaskFlow - Product Requirements Document

## Product Overview
**What**: A simple task management app with smart reminders
**Why**: People forget important tasks and miss deadlines
**Who**: Busy professionals and students who need better task organization

## Core Features (MVP)
1. **Task Creation**: Users can create tasks with due dates and priorities
2. **Smart Reminders**: Automatic notifications based on task urgency
3. **Progress Tracking**: Visual progress indicators and completion stats

## Success Metrics
- User Retention: 70% after 30 days
- Daily Active Users: 1000+ within 6 months
- Task Completion Rate: 85%+ for created tasks
```

### Document 2: Development Plan (4 minutes)
**File**: `docs/Implementation.md`

**Replace these placeholders:**

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `<Name>` | Your project name | TaskFlow App |
| `<Tech>` | Your technology stack | React Native, Node.js, PostgreSQL |
| `<Stage>` | Current development stage | Stage 1 - Core Experience |
| `<Owner>` | Project lead name | John Smith |

**Tech Stack Example:**
```markdown
## 2) Stack (only what matters this cycle)

| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| Frontend | React Native | 0.72+ | Cross-platform mobile |
| Backend | Node.js + Express | 18+ | REST API server |
| Database | PostgreSQL | 15+ | Primary data store |
| Auth | Firebase Auth | Latest | User authentication |
| Notifications | Expo Notifications | Latest | Push notifications |
| Hosting | Vercel + Railway | Latest | Frontend + Backend |
```

**Current Stage Example:**
```markdown
### Stage 1: Core Experience
- Window: Week 1-4 (Jan 2024)
- Goals: Users can create, edit, and complete tasks
- Key Tasks: 
  - TASK-001: Set up project structure
  - TASK-002: Implement task CRUD operations
  - TASK-003: Build basic UI components
- Dependencies: Design mockups, database schema
- Acceptance Criteria: Users can manage tasks end-to-end
- Risks & Mitigations: Database performance - use indexing
```

### Document 3: File Organization (2 minutes)
**File**: `docs/rule_book/project_structure.md`

**Add your project structure:**
```markdown
## Directory Structure

```
your-project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Generic components (Button, Input)
│   │   └── feature/        # Feature-specific components
│   ├── screens/            # Main app screens
│   ├── services/           # API calls and business logic
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript type definitions
│   └── assets/             # Images, fonts, etc.
├── tests/                  # Test files
├── docs/                   # BMAD documentation
└── package.json
```

## Naming Conventions
- **Files**: camelCase for JS/TS, kebab-case for assets
- **Components**: PascalCase (TaskCard.tsx)
- **Functions**: camelCase (getUserTasks)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL)
```

### Document 4: Design Standards (2 minutes)
**File**: `docs/rule_book/UI_UX_doc.md`

**Define your design system:**
```markdown
## Color Palette
- **Primary**: #007AFF (Blue)
- **Secondary**: #34C759 (Green)
- **Error**: #FF3B30 (Red)
- **Warning**: #FF9500 (Orange)
- **Background**: #F2F2F7 (Light Gray)
- **Text**: #000000 (Black), #8E8E93 (Gray)

## Typography
- **Headers**: SF Pro Display, Bold, 24px/20px/16px
- **Body**: SF Pro Text, Regular, 16px
- **Caption**: SF Pro Text, Regular, 12px

## Components
### TaskCard
- **Usage**: Display individual tasks in lists
- **Props**: title, dueDate, priority, completed
- **Styling**: White background, rounded corners, shadow

### PrimaryButton
- **Usage**: Main actions (Save, Create, Submit)
- **Styling**: Primary color background, white text, 44px height
```

### Document 5: Future Features (1 minute)
**File**: `docs/project_management/Product_Backlog.md`

**List future ideas:**
```markdown
# Product Backlog

## High Priority (Next Sprint)
- [ ] **Task Categories**: Organize tasks by project/category
- [ ] **Due Date Alerts**: Email/SMS notifications for overdue tasks
- [ ] **Task Templates**: Pre-defined task templates for common workflows

## Medium Priority (Next Quarter)
- [ ] **Team Collaboration**: Share tasks with team members
- [ ] **Calendar Integration**: Sync with Google Calendar/Outlook
- [ ] **Analytics Dashboard**: Task completion trends and insights

## Low Priority (Future)
- [ ] **AI Task Suggestions**: Smart task recommendations
- [ ] **Voice Input**: Create tasks via voice commands
- [ ] **Offline Mode**: Work without internet connection
```

### Document 6: Current Tasks (2 minutes)
**File**: `docs/project_management/Active_Task.md`

**Break down current work:**
```markdown
# Active Tasks - Sprint 1

## Current Stage: Stage 1 - Core Experience

### TASK-001: Project Setup & Foundation
**Status**: In Progress  
**Owner**: Developer  
**Due**: End of Week 1  
**Acceptance Criteria**:
- [ ] Project structure matches project_structure.md
- [ ] Basic navigation between screens works
- [ ] Database connection established
- [ ] Authentication flow implemented

### TASK-002: Task CRUD Operations
**Status**: Not Started  
**Owner**: Developer  
**Due**: End of Week 2  
**Acceptance Criteria**:
- [ ] Users can create new tasks
- [ ] Users can edit existing tasks
- [ ] Users can mark tasks as complete
- [ ] Users can delete tasks
- [ ] All operations persist to database

### TASK-003: Basic UI Implementation
**Status**: Not Started  
**Owner**: Developer  
**Due**: End of Week 3  
**Acceptance Criteria**:
- [ ] Task list screen displays all tasks
- [ ] Task creation form follows UI_UX_doc.md
- [ ] Task editing works inline or in modal
- [ ] UI matches design specifications
```

### Document 7: Bug Tracking (1 minute)
**File**: `docs/rule_book/Bug_tracking.md`

**Start with template:**
```markdown
# Bug Tracking

## Known Issues

### BUG-001: [Bug Title]
**Status**: Open  
**Priority**: High/Medium/Low  
**Reported**: YYYY-MM-DD  
**Description**: [What's wrong]  
**Reproduction Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
**Expected**: [What should happen]  
**Actual**: [What actually happens]  
**Fix**: [Solution when found]  

## Resolved Issues
[Move completed bugs here with resolution details]

## Common Issues & Solutions
- **Issue**: [Common problem]
  **Solution**: [How to fix it]
```

---

## Step 3: Test with AI Agent (5 minutes)

### Copy-Paste Agent Prompt
```
You are my development agent for [YOUR PROJECT NAME] in this directory.

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

Current task: [DESCRIBE WHAT YOU WANT THE AGENT TO DO]
```

### Test Commands
Ask your agent to:
1. **"Read the project context and summarize what we're building"**
2. **"What should be the next task according to Active_Task.md?"**
3. **"Where should I create a new component according to project_structure.md?"**

If the agent answers correctly using your documentation, BMAD is working!

---

## Step 4: Create Your First Task Log (5 minutes)

### Copy Task Template
```bash
cp docs/acontext/tasks/TASK_TEMPLATE.md docs/acontext/tasks/task-$(date +%Y%m%d)-001-setup-project.md
```

### Fill Out Your First Log
**File**: `docs/acontext/tasks/task-YYYYMMDD-001-setup-project.md`

```markdown
# Task Log: Set Up Project Foundation

**ID**: task-20240115-001  
**Date**: 2024-01-15  
**Status**: in-progress  
**Related Epic / Stage**: Stage 1 - Core Experience  
**Active Task Ref**: TASK-001 (Project Setup & Foundation)  
**BMAD Docs Consulted**: Implementation.md §Stage 1, project_structure.md §Directory Rules

---

## Goal
Establish the baseline project structure, install dependencies, and set up development environment according to BMAD documentation.

---

## Context
- **Branch / Environment**: main
- **Dependencies**: Node.js 18+, React Native CLI
- **Constraints**: Must follow project_structure.md exactly
- **Related Work**: First task in project

---

## Plan
1. Initialize React Native project
2. Set up folder structure per project_structure.md
3. Install required dependencies
4. Configure development tools (ESLint, Prettier)
5. Create basic navigation structure

---

## Steps Taken
1. [Update as you work]
2. [Document each major step]

---

## Decisions Made
[Document any choices you make and why]

---

## Challenges
[Note any problems and how you solved them]

---

## Artifacts
[List all files created/modified]

---

## Outcome
[Fill when complete]

---

## Next Steps
[What should happen next]
```

### Update Task Index
Add entry to `docs/acontext/tasks/task-index.md`:
```markdown
| Date | ID | Title | Status | Epic | Owner |
|------|----|----|--------|------|-------|
| 2024-01-15 | task-20240115-001 | Set Up Project Foundation | in-progress | Stage 1 | Developer |
```

---

## ✅ Activation Complete!

You now have:
- ✅ Complete BMAD documentation for your project
- ✅ Context-aware development environment
- ✅ AI agent that understands your project
- ✅ Task tracking system in place
- ✅ Clear workflow for all future development

---

## 🎯 Next Steps

### Immediate (Today)
1. **Start your first real task** from Active_Task.md
2. **Create task log** for any significant work
3. **Test agent prompts** with actual development tasks

### This Week
1. **Update documents** as you learn more about your project
2. **Add team members** by sharing this activation guide
3. **Refine workflows** based on what works for your team

### Ongoing
1. **Maintain task logs** for all development work
2. **Update BMAD docs** when requirements change
3. **Archive completed work** to keep system fast

---

## 🆘 Troubleshooting

### "Agent isn't following my project structure"
- **Check**: Is `project_structure.md` specific enough?
- **Fix**: Add more detailed examples and rules

### "Task logs feel like overhead"
- **Check**: Are you logging trivial tasks?
- **Fix**: Only log tasks that take >15 minutes

### "Documentation gets out of sync"
- **Check**: Are you updating docs when code changes?
- **Fix**: Make doc updates part of your commit process

### "Team members aren't using the system"
- **Check**: Did everyone read this activation guide?
- **Fix**: Do a team walkthrough of the BMAD workflow

---

## 📞 Need Help?

1. **Read the main README.md** for comprehensive guidance
2. **Check acontext/Developer Playbook.md** for detailed workflows
3. **Use acontext/QUICK_PROMPTS.md** for ready-made agent prompts
4. **Search task-index.md** for examples of similar work

**Remember**: The goal is to never start development without context. Every task should connect to your BMAD documentation, and every decision should be captured for future reference.

---

**🎉 Congratulations! Your project is now running with context-driven development. Every team member and AI agent will have the context they need to be immediately productive.**