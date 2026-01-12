## UI/UX Guidelines (Context-Driven)

This file defines the shared visual language, component usage rules, and accessibility standards. Consult it before changing UI.

Design System
- Frameworks: Tailwind CSS + shadcn/ui
- Icons: Lucide
- Theming: `next-themes` with system, light, dark

Color Roles
- Background: uses Tailwind semantic tokens as configured
- Surface: cards and panels use glass morphism variants where appropriate
- Primary: actions (e.g., submit) — default blue variant used in auth forms
- Feedback: success, warning, destructive mapped to shadcn/ui variants

Typography
- Base: Tailwind defaults
- Headings: semantic `<h1..h6>`; do not fake with `<div>`
- Labels: `Label` component for all form inputs

Spacing & Layout
- Use Tailwind spacing scale; avoid arbitrary values when possible
- Grids for cards; responsive columns by breakpoints
- Tables should remain horizontally scrollable on small screens

Components
- Buttons: use `Button` variants; avoid custom ad-hoc classes for states
- Cards: prefer `card` primitives for visual consistency
- Inputs: always use `Input` + `Label`; include icons when helpful
- Tables: use TanStack Table patterns; sorting/filtering affordances visible
- Toasts: brief, non-blocking; use for success/error feedback

States and Feedback
- Loading: show spinners (e.g., `Loader2`) and disable actions
- Empty: provide helpful copy and a primary action
- Error: concise messages; avoid leaking technical details to end-users

Accessibility (WCAG-minded)
- Keyboard: all interactive controls tabbable and focus-ring visible
- Labels: every input paired with `htmlFor` and visible label
- Contrast: meet AA contrast in both themes
- Icons: decorative icons should have `aria-hidden="true"`
- Live regions: toast/alerts should announce politely

Responsive Behavior
- Mobile-first; confirm layouts at sm, md, lg breakpoints
- Card grids collapse to 1 col on small screens
- Table columns prioritize visibility; hide non-critical columns on small screens when needed

Theming
- Respect user system theme by default; allow manual toggle via `ThemeToggle`
- Avoid hardcoded colors; prefer theme tokens/classes

Auth Screens
- Use username-based copy; avoid mentioning email on sign-in
- Forms must provide show/hide password toggles and descriptive errors

Component Examples (authoritative references)
- `src/components/auth/SignInForm.tsx`
- `src/components/auth/SignUpForm.tsx`
- `src/components/LlmLinkCard.tsx`
- `src/pages/LlmLinksTablePage.tsx`

UI Review Checklist
- Visual consistency with shadcn primitives
- a11y checks above pass
- States covered: loading/empty/error
- No layout shift on interaction


