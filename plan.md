# Implementation Plan: "My Prompts" Feature

**Project**: llm-chat-links  
**Branch**: V-2.0_001_Integration_phase  
**Date**: October 21, 2025  
**Feature**: Per-user Prompt Bank with search, filter, and copy functionality

---

## 🎯 Overview

Add a **"My Prompts"** page to the llm-chat-links application, implementing core functionalities from the [Prompt Bank project](https://github.com/GowthamVitalDevAILabs/vital-prompt-bank) while maintaining consistency with the existing Vital Theme design system and username-based authentication architecture.

### Goals
- ✅ Per-user private prompt storage (Supabase + RLS)
- ✅ Search/filter by text, category, and tags
- ✅ One-click copy prompt to clipboard
- ✅ CRUD operations with validation
- ✅ Reuse existing UI components (shadcn/ui + Vital Theme)
- ✅ Follow established project patterns and conventions

### Non-Goals
- ❌ Notion database integration (design inspiration only)
- ❌ Public/shared prompts (per-user only for MVP)
- ❌ Advanced AI features or prompt templates
- ❌ Prompt versioning or history

---

## 📋 Implementation Strategy

**Approach**: UI-first with mock data, then database integration

### Why This Order?
1. **Rapid iteration** on design and UX without database dependencies
2. **Parallel work** possible (UI dev while DB schema is reviewed)
3. **Early feedback** from stakeholders on visual design
4. **Safer testing** with mock data before touching production DB

---

## 🚀 Phase 1: UI Components & Design (Priority 1)

### 1.1 Create Mock Data Structure
**File**: `src/data/prompts.json` (temporary)

```json
[
  {
    "id": "1",
    "title": "Speech Enhancer",
    "category": "Enhancer",
    "description": "Contextual instructions for the Agent (Your Personal Speech Enhancer): You are a highly skilled Engl...",
    "prompt_text": "You are a highly skilled English language expert specializing in speech enhancement. Your task is to analyze the provided text and improve it while maintaining the original meaning and intent. Focus on:\n\n1. Grammar and syntax corrections\n2. Vocabulary enhancement\n3. Sentence structure optimization\n4. Tone and style consistency\n5. Clarity and conciseness\n\nProvide the enhanced version without explanations unless requested.",
    "tags": ["speech enhancer", "Agent"],
    "created_at": "2025-10-15T10:30:00Z",
    "updated_at": "2025-10-15T10:30:00Z"
  },
  {
    "id": "2",
    "title": "Text Format — Notion",
    "category": "Formatter",
    "description": "Agent Instructions: \"Clean & Format Without Changing Meaning\"...",
    "prompt_text": "Clean and format the following text for Notion. Preserve the original meaning but improve readability:\n\n- Use proper headings (H1, H2, H3)\n- Create bullet points and numbered lists\n- Add code blocks where appropriate\n- Format tables if present\n- Highlight important terms\n\nOutput only the formatted text.",
    "tags": ["text format", "Agent"],
    "created_at": "2025-10-16T14:20:00Z",
    "updated_at": "2025-10-16T14:20:00Z"
  },
  {
    "id": "3",
    "title": "Study Notes",
    "category": "Study Expert",
    "description": "I have attached my lecture documents. Please: Carefully analyze the content and identify all key topics...",
    "prompt_text": "Analyze the provided lecture documents and create comprehensive study notes:\n\n1. Identify and list all key topics\n2. Summarize main concepts for each topic\n3. Highlight important definitions and formulas\n4. Create a study guide with practice questions\n5. Organize information hierarchically\n\nFormat the output in markdown with clear sections.",
    "tags": ["study notes"],
    "created_at": "2025-10-17T09:15:00Z",
    "updated_at": "2025-10-17T09:15:00Z"
  }
]
```

### 1.2 Type Definitions
**File**: `src/config/types.ts` (append to existing file)

```typescript
// Prompt Bank Types
export interface Prompt {
  id: string;
  user_id?: string;
  title: string;
  category: string;
  description?: string;
  prompt_text: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export type PromptInsert = Omit<Prompt, 'id' | 'created_at' | 'updated_at'>;
export type PromptUpdate = Partial<PromptInsert> & { id: string };
```

### 1.3 Core UI Components

#### Component 1: PromptCard
**File**: `src/components/prompt/PromptCard.tsx`

**Purpose**: Display individual prompt in card format with copy action

**Design Pattern**: Follow `LlmLinkCard.tsx` structure
- Glass morphism card variant
- Category badge at top
- Title (font-semibold, text-lg)
- Truncated description (2 lines max with ellipsis)
- Tags as small badges at bottom
- Copy icon button (hover shows tooltip "Copy prompt")
- Click card to open full details dialog

**Props**:
```typescript
interface PromptCardProps {
  prompt: Prompt;
  onCopy?: (prompt: Prompt) => void;
  onClick?: (prompt: Prompt) => void;
}
```

**Key Features**:
- `copyToClipboard()` on copy button click
- Toast notification: "Prompt copied!"
- Hover effects and transitions
- Responsive padding and spacing

#### Component 2: PromptSearchBar
**File**: `src/components/prompt/PromptSearchBar.tsx`

**Purpose**: Debounced search input for filtering prompts

**Design Pattern**: Follow search bar from `LlmLinksPage.tsx`
- Search icon (lucide-react)
- Debounce: 300ms
- Placeholder: "Search by name, tag or description..."
- Clear button (X) when text present

**Props**:
```typescript
interface PromptSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

#### Component 3: CategoryPills
**File**: `src/components/prompt/CategoryPills.tsx`

**Purpose**: Horizontal category filter pills

**Design Pattern**: Follow category buttons from `LlmLinksPage.tsx`
- "All" + dynamic categories extracted from data
- Active state: `variant="default"`
- Inactive state: `variant="outline"`
- Rounded-full pills
- Horizontal scroll on mobile

**Props**:
```typescript
interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}
```

#### Component 4: NewPromptForm
**File**: `src/components/prompt/NewPromptForm.tsx`

**Purpose**: Form to create/edit prompts

**Design Pattern**: Follow `NewLinkForm.tsx` structure exactly
- Dialog/modal wrapper
- Form validation (required fields)
- Loading state on submit
- Toast notifications

**Form Fields**:
1. **Title** (Input) - required, max 100 chars
2. **Category** (MultipleSelect) - required, single select, allow create
3. **Description** (Input/Textarea) - optional, max 200 chars
4. **Prompt Text** (Textarea) - required, min 10 chars, auto-resize
5. **Tags** (MultipleSelect) - optional, multi-select, allow create

**Props**:
```typescript
interface NewPromptFormProps {
  prompt?: Prompt; // For edit mode
  onClose: () => void;
  onSuccess?: () => void;
}
```

#### Component 5: PromptDetailsDialog
**File**: `src/components/prompt/PromptDetailsDialog.tsx`

**Purpose**: Full prompt view in modal with actions

**Content**:
- Title (h2)
- Category badge
- Description (full text)
- Prompt text (full, with copy button)
- Tags list
- Actions: Edit, Delete, Copy

**Props**:
```typescript
interface PromptDetailsDialogProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (promptId: string) => void;
}
```

### 1.4 Main Page Component
**File**: `src/pages/PromptBankPage.tsx`

**Layout Structure**:
```
┌───────────────────────────────────────────────────┐
│ Header Bar                                         │
│ "My Prompts" [+ New Prompt] [Refresh] [Theme] [Profile] │
├───────────────────────────────────────────────────┤
│               Search Bar (centered)                │
├───────────────────────────────────────────────────┤
│ Category Pills: [All] [Enhancer] [Formatter] ... │
├───────────────────────────────────────────────────┤
│ Status: "Debug: 3 prompts loaded, 3 filtered"     │
├───────────────────────────────────────────────────┤
│ Prompts Grid                                       │
│ ┌────────┐ ┌────────┐ ┌────────┐                │
│ │ Card 1 │ │ Card 2 │ │ Card 3 │                │
│ └────────┘ └────────┘ └────────┘                │
│                                                    │
│ [Empty State] if no results                       │
└───────────────────────────────────────────────────┘
        [+] Floating Action Button (bottom-right)
