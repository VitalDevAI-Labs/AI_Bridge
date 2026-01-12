# Product Backlog - LLM Chat Links

> **Single place for approved-but-not-scheduled work.** All items here have been reviewed and deemed valuable for future development.

---

## 1) How This File Fits
- Flow: `PRD-MVP.md` → `Product_Backlog.md` (this file) → `Active_Task.md` → `.acontext/tasks` → Code
- Items promoted to `Active_Task.md` when ready for implementation
- Status progression: idea → groomed → ready

---

## 2) Backlog Snapshot (Quick Reference)

| ID | Title | Epic/Stage | Status | Priority | Ready? |
|----|-------|------------|--------|----------|--------|
| PB-001 | Favorites/Bookmarks System | Stage 3 | groomed | high | No |
| PB-002 | Link Sharing with Privacy Controls | Stage 3 | groomed | high | No |
| PB-003 | Usage Analytics Dashboard | Stage 3 | groomed | medium | No |
| PB-004 | Advanced Full-Text Search | Stage 3 | groomed | medium | No |
| PB-005 | Export/Import Functionality | Stage 3 | idea | medium | No |
| PB-006 | Prompt Templates Library | Stage 3 | idea | medium | No |
| PB-007 | AI-Powered Prompt Suggestions | Stage 4 | idea | low | No |
| PB-008 | Bulk CSV/JSON Import | Stage 3 | idea | low | No |
| PB-009 | PWA Support (Offline Access) | Stage 4 | idea | medium | No |
| PB-010 | Password Reset via Email | Stage 3 | groomed | high | No |
| PB-011 | Email Verification | Stage 3 | groomed | medium | No |
| PB-012 | Two-Factor Authentication (2FA) | Stage 4 | idea | medium | No |
| PB-013 | Link Usage Tracking | Stage 3 | groomed | low | No |
| PB-014 | Prompt Usage Analytics | Stage 3 | groomed | low | No |
| PB-015 | Collections/Folders for Organization | Stage 4 | idea | medium | No |
| PB-016 | Keyboard Shortcuts | Stage 4 | idea | low | No |
| PB-017 | API for External Integration | Future | idea | low | No |
| PB-018 | Mobile Native Apps | Future | idea | low | No |
| PB-019 | Collaboration & Team Workspaces | Future | idea | low | No |
| PB-020 | Link Preview/Thumbnails | Stage 4 | idea | low | No |

---

## 3) Detailed Backlog Entries (Groomed Items)

### PB-001: Favorites/Bookmarks System
```yaml
id: PB-001
title: "Favorites/Bookmarks System for Links and Prompts"
epic: "Stage 3 - Advanced Features"
status: groomed
priority: high
summary: >
  Users can mark links and prompts as favorites for quick access.
  Adds a "favorites" filter to quickly show only starred items.
acceptance_hints:
  - User can toggle favorite status on any link or prompt
  - Favorite icon visible on cards and in table view
  - "Show Favorites Only" filter toggle
  - Favorites persist across sessions
  - Favorite count visible in UI
dependencies:
  tech: ["Database schema update to add is_favorite column"]
  design: ["Favorite icon design (filled/outline states)"]
notes: >
  Similar to popular flag but user-specific. Consider using star icon.
  Should work in both card and table views.
```

### PB-002: Link Sharing with Privacy Controls
```yaml
id: PB-002
title: "Share Links and Prompts with Privacy Controls"
epic: "Stage 3 - Advanced Features"
status: groomed
priority: high
summary: >
  Users can generate shareable URLs for individual links or prompts.
  Includes privacy controls (public, unlisted, password-protected).
acceptance_hints:
  - User can click "Share" button on any link/prompt
  - Generates unique shareable URL
  - Privacy options: Public (searchable), Unlisted (URL-only), Password-protected
  - Shared items viewable without login
  - Owner can revoke shared links
  - View count for shared items
dependencies:
  tech: ["RLS policy updates for shared items", "Public route for shared views"]
  design: ["Share dialog mockup", "Shared item public view design"]
notes: >
  Security critical - ensure RLS policies prevent unauthorized access.
  Consider rate limiting for public views.
```

