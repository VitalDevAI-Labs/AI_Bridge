## Project Structure (Authoritative)

Follow this structure when creating, moving, or referencing files. Do not invent new top-level buckets without updating this file.

Top-level
```
llm-chat-links/
├─ Docs/                       # Context: implementation, structure, UI/UX, bugs
├─ public/                     # Static assets
├─ src/
│  ├─ components/
│  │  ├─ auth/                 # Auth UI (signin/signup/auth page)
│  │  ├─ ui/                   # Shadcn primitives (button, card, table...)
│  │  ├─ LlmLinkCard.tsx
│  │  ├─ NewLinkForm.tsx
│  │  ├─ ThemeToggle.tsx
│  │  └─ UserProfile.tsx
│  ├─ config/                  # Constants, app types, URLs
│  ├─ contexts/                # React contexts (e.g., AuthContext)
│  ├─ hooks/                   # Reusable hooks (data, UI, utilities)
│  ├─ lib/                     # Clients and utilities (supabase, utils)
│  ├─ pages/                   # Route-level components (views)
│  ├─ types/                   # Generated or app-specific type defs
│  ├─ index.css                # Global styles (Tailwind base)
│  ├─ main.tsx                 # App bootstrap
│  └─ App.tsx                  # Router and layout
├─ README.md
├─ AUTHENTICATION_SETUP.md
└─ package.json
```


### Placement Rules
- New UI primitives go in `src/components/ui/` and follow existing patterns
- Feature components belong in `src/components/` or under a feature folder when it grows
- Route-level views live in `src/pages/`
- Cross-cutting hooks in `src/hooks/` (prefer single-responsibility hooks)
- External clients and adapters belong to `src/lib/`
- App-wide configs and types in `src/config/` and `src/types/`
- Context providers in `src/contexts/`


### Naming and Conventions
- Files: PascalCase for React components, kebab-case or lowercase for non-components where appropriate
- Components export a single default or named component per file
- Keep UI primitives stateless; stateful composition belongs to feature components
- Prefer explicit props interfaces; avoid `any`


### Module Boundaries
- UI primitives (`components/ui`) must not import from feature code
- Feature components may compose primitives and hooks
- Pages should orchestrate features but keep logic in hooks/components
- Contexts expose typed APIs and avoid leaking implementation details


### Auth System Files
- `src/contexts/AuthContext.tsx` — username-based auth provider
- `src/components/auth/SignInForm.tsx` — username+password sign-in
- `src/components/auth/SignUpForm.tsx` — email+username+password sign-up


### Adding a New Feature (Checklist)
1) Define the API/data model and types in `src/config/types.ts` or `src/types/`
2) Create hooks for data access in `src/hooks/`
3) Build presentational components in `src/components/` using `components/ui`
4) Wire into a page under `src/pages/`
5) Add route in `src/App.tsx`
6) Follow `UI_UX_doc.md` for visual rules and a11y
7) Update `Docs/Implementation.md` taskboard


### Styles and Themes
- Global styles live in `src/index.css`
- Tailwind config in `tailwind.config.ts` controls theme tokens
- Use `ThemeToggle` and `next-themes` for theme switching


### Import Paths
- Use path aliases as configured by the project (e.g., `@/hooks/useLlmLinks`)
- Keep imports relative within a domain when appropriate; avoid deep brittle paths


### Tests (Future)
- Place component tests beside components: `ComponentName.test.tsx`
- Integration tests under `tests/` when added