```

**State Management**:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('all');
const [showNewPromptForm, setShowNewPromptForm] = useState(false);
const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
```

**Features**:
- Search with debounce (300ms)
- Category filtering
- Statistics display (total prompts, categories count)
- Empty state: "No prompts found. Create your first prompt!"
- Loading skeleton (3 cards)
- Error state with retry button

**Responsive Grid**:
- Mobile: 1 column
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3 columns (lg:grid-cols-3)

### 1.5 Data Hook (Mock Implementation)
**File**: `src/hooks/usePrompts.ts` (Phase 1 - Mock)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import mockPromptsData from '@/data/prompts.json';
import type { Prompt, PromptInsert, PromptUpdate } from '@/config/types';

// Simulate local storage for mock CRUD
const getMockPrompts = (): Prompt[] => {
  const stored = localStorage.getItem('mock_prompts');
  return stored ? JSON.parse(stored) : mockPromptsData;
};

const setMockPrompts = (prompts: Prompt[]) => {
  localStorage.setItem('mock_prompts', JSON.stringify(prompts));
};

// Fetch with filters
export const usePrompts = (filters: { query?: string; category?: string } = {}) => {
  return useQuery({
    queryKey: ['prompts', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let prompts = getMockPrompts();
      
      // Filter by search query
      if (filters.query) {
        const q = filters.query.toLowerCase();
        prompts = prompts.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.prompt_text.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      
      // Filter by category
      if (filters.category && filters.category !== 'all') {
        prompts = prompts.filter(p => p.category === filters.category);
      }
      
      return prompts;
    }
  });
};

// Get unique categories
export const usePromptCategories = () => {
  const { data: prompts } = usePrompts();
  const categories = prompts 
    ? Array.from(new Set(prompts.map(p => p.category))).sort()
    : [];
  return { categories };
};

// Create prompt
export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPrompt: PromptInsert) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const prompts = getMockPrompts();
      const created: Prompt = {
        id: Date.now().toString(),
        ...newPrompt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setMockPrompts([created, ...prompts]);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });
};

