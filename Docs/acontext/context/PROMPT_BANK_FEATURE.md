# Prompt Bank Feature - Implementation Guide

> **Complete guide to the Prompt Bank feature implementation in LLM Chat Links.**

---

## Overview

The Prompt Bank is a fully implemented feature that allows users to store, organize, search, and reuse their AI prompts. It's implemented in Stage 2 of the project and is production-ready.

---

## Feature Components

### Pages

**PromptBankPage** (`src/pages/PromptBankPage.tsx`)
- Main page for the Prompt Bank feature
- Route: `/prompts`
- Displays prompts in responsive grid layout (1-4 columns)
- Includes search, category filtering, and FAB for quick creation

### Components

| Component | File | Purpose |
|-----------|------|---------|
| **PromptCard** | `src/components/prompt/PromptCard.tsx` | Grid card displaying prompt preview with actions |
| **NewPromptForm** | `src/components/prompt/NewPromptForm.tsx` | Dialog form for creating/editing prompts |
| **PromptDetailsDialog** | `src/components/prompt/PromptDetailsDialog.tsx` | Modal showing full prompt text with actions |
| **PromptSearchBar** | `src/components/prompt/PromptSearchBar.tsx` | Search input with clear button |
| **CategoryPills** | `src/components/prompt/CategoryPills.tsx` | Category filter buttons |

### Data Hooks

**usePrompts Hook** (`src/hooks/usePrompts.ts`)

Provides all data fetching and mutations for prompts:

```typescript
// Fetching
const { data: prompts, isLoading } = usePrompts({
  search: string,
  category: string,
  tags: string[]
});

const { data: categories } = usePromptCategories();
const { data: tags } = usePromptTags();

// Mutations
const createPrompt = useCreatePrompt();
const updatePrompt = useUpdatePrompt();
const deletePrompt = useDeletePrompt();
```

**Features:**
- TanStack Query for caching and state management
- 5-minute stale time for optimal performance
- Automatic cache invalidation on mutations
- User-scoped queries (RLS enforced)
- Debounced search (300ms)

---

## Database Schema

### Table: `prompts`

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT[] DEFAULT '{}',
  description TEXT,
  prompt_text TEXT NOT NULL CHECK (char_length(prompt_text) >= 10),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
CREATE POLICY "Users can view their own prompts"
  ON prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompts"
  ON prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts"
  ON prompts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts"
  ON prompts FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