### PB-003: Usage Analytics Dashboard
```yaml
id: PB-003
title: "Personal Usage Analytics Dashboard"
epic: "Stage 3 - Advanced Features"
status: groomed
priority: medium
summary: >
  Dashboard showing user's activity stats: most used links, prompt categories,
  creation trends, and usage patterns over time.
acceptance_hints:
  - New "Analytics" page accessible from navigation
  - Charts showing: links added over time, prompts created over time
  - Top 10 most accessed links
  - Most used prompt categories
  - Total counts and growth metrics
  - Date range selector (7d, 30d, 90d, all time)
dependencies:
  tech: ["Add tracking tables for clicks/views", "Chart library integration"]
  design: ["Analytics dashboard mockup"]
notes: >
  Privacy-first - all analytics are personal only, no cross-user tracking.
  Consider using Recharts or similar for visualizations.
```

### PB-004: Advanced Full-Text Search
```yaml
id: PB-004
title: "Full-Text Search with Supabase tsvector"
epic: "Stage 3 - Advanced Features"
status: groomed
priority: medium
summary: >
  Implement Postgres full-text search for better search results.
  Includes fuzzy matching, relevance ranking, and highlighting.
acceptance_hints:
  - Search results ranked by relevance
  - Typo-tolerant fuzzy matching
  - Search snippets show matching text with highlights
  - Faster search performance for large datasets
  - Supports searching across all text fields simultaneously
dependencies:
  tech: ["Create tsvector indexes on links and prompts tables", "Update search queries"]
  design: ["Search results UI with snippets"]
notes: >
  Database indexes already prepared in schema. Need to implement query logic.
  Reference: Supabase full-text search documentation.
```

### PB-010: Password Reset via Email
```yaml
id: PB-010
title: "Password Reset Flow"
epic: "Stage 3 - Advanced Features"
status: groomed
priority: high
summary: >
  Users who forget passwords can request reset link via email.
acceptance_hints:
  - "Forgot Password?" link on sign-in page
  - User enters email, receives reset link
  - Link expires after 1 hour
  - Reset page allows new password entry
  - Success confirmation and auto-redirect to login
dependencies:
  tech: ["Supabase email templates", "Reset password page"]
  design: ["Forgot password flow mockup"]
notes: >
  Supabase Auth supports this natively. Need to configure email templates.
```

### PB-011: Email Verification
```yaml
id: PB-011
title: "Email Verification on Sign-Up"
epic: "Stage 3 - Advanced Features"
status: groomed
priority: medium
summary: >
  New users receive verification email after registration.
  Must verify before full account access.
acceptance_hints:
  - Sign-up triggers verification email
  - User sees "Check your email" message
  - Clicking link verifies account
  - Unverified users can login but see banner prompting verification
  - "Resend verification" option available
dependencies:
  tech: ["Supabase email configuration", "Verification status UI"]
  design: ["Verification banner design"]
notes: >
  Consider making optional (soft verification) vs. required (hard verification).
```

### PB-013: Link Usage Tracking
```yaml
id: PB-013
title: "Track When Users Click Links"
epic: "Stage 3 - Advanced Features"
status: groomed
priority: low
summary: >
  Track each time a user clicks a link to open it.
  Shows which links are most used.
acceptance_hints:
  - Click count visible on each link card
  - "Last accessed" timestamp shown
  - Can sort by most accessed in table view
  - Usage data feeds into analytics (PB-003)
dependencies:
  tech: ["Create link_clicks tracking table"]
  design: ["Usage stats display on cards"]
notes: >
  Helps users identify their most valuable links.
```

### PB-014: Prompt Usage Analytics
```yaml
id: PB-014
title: "Track Prompt Copy Events"
epic: "Stage 3 - Advanced Features"
status: groomed
priority: low
summary: >
  Track when users copy prompts to clipboard.
  Shows most useful prompts.
acceptance_hints:
  - Copy count visible on prompt cards
  - "Last used" timestamp shown
  - Can sort by most copied
  - Usage data feeds into analytics (PB-003)
dependencies:
  tech: ["Create prompt_copies tracking table"]
  design: ["Usage stats on prompt cards"]
notes: >
  Privacy: Only tracks user's own usage, not cross-user.
```

---

## 4) Ideas (Ungroomed - Parking Lot)

### PB-005: Export/Import Functionality
```yaml
id: PB-005
title: "Export and Import Data as JSON/CSV"
status: idea
priority: medium
summary: >
  Users can export all links/prompts as JSON or CSV for backup.
  Can also import from these formats.
next_step: "Define file formats and validation rules"
```