// Update prompt
export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: PromptUpdate) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const prompts = getMockPrompts();
      const index = prompts.findIndex(p => p.id === id);
      
      if (index === -1) throw new Error('Prompt not found');
      
      const updated = {
        ...prompts[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      prompts[index] = updated;
      setMockPrompts(prompts);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });
};

// Delete prompt
export const useDeletePrompt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const prompts = getMockPrompts();
      const filtered = prompts.filter(p => p.id !== id);
      setMockPrompts(filtered);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });
};
```

### 1.6 Utility Functions
**File**: `src/lib/utils.ts` (append)

```typescript
/**
 * Copy text to clipboard and return success status
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      return false;
    }
  }
};
```

### 1.7 Routing Configuration
**File**: `src/App.tsx`

**Changes**:
```typescript
import PromptBankPage from './pages/PromptBankPage';

// In Routes:
<Route path="/prompts" element={<PromptBankPage />} />
```

**Navigation Updates**:
Option A: Add nav button in LlmLinksPage header
```typescript
<Button size="sm" variant="outline" onClick={() => window.location.href = '/prompts'}>
  <FileText className="mr-2 h-4 w-4" />
  My Prompts
</Button>
```

Option B: Shared navigation component (future enhancement)

---

## 🗄️ Phase 2: Supabase Integration (Priority 2)

### 2.1 Database Schema
**File**: `database-setup.sql` (append)

```sql
-- ============================================
-- PROMPTS TABLE SETUP
-- ============================================

-- Create the prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
  CONSTRAINT prompt_text_length CHECK (char_length(prompt_text) >= 10),
  CONSTRAINT description_length CHECK (char_length(description) <= 500)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON public.prompts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_prompts_updated_at ON public.prompts(updated_at DESC);

-- ============================================
-- FULL-TEXT SEARCH SETUP (OPTIONAL BUT RECOMMENDED)
-- ============================================

-- Add tsvector column for full-text search
ALTER TABLE public.prompts 
  ADD COLUMN IF NOT EXISTS search_fts TSVECTOR;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_prompts_fts 
  ON public.prompts USING GIN(search_fts);

-- Trigger function to update search_fts on insert/update
CREATE OR REPLACE FUNCTION public.prompts_fts_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_fts := to_tsvector('simple', 
    COALESCE(NEW.title, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' || 
    COALESCE(NEW.prompt_text, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to table
DROP TRIGGER IF EXISTS trig_prompts_fts ON public.prompts;
CREATE TRIGGER trig_prompts_fts 
  BEFORE INSERT OR UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.prompts_fts_trigger();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trig_prompts_updated_at ON public.prompts;
CREATE TRIGGER trig_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own prompts
DROP POLICY IF EXISTS "Users can view own prompts" ON public.prompts;
CREATE POLICY "Users can view own prompts" 
  ON public.prompts
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own prompts
DROP POLICY IF EXISTS "Users can insert own prompts" ON public.prompts;
CREATE POLICY "Users can insert own prompts" 
  ON public.prompts
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own prompts
DROP POLICY IF EXISTS "Users can update own prompts" ON public.prompts;
CREATE POLICY "Users can update own prompts" 
  ON public.prompts
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own prompts
DROP POLICY IF EXISTS "Users can delete own prompts" ON public.prompts;
CREATE POLICY "Users can delete own prompts" 
  ON public.prompts
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- RPC FUNCTION FOR ADVANCED SEARCH (OPTIONAL)
-- ============================================

CREATE OR REPLACE FUNCTION public.search_prompts(
  search_query TEXT DEFAULT NULL,
  filter_category TEXT DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL
)
RETURNS SETOF public.prompts AS $$
  SELECT * FROM public.prompts
  WHERE user_id = auth.uid()
    AND (
      search_query IS NULL 
      OR search_fts @@ plainto_tsquery('simple', search_query)
    )
    AND (filter_category IS NULL OR category = filter_category)
    AND (filter_tags IS NULL OR tags && filter_tags)
  ORDER BY updated_at DESC;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.search_prompts TO authenticated;

-- ============================================
-- PERMISSIONS
-- ============================================

GRANT ALL ON public.prompts TO authenticated;
GRANT SELECT ON public.prompts TO anon;

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Uncomment to insert sample prompts for the authenticated user
-- Replace 'your-user-id' with actual user UUID

/*
INSERT INTO public.prompts (user_id, title, category, description, prompt_text, tags) VALUES
  ('your-user-id', 'Speech Enhancer', 'Enhancer', 'Contextual instructions for the Agent...', 'You are a highly skilled English language expert...', ARRAY['speech enhancer', 'Agent']),
  ('your-user-id', 'Text Format — Notion', 'Formatter', 'Agent Instructions: Clean & Format...', 'Clean and format the following text for Notion...', ARRAY['text format', 'Agent']),
  ('your-user-id', 'Study Notes', 'Study Expert', 'I have attached my lecture documents...', 'Analyze the provided lecture documents...', ARRAY['study notes']);
*/
```

### 2.2 Update Supabase Types
**Command**: Run after database setup

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

**Or manually update** `src/types/supabase.ts` to include:
```typescript
export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          description: string | null;
          prompt_text: string;
          tags: string[];
          created_at: string;
          updated_at: string;
          search_fts: unknown | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          description?: string | null;
          prompt_text: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string;
          description?: string | null;
          prompt_text?: string;
          tags?: string[];
          updated_at?: string;
        };
      };
      // ... existing tables
    };
  };
}
```

### 2.3 Replace Hook with Supabase Implementation
**File**: `src/hooks/usePrompts.ts` (Phase 2 - Production)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Prompt, PromptInsert, PromptUpdate } from '@/config/types';

// Fetch prompts with optional filters
const fetchPrompts = async (filters: { 
  query?: string; 
  category?: string; 
  tags?: string[] 
}): Promise<Prompt[]> => {
  let query = supabase
    .from('prompts')
    .select('*')
    .order('updated_at', { ascending: false });

  // Apply search filter
  if (filters.query && filters.query.trim()) {
    const searchTerm = filters.query.trim();
    // Use OR filter across multiple fields
    query = query.or(
      `title.ilike.%${searchTerm}%,` +
      `description.ilike.%${searchTerm}%,` +
      `prompt_text.ilike.%${searchTerm}%`
    );
    // Note: For tag search, we'd need array containment or full-text search
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  // Apply tag filter (if provided)
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }

  return data as Prompt[];
};

// Main query hook
export const usePrompts = (filters: { 
  query?: string; 
  category?: string;
  tags?: string[];
} = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['prompts', user?.id, filters],
    queryFn: () => fetchPrompts(filters),
    enabled: !!user, // Only fetch when user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get unique categories from all user prompts
export const usePromptCategories = () => {
  const { data: prompts, isLoading } = usePrompts();
  
  const categories = prompts 
    ? Array.from(new Set(prompts.map(p => p.category))).sort()
    : [];
    
  return { categories, isLoading };
};

// Create a new prompt
export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (newPrompt: PromptInsert) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('prompts')
        .insert([{ 
          ...newPrompt, 
          user_id: user.id 
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating prompt:', error);
        throw error;
      }
      
      return data as Prompt;
    },
    onSuccess: () => {
      // Invalidate all prompt queries to refetch
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
  });
};

// Update an existing prompt
export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: PromptUpdate) => {
      const { data, error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating prompt:', error);
        throw error;
      }
      
      return data as Prompt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
  });
};

// Delete a prompt
export const useDeletePrompt = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting prompt:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
  });
};
```

