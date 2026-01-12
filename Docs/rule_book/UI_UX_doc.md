# UI / UX Guidelines (Context-Driven)

> **This file defines the shared visual language, component usage rules, and accessibility standards.** Consult it before changing UI to ensure consistency across the application.

---

## 1. Design System

### Frameworks & Tools
- **CSS Framework**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Icons**: Lucide React
- **Theming**: next-themes (system, light, dark)

---

## 2. Design Tokens

### 2.1 Color Roles

Colors use Tailwind semantic tokens as configured in `tailwind.config.ts`:

| Role | Usage | Tailwind Classes |
|------|-------|-----------------|
| **Background** | Page and card backgrounds | `bg-background`, `bg-card` |
| **Foreground** | Text and content | `text-foreground`, `text-muted-foreground` |
| **Primary** | Main actions (submit, primary buttons) | `bg-primary`, `text-primary` |
| **Secondary** | Secondary actions | `bg-secondary`, `text-secondary` |
| **Accent** | Highlights and emphasis | `bg-accent`, `text-accent` |
| **Destructive** | Delete, cancel actions | `bg-destructive`, `text-destructive` |
| **Muted** | Subtle backgrounds | `bg-muted`, `text-muted-foreground` |
| **Border** | Component borders | `border-border` |

**Important**: Avoid hardcoded colors. Always use Tailwind theme tokens/classes to ensure theme consistency.

### 2.2 Typography

| Element | Semantic Tag | Tailwind Classes | Usage |
|---------|-------------|------------------|-------|
| **Page Headings** | `<h1>` | `text-3xl font-bold` | Main page title |
| **Section Headings** | `<h2>` | `text-2xl font-semibold` | Section headers |
| **Subsections** | `<h3>` | `text-xl font-medium` | Subsection headers |
| **Body Text** | `<p>` | `text-base` | Paragraph content |
| **Small Text** | `<p>` or `<span>` | `text-sm` | Captions, helper text |
| **Form Labels** | `<label>` | Use `Label` component | All form inputs |

**Rules**:
- Use semantic HTML tags (`<h1..h6>`) - do not fake headings with `<div>`
- Always pair inputs with `Label` component
- Maintain consistent text hierarchy

### 2.3 Spacing & Layout

**Tailwind Spacing Scale**:
- Use Tailwind's spacing scale: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
- Avoid arbitrary values like `p-[13px]` when possible
- Maintain consistent spacing throughout the app

**Responsive Layout**:
| Breakpoint | Width | Tailwind Prefix |
|-----------|-------|-----------------|
| Mobile | 0-639px | (default) |
| Tablet | 640-1023px | `sm:` |
| Desktop | 1024px+ | `lg:` |

**Layout Patterns**:
- **Card Grids**: Responsive columns by breakpoints
- **Tables**: Horizontally scrollable on small screens
- **Forms**: Single column on mobile, multi-column on desktop where appropriate

---

## 3. Component Library

### 3.1 Buttons

**Component**: `Button` from `@/components/ui/button`

**Variants**:
- `default` (primary): Main actions
- `secondary`: Secondary actions
- `ghost`: Subtle actions
- `destructive`: Delete/cancel
- `outline`: Bordered buttons
- `link`: Text-only buttons

**States**: default, hover, pressed, loading, disabled

**Usage Example**:
```tsx
<Button variant="default">Save</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Cancel</Button>
```

**Rules**:
- Use appropriate variant for action type
- Avoid custom classes that override base styles
- Include loading states for async actions

### 3.2 Cards

**Component**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Usage**: Consistent container for grouped content

**Example**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### 3.3 Inputs & Forms

**Components**: `Input`, `Label`, `Textarea`

**Rules**:
- Every input must have a paired `Label` with `htmlFor`
- Use icons from Lucide when helpful
- Include validation feedback inline
- Show password toggles for password inputs

**Example**:
```tsx
<div>
  <Label htmlFor="username">Username</Label>
  <Input id="username" placeholder="Enter username" />
</div>
```

### 3.4 Tables

**Library**: TanStack Table

**Patterns**:
- Sortable columns with visual indicators
- Multi-column filtering
- Pagination or virtualization for large datasets
- Responsive: hide non-critical columns on small screens

**Reference**: `src/pages/LlmLinksTablePage.tsx`

### 3.5 Toasts

**Component**: `toast` from `@/components/ui/use-toast`

**Usage**: Brief, non-blocking feedback for user actions

**Types**:
- Success: Confirmation messages
- Error: Error messages
- Info: General notifications

