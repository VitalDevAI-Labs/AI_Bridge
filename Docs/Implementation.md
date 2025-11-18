## Implementation Plan (Context-Driven, BMAD-Aligned)

This document is the master plan for building and maintaining the project. It encodes the context-first workflow, aligns with the BMAD method, and defines the staged roadmap the developer agent must follow.

- Always consult this file before starting any work
- Follow the project structure rules in `project_structure.md`
- Follow the design and accessibility rules in `UI_UX_doc.md`
- Log bugs and fixes in `Bug_tracking.md`

Links
- Project README: `../README.md`
- Structure: `./project_structure.md`
- UI/UX: `./UI_UX_doc.md`
- Bug Tracking: `./Bug_tracking.md`


### Context Approach (What and Why)
Build with shared awareness: features, design, and implementation are tied together via documentation and workflow. BMAD’s agent roles and document sharding keep context modular and always available.


### BMAD Role Mapping for this Project
- Analyst → Captures product context in PRD (if provided) and market/feature rationale
- PM/PO → Prioritizes and writes acceptance criteria in this plan
- Architect → Chooses tech stack, defines architecture and security
- UX/UI → Maintains `UI_UX_doc.md` and design decisions
- Scrum Master → Slices tasks into small DONE-able items and tracks progress
- Developer → Implements tasks exactly as specified here and in structure/UI docs
- QA → Verifies acceptance criteria; blocks completion if criteria fail


### Tech Stack (Authoritative)
- React 18 + TypeScript — `https://react.dev` | `https://www.typescriptlang.org`
- Vite — `https://vitejs.dev`
- React Router — `https://reactrouter.com`
- TanStack Query — `https://tanstack.com/query/latest`
- TanStack Table — `https://tanstack.com/table/latest`
- Tailwind CSS — `https://tailwindcss.com`
- shadcn/ui — `https://ui.shadcn.com`
- Zod — `https://zod.dev`
- Supabase (Auth + Postgres) — `https://supabase.com/docs`


### Security & Authentication Context
Username-based authentication is implemented end-to-end using Supabase. Sign-in is username+password with server-side RPC for username→email resolution, profile auto-creation via trigger, and RLS enforcing per-user isolation. See `src/contexts/AuthContext.tsx`, `src/components/auth/SignInForm.tsx`, `src/components/auth/SignUpForm.tsx`. [[memory:9090766]]


### Feature Analysis
Must-have (implemented)
- [x] Username-based auth with secure RPC resolution and profile trigger
- [x] Private user-scoped LLM link data with RLS
- [x] Dual views: card and table with search/filter/sort
- [x] CRUD operations for links
- [x] Responsive UI, dark/light theme, toasts
- [x] Prompt Bank: Per-user prompt storage with search/filter/copy

Should-have (near-term)
- [ ] Favorite/bookmark links
- [ ] Link sharing (read-only links)
- [ ] Usage analytics basics
- [ ] Enhanced tagging and full-text search

Nice-to-have (later)
- [ ] PWA support
- [ ] Popularity tracking and recommendations
- [ ] Real-time collaboration
- [ ] Email notifications


### Staged Implementation Plan

Stage 1 — Foundation & Setup
- [x] Initialize React + Vite + TypeScript
- [x] Configure Tailwind + shadcn/ui
- [x] Configure Supabase client and envs (`src/lib/supabase.ts`)
- [x] Implement username-based auth flow with RPC + triggers
- [x] Establish RLS policies and tables (`database-setup.sql` in README)
- [x] Base navigation and routing

Acceptance criteria
- App boots with env vars configured
- Users can sign up/sign in/out; profile auto-created
- Data access is user-isolated via RLS


Stage 2 — Core Features
- [x] Card view with search/filter and quick actions
- [x] Table view with inline edit, sort, multi-filter
- [x] CRUD with validation and toasts
- [x] Profile dropdown with username edit
- [x] Prompt Bank with search, categories, tags, and copy
- [ ] Favorites/bookmarks with quick filter

Acceptance criteria
- Card/table parity for basic management
- Inline validation and optimistic UX where appropriate
- Prompt Bank: Users can create/search/filter/copy their own prompts

### Prompt Bank Feature (Stage 2.5)
Must-have (implemented)
- [x] Per-user prompt storage with RLS enforcement
- [x] Search/filter by text, category, and tags
- [x] One-click copy prompt to clipboard with toast feedback
- [x] CRUD operations with form validation
- [x] Responsive card grid layout matching Vital Theme
- [x] Full-text search via tsvector indexes (database ready)
- [x] Category and tag management with MultipleSelect
- [x] Mock data implementation for Phase 1 UI development

Acceptance criteria
- ✅ User can create/edit/delete their own prompts
- ✅ Search is debounced (300ms) and responsive
- ✅ Copy action shows success toast
- ✅ Design matches existing UI component patterns
- ✅ Categories and tags are dynamically populated from data
- ⏳ Database schema ready for Supabase integration (Phase 2)


Stage 3 — Advanced Features
- [ ] Link sharing (signed URLs or public views with policy)
- [ ] Usage analytics (basic metrics, client-only to start)
- [ ] Enhanced tagging, full-text search via Supabase
- [ ] Popularity tracking pipeline

Acceptance criteria
- Sharing respects RLS and explicit policies
- Analytics has privacy guardrails and opt-out


Stage 4 — Polish & Optimization
- [ ] Accessibility pass per `UI_UX_doc.md`
- [ ] Performance tuning (bundle, memoization, virtualization)
- [ ] Error boundaries and empty/loading states
- [ ] PWA (if prioritized) and deployment playbook

Acceptance criteria
- No critical a11y violations
- Lint passes; performance budgets met


### Workflow Rules (Non-negotiable)
1) Consult docs first:
   - Tasks → this file
   - File creation/placement → `project_structure.md`
   - UI decisions → `UI_UX_doc.md`
   - Bugs/errors → `Bug_tracking.md` before acting
2) Mark tasks complete only when:
   - Code works (manual test or QA verifies)
   - Structure and UI rules are followed
   - No lint/type errors
3) Commits and PRs:
   - Conventional commits
   - PR description: include context, acceptance criteria, screenshots (UI)


### Quality Gates
- TypeScript strict, ESLint clean
- a11y checklist satisfied for changed UI
- RLS remains enforced for all data access


### Taskboard (Live Checklist)
- Foundation: [x] Done
- Core: [x] Implemented; favorites pending
- Advanced: [ ] Not started
- Polish: [ ] Not started


### Acceptance Criteria Examples
- Favorites: user can mark/unmark a link; filter by favorites; persists per user
- Sharing: user can generate a share URL with revocation; no unintended data leaks


### Notes
- If a PRD exists, attach or link it here. If not, the README features list acts as the PRD baseline.