### 2.4 Remove Mock Data
**Actions**:
1. Delete `src/data/prompts.json`
2. Remove localStorage logic from usePrompts hook
3. Test all CRUD operations with real Supabase data
4. Verify RLS policies are working (users can only see their own prompts)

---

## 📚 Phase 3: Documentation & Polish (Priority 3)

### 3.1 Update Implementation.md
**File**: `Docs/Implementation.md`

**Add to Feature Analysis section**:
```markdown
### Prompt Bank Feature (Stage 2.5)
Must-have (implemented)
- [x] Per-user prompt storage with RLS enforcement
- [x] Search/filter by text, category, and tags
- [x] One-click copy prompt to clipboard with toast feedback
- [x] CRUD operations with form validation
- [x] Responsive card grid layout matching Vital Theme
- [x] Full-text search via Supabase tsvector indexes

Acceptance criteria:
- ✅ User can create/edit/delete their own prompts
- ✅ Search is debounced (300ms) and responsive
- ✅ Copy action shows success toast
- ✅ Design matches existing UI component patterns
- ✅ RLS enforces per-user data isolation
- ✅ Categories and tags are dynamically populated from data
```

### 3.2 Update README.md
**File**: `README.md`

**Add new section after "Card View Features"**:
```markdown
### 🎯 My Prompts Features
- 📝 **Personal Prompt Library** - Store and organize your AI prompts
- 🔍 **Smart Search** - Find prompts by title, description, or tags
- 🏷️ **Category Organization** - Filter prompts by category (Enhancer, Formatter, Study Expert, etc.)
- 📋 **One-Click Copy** - Copy prompt text to clipboard instantly
- ✏️ **Full CRUD** - Create, read, update, and delete prompts
- 🔒 **Private & Secure** - Your prompts are private and isolated via RLS
- 🏷️ **Flexible Tagging** - Add custom tags for better organization
```