### PB-006: Prompt Templates Library
```yaml
id: PB-006
title: "Pre-built Prompt Templates"
status: idea
priority: medium
summary: >
  Curated library of common prompt templates users can clone and customize.
next_step: "Gather popular prompt patterns and create template library"
```

### PB-007: AI-Powered Prompt Suggestions
```yaml
id: PB-007
title: "AI Suggests Tags and Categories"
status: idea
priority: low
summary: >
  When creating prompts, AI suggests relevant tags and categories based on content.
next_step: "Research AI integration options (OpenAI API, local models)"
```

### PB-008: Bulk CSV/JSON Import
```yaml
id: PB-008
title: "Bulk Import Links from CSV/JSON"
status: idea
priority: low
summary: >
  Users can import many links at once from formatted files.
next_step: "Define CSV format and validation requirements"
```

### PB-009: PWA Support (Offline Access)
```yaml
id: PB-009
title: "Progressive Web App with Offline Support"
status: idea
priority: medium
summary: >
  App works offline, can be installed to home screen, syncs when online.
next_step: "Research PWA requirements and service worker strategy"
```

### PB-012: Two-Factor Authentication (2FA)
```yaml
id: PB-012
title: "Two-Factor Authentication for Enhanced Security"
status: idea
priority: medium
summary: >
  Optional 2FA using authenticator apps for additional account security.
next_step: "Review Supabase Auth 2FA capabilities"
```

### PB-015: Collections/Folders for Organization
```yaml
id: PB-015
title: "Organize Links and Prompts into Collections"
status: idea
priority: medium
summary: >
  Users can create custom collections/folders to group related items.
next_step: "Design folder hierarchy and UI mockups"
```

### PB-016: Keyboard Shortcuts
```yaml
id: PB-016
title: "Keyboard Shortcuts for Power Users"
status: idea
priority: low
summary: >
  Common actions accessible via keyboard (Ctrl+N for new, / for search, etc.)
next_step: "Define shortcut mapping and implementation approach"
```

### PB-017: API for External Integration
```yaml
id: PB-017
title: "REST API for External App Integration"
status: idea
priority: low
summary: >
  Public API allowing third-party apps to access user's links/prompts.
next_step: "Define API scope, auth, and rate limiting strategy"
```

### PB-018: Mobile Native Apps
```yaml
id: PB-018
title: "Native iOS and Android Apps"
status: idea
priority: low
summary: >
  Dedicated mobile apps with native features (share sheets, widgets).
next_step: "Evaluate React Native vs. native development"
```

### PB-019: Collaboration & Team Workspaces
```yaml
id: PB-019
title: "Team Workspaces for Sharing Resources"
status: idea
priority: low
summary: >
  Organizations can create team workspaces with shared links/prompts.
next_step: "Design multi-tenant architecture and permissions model"
```

### PB-020: Link Preview/Thumbnails
```yaml
id: PB-020
title: "Auto-Generate Link Previews and Favicons"
status: idea
priority: low
summary: >
  Display website favicons and metadata previews for links.
next_step: "Research metadata fetching service or API"
```

---

## 5) Status Model

- **idea**: Captured but not yet analyzed or scoped
- **groomed**: Requirements understood, acceptance criteria drafted, dependencies identified
- **ready**: Meets Definition of Ready, can move to `Active_Task.md`

---

## 6) Definition of Ready

Before marking as "ready":
- [ ] Acceptance criteria are testable and specific
- [ ] Technical dependencies identified and resolved
- [ ] Design dependencies identified (mockups available or not needed)
- [ ] No critical unknowns or blockers
- [ ] Aligned with product strategy and user needs

---

## 7) Promotion Process

When a backlog item reaches **ready** status:
1. Move to `Active_Task.md` with full task details
2. Create `.acontext/tasks` log when work begins
3. Update this file to mark as "promoted" in notes

---

## 8) Prioritization Framework

**High Priority**: Essential for user value, frequently requested, or critical for security
**Medium Priority**: Valuable enhancement, improves UX significantly
**Low Priority**: Nice-to-have, polish features, edge cases

---

## Usage Notes

- **Review cadence**: Monthly during sprint planning
- **Ownership**: Product owner maintains and prioritizes
- **Updates**: Add new ideas as they emerge, promote groomed items when ready
- **Pruning**: Archive or remove items that are no longer relevant

**This backlog represents the future vision for LLM Chat Links beyond the MVP.**
