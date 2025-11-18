-- Complete Database Setup for Username-Based Authentication
-- Run this entire script in your Supabase SQL Editor
-- This includes all tables, functions, triggers, and policies needed for the system

-- ============================================================================
-- 1. CREATE PROFILES TABLE
-- ============================================================================

-- Create profiles table for username-based authentication
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20)
);

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. CREATE RLS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Allow anyone to view profiles (needed for username lookup during sign-in)
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- ============================================================================
-- 4. CREATE RPC FUNCTION FOR USERNAME RESOLUTION
-- ============================================================================

-- Critical function: Resolves username to email for authentication
-- This runs with elevated privileges to access auth.users table
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT u.email INTO v_email
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
  WHERE p.username = p_username;
  
  RETURN v_email;
END;
$$;

-- ============================================================================
-- 5. CREATE AUTOMATIC PROFILE CREATION TRIGGER
-- ============================================================================

-- Function to automatically create profile when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get username from user metadata or generate from email
  username_value := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  
  -- Ensure username is unique by appending numbers if needed
  WHILE EXISTS(SELECT 1 FROM public.profiles WHERE username = username_value) LOOP
    counter := counter + 1;
    username_value := COALESCE(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ) || counter::text;
  END LOOP;
  
  -- Create the profile record
  INSERT INTO public.profiles (id, username, updated_at)
  VALUES (new.id, username_value, NOW());
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to execute the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ============================================================================
-- 7. GRANT PERMISSIONS
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO authenticated;

-- ============================================================================
-- 8. VERIFICATION
-- ============================================================================

-- Test the setup
SELECT 'Username-based authentication database setup complete!' as status;

-- Show current profile count
SELECT COUNT(*) as existing_profiles FROM public.profiles;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- 
-- Your database is now ready for username-based authentication!
-- 
-- Next steps:
-- 1. Test user registration with username
-- 2. Test username-based sign-in
-- 3. Verify profile creation and management
--
-- For troubleshooting, check:
-- - Profiles table exists and has RLS enabled
-- - RPC function get_email_by_username is created
-- - Trigger on_auth_user_created is active
-- - All policies are in place
-- ============================================================================