**Update Database Schema section** to include prompts table:
```markdown
### Prompt Library Table (`prompts`)
| Column        | Type          | Description                     |
|---------------|---------------|---------------------------------|
| id            | UUID          | Primary key (auto-generated)   |
| user_id       | UUID          | Foreign key to auth.users      |
| title         | TEXT          | Prompt title (1-100 chars)     |
| category      | TEXT          | Category name                   |
| description   | TEXT          | Optional description (≤500)     |
| prompt_text   | TEXT          | Actual prompt content (≥10)     |
| tags          | TEXT[]        | Array of tags                   |
| created_at    | TIMESTAMPTZ   | Creation timestamp              |
| updated_at    | TIMESTAMPTZ   | Last update timestamp           |
| search_fts    | TSVECTOR      | Full-text search index          |
```

### 3.3 Update Project Structure Documentation
**File**: `Docs/project_structure.md`

**Add to component structure**:
```markdown
├── components/
│   ├── prompt/              # NEW: Prompt Bank components
│   │   ├── PromptCard.tsx          # Individual prompt card display
│   │   ├── PromptSearchBar.tsx     # Debounced search input
│   │   ├── CategoryPills.tsx       # Category filter pills
│   │   ├── NewPromptForm.tsx       # Create/edit prompt form
│   │   └── PromptDetailsDialog.tsx # Full prompt view modal
```

