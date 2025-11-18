-- ============================================
-- PROMPTS TABLE SETUP FOR LLM-CHAT-LINKS
-- ============================================
-- This SQL script creates the prompts table with RLS policies
-- Run this in your Supabase SQL Editor
--
-- Features:
-- - Per-user prompt storage with RLS
-- - Category as TEXT[] to match llm_links pattern
-- - Full-text search with tsvector
-- - Auto-update timestamps
-- - Sample data included
-- ============================================

-- Create the prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT[] DEFAULT '{}',  -- Array to match llm_links pattern
  description TEXT,
  prompt_text TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  search_fts TSVECTOR,  -- Full-text search column
  
  -- Constraints
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
  CONSTRAINT prompt_text_length CHECK (char_length(prompt_text) >= 10),
  CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 500)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts USING GIN(category);  -- GIN for array operations
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
    COALESCE(array_to_string(NEW.category, ' '), '') || ' ' ||
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
  filter_categories TEXT[] DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL
)
RETURNS SETOF public.prompts AS $$
  SELECT * FROM public.prompts
  WHERE user_id = auth.uid()
    AND (
      search_query IS NULL 
      OR search_fts @@ plainto_tsquery('simple', search_query)
    )
    AND (filter_categories IS NULL OR category && filter_categories)  -- Array overlap operator
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
-- SAMPLE DATA (OPTIONAL)
-- ============================================
-- Uncomment and update user_id to insert sample prompts
-- Replace 'YOUR_USER_ID_HERE' with actual UUID from auth.users

/*
INSERT INTO public.prompts (user_id, title, category, description, prompt_text, tags) VALUES
  (
    'YOUR_USER_ID_HERE'::uuid,
    'Speech Enhancer',
    ARRAY['Enhancer'],
    'Contextual instructions for the Agent (Your Personal Speech Enhancer): You are a highly skilled English language expert...',
    E'You are a highly skilled English language expert specializing in speech enhancement. Your task is to analyze the provided text and improve it while maintaining the original meaning and intent. Focus on:\n\n1. Grammar and syntax corrections\n2. Vocabulary enhancement\n3. Sentence structure optimization\n4. Tone and style consistency\n5. Clarity and conciseness\n\nProvide the enhanced version without explanations unless requested.',
    ARRAY['speech enhancer', 'Agent']
  ),
  (
    'YOUR_USER_ID_HERE'::uuid,
    'Text Format — Notion',
    ARRAY['Formatter'],
    'Agent Instructions: "Clean & Format Without Changing Meaning"...',
    E'Clean and format the following text for Notion. Preserve the original meaning but improve readability:\n\n- Use proper headings (H1, H2, H3)\n- Create bullet points and numbered lists\n- Add code blocks where appropriate\n- Format tables if present\n- Highlight important terms\n\nOutput only the formatted text.',
    ARRAY['text format', 'Agent']
  ),
  (
    'YOUR_USER_ID_HERE'::uuid,
    'Study Notes',
    ARRAY['Study Expert'],
    'I have attached my lecture documents. Please: Carefully analyze the content and identify all key topics...',
    E'Analyze the provided lecture documents and create comprehensive study notes:\n\n1. Identify and list all key topics\n2. Summarize main concepts for each topic\n3. Highlight important definitions and formulas\n4. Create a study guide with practice questions\n5. Organize information hierarchically\n\nFormat the output in markdown with clear sections.',
    ARRAY['study notes']
  );
*/

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if table was created successfully
SELECT 
  'Table created: ' || CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'prompts'
    ) 
    THEN 'YES' 
    ELSE 'NO' 
  END as status;

-- Check RLS is enabled
SELECT 
  'RLS enabled: ' || CASE 
    WHEN relrowsecurity 
    THEN 'YES' 
    ELSE 'NO' 
  END as status
FROM pg_class 
WHERE relname = 'prompts' 
AND relnamespace = 'public'::regnamespace;

-- Show column types
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'prompts' AND table_schema = 'public'
ORDER BY ordinal_position;


