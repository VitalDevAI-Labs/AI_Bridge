# Project Structure & Conventions (Authoritative)

> **This document defines where every file lives and how to name, organize, and test code.** Follow this structure when creating, moving, or referencing files. Do not invent new top-level buckets without updating this file.

---

## 1. Purpose
- Provide a deterministic directory layout so agents know exactly where to create or edit files
- Capture naming conventions, import aliases, and lint rules to minimize code review friction
- Serve as the canonical reference for `AGENT_WORKFLOW.md` when it says "Check project_structure"

---

## 2. Repository Overview

```
llm-chat-links/
├── docs/                       # BMAD documentation framework
│   ├── README.md               # Framework overview
│   ├── Implementation.md       # Development plan
│   ├── quick_activation.md     # Quick start guide
│   ├── project_management/
│   │   ├── PRD-MVP.md          # Product requirements
│   │   ├── Product_Backlog.md  # Future features
│   │   └── Active_Task.md      # Current sprint tasks
│   ├── rule_book/
│   │   ├── project_structure.md # This file
│   │   ├── UI_UX_doc.md        # Design system
│   │   └── Bug_tracking.md     # Known issues
│   └── acontext/               # Execution tracking
│       ├── AGENT_WORKFLOW.md   # Task workflow
│       ├── QUICK_PROMPTS.md    # Agent prompts
│       ├── tasks/              # Task logs
│       ├── decisions/          # Decision records
│       ├── artifacts/          # Supporting files
│       └── context/            # Project context docs
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── auth/               # Auth UI (SignInForm, SignUpForm, AuthPage)
│   │   ├── ui/                 # shadcn primitives (Button, Card, Table, etc.)
│   │   ├── LlmLinkCard.tsx     # Link card component
│   │   ├── NewLinkForm.tsx     # Create link form
│   │   ├── ThemeToggle.tsx     # Dark/light mode toggle
│   │   └── UserProfile.tsx     # Profile dropdown
│   ├── config/                 # Constants, app types, URLs
│   ├── contexts/               # React contexts (AuthContext)
│   ├── hooks/                  # Reusable hooks (data, UI, utilities)
│   ├── lib/                    # Clients and utilities (supabase, utils)
│   ├── pages/                  # Route-level components (views)
│   ├── types/                  # Generated or app-specific type defs
│   ├── index.css               # Global styles (Tailwind base)
│   ├── main.tsx                # App bootstrap
│   └── App.tsx                 # Router and layout
├── README.md
└── package.json
```

---

## 3. Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| React Components | `PascalCase` | `UserProfile.tsx`, `LlmLinkCard.tsx` |
| Hooks | `camelCase` with 'use' prefix | `useAuth.ts`, `useLlmLinks.ts` |
| Utilities | `camelCase` | `formatDate.ts`, `cn.ts` |
| Types/Interfaces | `PascalCase` | `UserProfile`, `LlmLink` |
| Directories | `kebab-case` or `lowercase` | `auth/`, `components/`, `ui/` |
| Assets | `kebab-case` descriptive names | `app-logo.svg` |

**File naming:**
- React components: PascalCase files (e.g., `UserCard.tsx`)
- Non-components: camelCase or kebab-case as appropriate
- Keep UI primitives stateless; stateful composition belongs to feature components

---

## 4. Module Boundaries