**Add to pages structure**:
```markdown
├── pages/
│   ├── PromptBankPage.tsx   # NEW: My Prompts page (card view)
```

**Add to hooks structure**:
```markdown
├── hooks/
│   ├── usePrompts.ts        # NEW: Prompt data fetching and CRUD
```

### 3.4 Create Usage Guide
**File**: `Docs/PROMPT_BANK_GUIDE.md` (new file)

```markdown
# My Prompts Feature Guide

## Overview
The "My Prompts" feature allows you to store, organize, and quickly access your frequently used AI prompts. Each prompt is private to your account and can be searched, filtered, and copied with one click.

## Accessing My Prompts
Navigate to `/prompts` or click "My Prompts" button in the main navigation.

## Creating a Prompt

1. Click the **"+ New Prompt"** button in the header or the floating action button
2. Fill in the form:
   - **Title** (required): A short, descriptive name (e.g., "Speech Enhancer")
   - **Category** (required): Select or create a category (e.g., "Enhancer", "Formatter")
   - **Description** (optional): Brief explanation of what the prompt does
   - **Prompt Text** (required): The actual prompt content to copy
   - **Tags** (optional): Add tags for easier filtering (e.g., "agent", "text-format")
3. Click **Submit**

## Searching for Prompts

Use the search bar to find prompts by:
- Title
- Description
- Prompt text content
- Tags

Search is debounced (300ms) for smooth performance.

## Filtering by Category

Click any category pill to show only prompts in that category. Click "All" to clear the filter.

Categories are dynamically generated from your existing prompts.

## Copying a Prompt

1. **Quick Copy**: Click the copy icon on any prompt card
2. **From Details**: Click a card to open details, then click the copy button
3. A toast notification will confirm: "Prompt copied!"

## Editing a Prompt

1. Click a prompt card to open details
2. Click the **Edit** button
3. Modify any fields
4. Click **Update**

## Deleting a Prompt

1. Click a prompt card to open details
2. Click the **Delete** button
3. Confirm the deletion (prompts are permanently deleted)

## Best Practices

### Naming Conventions
- Use clear, descriptive titles
- Include the prompt's purpose or output type

### Categories
- Keep categories broad but meaningful
- Examples: "Enhancer", "Formatter", "Study Expert", "Code Assistant"

### Tags
- Add specific keywords for easier search
- Include: task type, target audience, tool names
- Examples: "agent", "notion", "markdown", "technical"

### Prompt Text
- Include clear instructions
- Specify expected output format
- Add examples if helpful

## Security & Privacy

- **Private by Default**: Only you can see your prompts
- **Row Level Security**: Database enforces isolation automatically
- **No Sharing**: Prompts are not shared with other users (MVP limitation)

## Keyboard Shortcuts (Future)

Coming soon:
- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + N`: New prompt
- `Escape`: Close dialog