CREATE INDEX idx_prompts_title ON prompts USING GIN (to_tsvector('english', title));
CREATE INDEX idx_prompts_text ON prompts USING GIN (to_tsvector('english', prompt_text));
CREATE INDEX idx_prompts_category ON prompts USING GIN (category);
CREATE INDEX idx_prompts_tags ON prompts USING GIN (tags);
```

---

## Key Features

### 1. CRUD Operations

**Create Prompt:**
```typescript
await createPrompt.mutateAsync({
  title: string,
  category: string[],
  description?: string,
  prompt_text: string,  // min 10 chars
  tags: string[]
});
```

**Update Prompt:**
```typescript
await updatePrompt.mutateAsync({
  id: string,
  ...updates
});
```

**Delete Prompt:**
```typescript
await deletePrompt.mutateAsync(promptId);
```

### 2. Search & Filtering

**Search Implementation:**
- Debounced to 300ms to prevent excessive queries
- Searches across: title, description, prompt_text
- Case-insensitive
- Real-time updates

**Category Filtering:**
- Dynamically extracts unique categories from all user prompts
- "All" option to clear filter
- Visual pill buttons for easy selection

**Future Enhancement:** Full-text search with tsvector (indexes already in place)

### 3. Copy to Clipboard

One-click copy functionality with navigator.clipboard API:
- Copies full prompt text
- Shows success toast notification
- Fallback for older browsers

### 4. Dynamic Category/Tag Extraction

Categories and tags are extracted dynamically from all user's prompts:
```typescript
const { data: categories } = usePromptCategories(); // ["Writing", "Code", "Research"]
const { data: tags } = usePromptTags(); // ["blog", "seo", "python"]
```

Benefits:
- No need for predefined lists
- Grows organically with user's data
- Prevents orphaned categories
- User-specific, not global

---

## UI/UX Patterns

### Responsive Grid Layout

- **Mobile** (< 640px): 1 column
- **Tablet** (640-1024px): 2 columns
- **Desktop** (1024-1280px): 3 columns
- **Large** (> 1280px): 4 columns

### Empty States

When no prompts exist:
```
"No prompts yet"
"Create your first prompt to get started"
[+ New Prompt button]
```

When search returns no results:
```
"No prompts found"
"Try adjusting your search or category filter"
```

### Loading States

- Skeleton loaders during initial fetch
- Disabled buttons during mutations
- Loading spinner in floating action button

### Toast Notifications

- ✅ "Prompt created successfully"
- ✅ "Prompt updated successfully"
- ✅ "Prompt deleted successfully"
- ✅ "Prompt copied to clipboard"
- ❌ "Failed to create prompt"
- ❌ "Failed to copy prompt"

---

## Form Validation

Uses React Hook Form + Zod for validation:

```typescript
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.array(z.string()).optional(),
  description: z.string().optional(),
  prompt_text: z.string().min(10, "Prompt must be at least 10 characters"),
  tags: z.array(z.string()).optional()
});
```

**Validation Rules:**
- Title: Required
- Prompt Text: Required, min 10 characters
- Category: Optional array (multi-select)
- Description: Optional
- Tags: Optional array (multi-select)

---

## Performance Optimizations

### React Query Caching
- **Stale Time**: 5 minutes
- **Cache Time**: 10 minutes
- **Refetch on window focus**: Disabled
- **Automatic background refetch**: Enabled

### Debounced Search
- 300ms delay prevents excessive queries
- Implemented with useMemo and useCallback

### Optimistic Updates
- UI updates immediately on mutations
- Rolls back on error
- Cache invalidated after success

---

## Integration with Other Features

### Navigation
- Accessible from main navigation menu
- "Prompts" link in header
- Direct route: `/prompts`

### Authentication
- Requires user to be logged in
- Redirects to login if not authenticated
- All data is user-scoped (RLS enforced)

### Theme Support
- Fully supports light/dark themes
- Category pills adapt to theme
- Cards match application theme

---

## Future Enhancements (See Product_Backlog.md)

**Planned for Stage 3:**
- **PB-006**: Prompt Templates Library - Pre-built templates users can clone
- **PB-014**: Prompt Usage Analytics - Track which prompts are used most
- **PB-002**: Sharing - Share prompts with others via link

**Planned for Stage 4:**
- **PB-007**: AI-Powered Suggestions - AI suggests tags and categories
- **PB-015**: Collections - Organize prompts into folders

---

## Common Use Cases

### 1. Content Creator Workflow
```
1. User creates prompts for different content types
   - Category: ["Writing", "Blog"]
   - Tags: ["seo", "tutorial"]
2. When writing, searches for "seo"
3. Clicks prompt to view full text
4. Copies to clipboard
5. Pastes into AI chat
```

### 2. Developer Workflow
```
1. User stores code generation prompts
   - Category: ["Code", "Python"]
   - Tags: ["api", "database"]
2. Filters by "Code" category
3. Finds relevant prompt
4. Copies and uses in AI tool
```

### 3. Researcher Workflow
```
1. User creates research query prompts
   - Category: ["Research"]
   - Tags: ["academic", "summary"]
2. Organizes by tags for different research topics
3. Reuses prompts across multiple research sessions
```

---

## Testing Checklist

When testing Prompt Bank:

- [ ] Create prompt with all fields
- [ ] Create prompt with only required fields
- [ ] Edit existing prompt
- [ ] Delete prompt (with confirmation)
- [ ] Search for prompts
- [ ] Filter by category
- [ ] Copy prompt to clipboard
- [ ] Open prompt details modal
- [ ] Verify responsive grid (mobile/tablet/desktop)
- [ ] Test with empty state (no prompts)
- [ ] Test with no search results
- [ ] Verify RLS (users can't see others' prompts)
- [ ] Test category extraction (multiple categories)
- [ ] Test tag extraction
- [ ] Verify toast notifications
- [ ] Test form validation errors
- [ ] Test floating action button

---

## Code References

**Main Files:**
- Page: `src/pages/PromptBankPage.tsx:1`
- Hooks: `src/hooks/usePrompts.ts:1`
- Card Component: `src/components/prompt/PromptCard.tsx:1`
- Form Component: `src/components/prompt/NewPromptForm.tsx:1`
- Details Dialog: `src/components/prompt/PromptDetailsDialog.tsx:1`

**Related Documentation:**
- Implementation: `docs/Implementation.md` (Stage 2)
- UI Guidelines: `docs/rule_book/UI_UX_doc.md`
- Product Vision: `docs/project_management/PRD-MVP.md` (Epic 3)

---

**The Prompt Bank is a complete, production-ready feature that demonstrates the power of combining user-scoped data, dynamic filtering, and intuitive UX for managing AI prompts.**