**Example**:
```tsx
toast({
  title: "Success",
  description: "Your changes have been saved.",
});

toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong.",
});
```

**Rules**:
- Keep messages concise
- Use appropriate variant for message type
- Auto-dismiss after reasonable duration

---

## 4. States and Feedback

### Loading States
- Show spinners (e.g., `Loader2` from Lucide) for loading
- Disable actions during loading
- Use skeleton loaders for initial data fetch when appropriate

### Empty States
- Provide helpful copy explaining the empty state
- Include a primary action to populate (e.g., "Add your first link")
- Use friendly, encouraging tone

### Error States
- Display concise error messages
- Avoid leaking technical details to end-users
- Provide actionable next steps when possible

---

## 5. Accessibility (WCAG-minded)

### Keyboard Navigation
- All interactive controls must be tabbable
- Focus rings must be visible (Tailwind `focus:ring` classes)
- Keyboard shortcuts documented where available

### Labels & Semantics
- Every input paired with `<label>` using `htmlFor`
- Use semantic HTML elements
- Include `aria-label` for icon-only buttons

### Contrast
- Meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Verify in both light and dark themes

### Icons
- Decorative icons must have `aria-hidden="true"`
- Functional icons must have accessible labels

### Live Regions
- Toasts and alerts should announce politely via screen readers
- Use `role="status"` or `role="alert"` where appropriate

---

## 6. Responsive Behavior

### Mobile-First Approach
- Design for mobile first, enhance for larger screens
- Confirm layouts at `sm`, `md`, `lg` breakpoints

### Responsive Patterns
- **Card Grids**: 1 column on mobile, 2-3 columns on tablet/desktop
- **Tables**: Horizontal scroll on mobile, full table on desktop
- **Forms**: Stack fields vertically on mobile, side-by-side on larger screens
- **Navigation**: Collapsible menu on mobile, full navigation on desktop

---

## 7. Theming

### Theme Support
- Light, dark, and system themes supported via `next-themes`
- User can toggle via `ThemeToggle` component
- Theme preference persists across sessions

### Theme Implementation
- Respect user system theme by default
- Allow manual toggle in app header
- All components support both light and dark themes

**Rules**:
- Never hardcode colors (use Tailwind theme classes)
- Test all UI changes in both light and dark themes
- Ensure proper contrast in both modes

---

## 8. Component Examples (Authoritative References)

Reference these files for established patterns:

| Component Type | Example File | Notes |
|---------------|--------------|-------|
| **Auth Forms** | `src/components/auth/SignInForm.tsx` | Username-based sign-in pattern |
| **Auth Forms** | `src/components/auth/SignUpForm.tsx` | Sign-up with validation |
| **Card View** | `src/components/LlmLinkCard.tsx` | Card layout with actions |
| **Table View** | `src/pages/LlmLinksTablePage.tsx` | TanStack Table implementation |
| **Profile UI** | `src/components/UserProfile.tsx` | Dropdown with actions |

---

## 9. Auth Screens

### Sign-In/Sign-Up
- Use username-based copy (avoid mentioning email on sign-in)
- Forms must provide show/hide password toggles
- Display descriptive validation errors
- Loading states during authentication
- Redirect automatically after successful auth

### Error Handling
- Show user-friendly error messages
- Provide actionable guidance (e.g., "Check your username" not "401 error")

---

## 10. UI Review Checklist

Before merging UI changes:

- [ ] Visual consistency with shadcn/ui primitives
- [ ] Accessibility checks pass (keyboard nav, labels, contrast)
- [ ] All states covered: loading, empty, error, success
- [ ] No layout shift on interaction
- [ ] Works in both light and dark themes
- [ ] Responsive across mobile, tablet, desktop
- [ ] Follows Tailwind spacing/color conventions
- [ ] Component reuses existing patterns where possible

---

## 11. Content & Tone

### Microcopy Guidelines
- Use action verbs ("Save", "Delete", "Copy")
- Keep language clear and concise
- Avoid technical jargon in user-facing text

### Error Messages
- **Format**: `{What happened}. {What to do next}.`
- **Example**: "Username not found. Please check your spelling or sign up."

### Success Messages
- Confirm the action taken
- **Example**: "Link saved successfully" or "Prompt copied to clipboard"

---

### Usage Notes
- Follow this document for all UI decisions
- Reference specific sections in task logs when implementing UI
- Update this doc when introducing new patterns or components
- Keep UI changes aligned with the design system

**Remember**: Consistency is key. When in doubt, reference existing components and patterns.