### Components vs Pages
- **components/** contains reusable units with zero routing knowledge
- **pages/** map to navigation routes and compose components + data fetching hooks

### UI Primitives vs Features
- **components/ui/** must not import from feature code
- Feature components may compose primitives and hooks
- Pages should orchestrate features but keep logic in hooks/components

### Services & Utilities
- **lib/** contains external clients (Supabase) and adapters
- Keep utilities pure; no side effects
- Services export typed functions, not classes

### Contexts
- **contexts/** expose typed APIs and avoid leaking implementation details
- Keep context providers focused (one concern per context)
- Document usage patterns in the context file

---

## 5. Import Paths & Order

The project uses path aliases configured in `tsconfig.json`:
```
@/*  → src/*
```

**Import order (top ➜ bottom):**
1. React and external packages
2. Absolute aliases (`@/components`, `@/hooks`, etc.)
3. Relative paths
4. Styles

Example:
```typescript
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';

import './styles.css';
```

---

## 6. Placement Rules

### Adding New Components
- New UI primitives go in `src/components/ui/` and follow shadcn/ui patterns
- Feature components belong in `src/components/` or under a feature folder when it grows
- Route-level views live in `src/pages/`

### Adding New Functionality
- Cross-cutting hooks in `src/hooks/` (prefer single-responsibility hooks)
- External clients and adapters belong to `src/lib/`
- App-wide configs and types in `src/config/` and `src/types/`
- Context providers in `src/contexts/`

### Auth System Files
- `src/contexts/AuthContext.tsx` — username-based auth provider
- `src/components/auth/SignInForm.tsx` — username+password sign-in
- `src/components/auth/SignUpForm.tsx` — email+username+password sign-up

---

## 7. Adding a New Feature (Checklist)

When implementing a new feature, follow these steps:

1. **Define Data Model & Types**
   - Create types in `src/config/types.ts` or `src/types/`
   - Define database schema if needed

2. **Create Data Access Hooks**
   - Build hooks for data access in `src/hooks/`
   - Use TanStack Query for server state

3. **Build UI Components**
   - Create presentational components in `src/components/` using `components/ui` primitives
   - Follow `UI_UX_doc.md` for visual rules and a11y

4. **Wire into Pages**
   - Create or update page under `src/pages/`
   - Compose components and hooks

5. **Add Routing**
   - Add route in `src/App.tsx`
   - Test navigation flow

6. **Update Documentation**
   - Update `docs/Implementation.md` taskboard
   - Create task log in `docs/acontext/tasks/`
   - Document decisions in `docs/acontext/decisions/` if needed

---

## 8. Styles and Themes

### Global Styles
- Global styles live in `src/index.css`
- Tailwind config in `tailwind.config.ts` controls theme tokens
- Use `ThemeToggle` and `next-themes` for theme switching

### Component Styling
- Use Tailwind utility classes primarily
- Follow shadcn/ui patterns for consistency
- Avoid hard-coded colors; prefer theme tokens/classes
- Use `cn()` utility from `lib/utils` for conditional classes

---

## 9. Testing Layout (Future)

```
src/
  components/
    ComponentName.tsx
    ComponentName.test.tsx  # Co-located component tests
  __tests__/                # Shared test utilities
tests/                      # Integration and E2E tests
```

When adding tests:
- Place component tests beside components: `ComponentName.test.tsx`
- Integration tests under `tests/` directory
- Follow existing patterns and coverage standards

---

## 10. TypeScript Usage

- **Strict mode enabled**: All type errors must be resolved
- **Prefer explicit types**: Define prop interfaces
- **Avoid `any`**: Use `unknown` and type guards when needed
- **Generate types from Supabase**: Keep database types in sync
- **Export types**: Make interfaces and types reusable

Example:
```typescript
interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  // Component implementation
};
```

---

## 11. Git & Branching

- **Branch naming**: `feature/TASK-###-short-name`
- **Commit messages**: Conventional commits format
  - `feat(scope): add new feature`
  - `fix(scope): resolve bug`
  - `docs(scope): update documentation`
- **PR requirements**:
  - Include doc updates (`Active_Task.md`, task logs) in the same PR as code
  - Reference task IDs in PR description
  - Include screenshots for UI changes

---

## 12. Code Comments & Patterns

- **Prefer self-documenting code**: Use clear names over comments
- **Comment for context**: Explain "why", not "what"
- **Use TypeScript types**: Types serve as inline documentation
- **Document complex logic**: Explain non-obvious patterns or workarounds
- **Avoid TODO comments**: Create tasks in `Active_Task.md` instead

---

### Checklist for Contributors

Before creating or modifying files:

- [ ] The directory you are about to touch exists in this file; if not, update the structure first
- [ ] New files follow the naming conventions above
- [ ] Components use TypeScript with explicit prop types
- [ ] Imports follow the established order
- [ ] UI components follow `UI_UX_doc.md` standards
- [ ] Tests are co-located with their modules (when test suite is established)
- [ ] Documentation updated in `docs/Implementation.md` and task logs
- [ ] Changes align with current Implementation stage

---

**Remember**: This structure ensures consistency across the codebase and makes it easy for any developer or AI agent to know exactly where files should live and how they should be named.