## Troubleshooting

### Prompts not appearing
- Ensure you're logged in
- Check your internet connection
- Try refreshing the page

### Copy not working
- Grant clipboard permissions in browser
- Try clicking the copy button again
- Check for browser console errors

### Search not finding prompts
- Check spelling
- Try searching with fewer words
- Use category filters to narrow results

## Technical Details

- **Database**: Supabase PostgreSQL
- **Search**: Full-text search with tsvector indexes
- **Authentication**: Username-based with RLS
- **Cache**: TanStack Query with 5-minute stale time
```

---

## ✅ Acceptance Criteria Checklist

### Phase 1 Completion
- [ ] Mock data file created with 3+ sample prompts
- [ ] Type definitions added to types.ts
- [ ] PromptCard component displays prompt with copy button
- [ ] PromptSearchBar component with 300ms debounce
- [ ] CategoryPills component with dynamic categories
- [ ] NewPromptForm component with validation
- [ ] PromptDetailsDialog component with actions
- [ ] PromptBankPage with search, filter, and grid layout
- [ ] usePrompts hook with mock CRUD operations
- [ ] copyToClipboard utility function working
- [ ] Route added to App.tsx
- [ ] Navigation link added (optional)
- [ ] All components follow Vital Theme design patterns
- [ ] Responsive on mobile, tablet, desktop
- [ ] Toast notifications for all actions

### Phase 2 Completion
- [ ] SQL schema executed in Supabase
- [ ] Prompts table created with all columns
- [ ] Indexes created for performance
- [ ] Full-text search tsvector working
- [ ] RLS policies enabled and tested
- [ ] RPC function created (optional)
- [ ] Supabase types updated/regenerated
- [ ] usePrompts hook updated for Supabase
- [ ] Mock data file deleted
- [ ] All CRUD operations tested
- [ ] RLS verified (users can't see others' prompts)
- [ ] Search performance acceptable (<500ms)

### Phase 3 Completion
- [ ] Implementation.md updated with Prompt Bank section
- [ ] README.md updated with features and schema
- [ ] project_structure.md updated with new files
- [ ] PROMPT_BANK_GUIDE.md created
- [ ] Code comments added to complex logic
- [ ] No console errors or warnings
- [ ] Linter passes (no ESLint errors)
- [ ] TypeScript strict mode passes
- [ ] Manual testing completed
- [ ] Ready for production deployment

---

## 🔧 Development Workflow

### Step-by-Step Execution Order

**Phase 1: UI Development (Days 1-3)**
1. Create mock data file
2. Add type definitions
3. Build PromptCard component → test with mock data
4. Build PromptSearchBar component → test standalone
5. Build CategoryPills component → test with sample categories
6. Build NewPromptForm component → test form validation
7. Build PromptDetailsDialog component → test with mock prompt
8. Create usePrompts hook (mock version) → test CRUD in console
9. Add copyToClipboard utility → test in browser
10. Build PromptBankPage → integrate all components
11. Add route to App.tsx → test navigation
12. Final UI polish and responsive testing

**Phase 2: Database Integration (Days 4-5)**
1. Review SQL schema with team/stakeholders
2. Execute SQL in Supabase SQL Editor
3. Verify table, indexes, triggers created
4. Test RLS policies manually (create test users)
5. Regenerate Supabase TypeScript types
6. Update usePrompts hook for Supabase
7. Remove mock data file
8. Test create prompt → verify in Supabase dashboard
9. Test update prompt → verify changes persist
10. Test delete prompt → verify removal
11. Test search with various queries
12. Test RLS: create second user, verify isolation

**Phase 3: Documentation (Day 6)**
1. Update Implementation.md
2. Update README.md
3. Update project_structure.md
4. Create PROMPT_BANK_GUIDE.md
5. Add inline code comments
6. Run linter and fix issues
7. Final manual testing
8. Create PR with screenshots

---

## 🎨 Design System Compliance

### Colors (from Tailwind theme)
- **Primary**: Blue gradient (existing theme)
- **Background**: Dark mode default
- **Card**: Glass morphism variant
- **Badges**: Category (blue), Tags (gray)

### Typography
- **Title**: text-lg font-semibold
- **Description**: text-sm text-muted-foreground
- **Tags**: text-xs

### Spacing
- **Card padding**: p-6
- **Grid gap**: gap-4
- **Section spacing**: space-y-6

### Components to Reuse
- Button (default, outline, ghost variants)
- Card (glass variant)
- Input (for search and form fields)
- Badge (for categories and tags)
- Dialog (for modals)
- Textarea (for prompt_text field)
- MultipleSelect (for tags and categories)
- Toast/Sonner (for notifications)

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Phase 1 (Mock Data)**
- [ ] Can view all mock prompts
- [ ] Search filters prompts correctly
- [ ] Category filter shows correct results
- [ ] Copy button copies to clipboard
- [ ] Toast appears on copy
- [ ] Create form validates required fields
- [ ] Create form submits successfully
- [ ] New prompt appears in grid immediately
- [ ] Edit form pre-fills data correctly
- [ ] Edit updates prompt in grid
- [ ] Delete removes prompt from grid
- [ ] Empty state shows when no results
- [ ] Loading state shows during "API" delay
- [ ] Responsive on mobile (320px width)
- [ ] Responsive on tablet (768px width)
- [ ] Responsive on desktop (1920px width)

**Phase 2 (Supabase)**
- [ ] Prompts persist across page refreshes
- [ ] Multiple users have separate prompts (RLS test)
- [ ] Search finds prompts with partial matches
- [ ] Full-text search includes tags
- [ ] Categories update dynamically
- [ ] Create prompt saves to database
- [ ] Edit prompt updates database
- [ ] Delete prompt removes from database
- [ ] Logout/login shows correct user's prompts
- [ ] Network error shows error state
- [ ] Retry button works after error

### Automated Testing (Optional Future)
- Unit tests for utility functions
- Component tests with React Testing Library
- E2E tests with Playwright/Cypress

---

## 🚀 Deployment Notes

### Prerequisites
- Supabase project configured
- Database schema applied
- Environment variables set

### Deployment Steps
1. Merge feature branch to main
2. Run build: `npm run build`
3. Deploy to hosting (Netlify/Vercel/etc.)
4. Verify environment variables in production
5. Test production deployment
6. Monitor Supabase logs for errors

### Rollback Plan
If critical issues found:
1. Revert deployment
2. Fix issues in development
3. Redeploy after testing

---

## 📊 Success Metrics (Post-Launch)

- **Adoption**: % of users who create at least 1 prompt
- **Usage**: Average prompts per user
- **Engagement**: Copy actions per day
- **Performance**: Average search response time
- **Reliability**: Error rate in Supabase logs

---

## 🔮 Future Enhancements

**Phase 4 (Future)**
- [ ] Prompt sharing (public/private toggle)
- [ ] Prompt templates library
- [ ] Export/import prompts (JSON)
- [ ] Keyboard shortcuts
- [ ] Prompt versioning/history
- [ ] Favorites/pinned prompts
- [ ] Bulk operations (delete multiple)
- [ ] Advanced search (regex, boolean operators)
- [ ] AI-powered prompt suggestions
- [ ] Collaboration features
- [ ] Usage analytics per prompt
- [ ] Prompt performance tracking

---

## 📞 Support & Contact

- **Issues**: File GitHub issue with `[Prompt Bank]` prefix
- **Questions**: Check PROMPT_BANK_GUIDE.md first
- **Contributions**: Follow CONTRIBUTING.md guidelines

---

**Document Version**: 1.0  
**Last Updated**: October 21, 2025  
**Author**: Development Team  
**Status**: ✅ Ready for Implementation

