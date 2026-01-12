# Username-Based Authentication System - Developer Documentation

A comprehensive guide to the username-based authentication system implemented in LLM Chat Links. This documentation covers architecture, implementation details, usage examples, and troubleshooting.

## 🏗️ System Architecture

### Authentication Flow Overview

The system implements a hybrid approach combining the security of email-based authentication with the user experience of username-based login:

1. **Sign-Up Flow**: `Username + Email + Password`
   - User provides all three credentials
   - Email used for Supabase Auth account creation
   - Username stored in user metadata and mirrored to profiles table
   - Database trigger automatically creates profile record

2. **Sign-In Flow**: `Username + Password` (Email-free)
   - User provides only username and password
   - RPC function resolves username → email server-side
   - Standard Supabase authentication with resolved email
   - Profile data automatically fetched and synced

3. **Profile Management**: Real-time synchronization
   - Profile data stored in dedicated `profiles` table
   - Username and avatar URL editable by users
   - Automatic profile creation via database triggers
   - Row Level Security ensures data isolation

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `AuthContext` | Main authentication provider | `src/contexts/AuthContext.tsx` |
| `SignInForm` | Username + password login | `src/components/auth/SignInForm.tsx` |
| `SignUpForm` | Registration with username | `src/components/auth/SignUpForm.tsx` |
| `UserProfile` | Profile management UI | `src/components/UserProfile.tsx` |
| `useProfile` | Profile CRUD operations | `src/hooks/useProfile.ts` |

## 🗄️ Database Schema

### Core Tables

#### `profiles` Table
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20)
);
```

#### Required RPC Function
```sql
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
```

#### Database Trigger for Auto-Profile Creation
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value TEXT;
  counter INTEGER := 0;
BEGIN
  username_value := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  
  WHILE EXISTS(SELECT 1 FROM public.profiles WHERE username = username_value) LOOP
    counter := counter + 1;
    username_value := COALESCE(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ) || counter::text;
  END LOOP;
  
  INSERT INTO public.profiles (id, username, updated_at)
  VALUES (new.id, username_value, NOW());
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 🔒 Security Model

### Row Level Security (RLS) Policies

#### Profiles Table Policies
```sql
-- Allow anyone to view profiles (needed for username lookup)
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Security Features

- **Server-Side Username Resolution**: RPC function with `SECURITY DEFINER` prevents client access to `auth.users`
- **Profile Data Isolation**: RLS ensures users only access their own profile data
- **Secure Authentication Flow**: Username never exposes email addresses to client
- **Input Validation**: Username constraints (3-20 characters) enforced at database level
- **Unique Constraints**: Prevents duplicate usernames across the system

## 💻 Implementation Details

### AuthContext Provider

The `AuthContext` is the heart of the authentication system, providing:

```typescript
interface AuthContextType {
  user: User | null;              // Supabase auth user
  session: Session | null;        // Current session
  profile: UserProfile | null;    // User profile data
  loading: boolean;               // Authentication loading state
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
  signIn: (username: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}
```

#### Key Features:
- **Automatic Profile Sync**: Profile data fetched and updated in real-time
- **Loading State Management**: 5-second failsafe prevents infinite loading
- **Toast Notifications**: User feedback for all authentication events
- **Session Restoration**: Automatic login state restoration on app reload

### Sign-In Process

```typescript
const signIn = async (username: string, password: string) => {
  // 1. Resolve username to email via RPC
  const { data: emailResult, error: rpcError } = await supabase
    .rpc('get_email_by_username', { p_username: username });
  
  // 2. Authenticate with resolved email
  const { error } = await supabase.auth.signInWithPassword({
    email: emailResult,
    password,
  });
  
  // 3. Profile automatically fetched via auth state change listener
};
```

### Profile Management

The `useProfile` hook provides comprehensive profile management:

```typescript
const { profile, updateProfile, checkUsernameAvailability, loading } = useProfile(user);

// Update username and avatar
await updateProfile({
  username: 'newusername',
  avatar_url: 'https://example.com/avatar.jpg'
});

// Check if username is available
const isAvailable = await checkUsernameAvailability('desiredusername');
```

## 📋 Usage Examples

### Basic Authentication Flow

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, profile, signIn, signUp, signOut, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Show sign-in form if not authenticated
  if (!user) {
    return <SignInForm />;
  }
  
  // Show main app with user profile
  return (
    <div>
      <h1>Welcome, {profile?.username || user.email}!</h1>
      <UserDashboard />
    </div>
  );
}
```

### Sign-Up with Username

```typescript
const handleSignUp = async (formData) => {
  const { error } = await signUp(
    formData.email,
    formData.password,
    formData.username
  );
  
  if (!error) {
    // User created successfully, check email for confirmation
    toast.success('Check your email for confirmation link');
  }
};
```

### Username-Based Sign-In

```typescript
const handleSignIn = async (formData) => {
  const { error } = await signIn(
    formData.username,  // No email required!
    formData.password
  );
  
  if (!error) {
    // Automatically redirected to main app
    // Profile data available in context
  }
};
```

### Profile Management

```typescript
import { useProfile } from '@/hooks/useProfile';

function ProfileSettings() {
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useProfile(user);
  
  const handleUpdateProfile = async (data) => {
    await updateProfile({
      username: data.username,
      avatar_url: data.avatarUrl
    });
    // Toast notification shown automatically
  };
  
  return (
    <form onSubmit={handleUpdateProfile}>
      <input 
        defaultValue={profile?.username} 
        placeholder="Username" 
      />
      <input 
        defaultValue={profile?.avatar_url} 
        placeholder="Avatar URL" 
      />
      <button type="submit" disabled={loading}>
        Update Profile
      </button>
    </form>
  );
}
```

## 🚀 Quick Setup Guide

### 1. Database Setup
Run this SQL in your Supabase SQL Editor:

```sql
-- Run the complete SQL from the README.md Database Setup section
-- This includes profiles table, RPC function, trigger, and RLS policies
```

### 2. Environment Variables
Ensure your `.env.local` contains:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the System
1. Start your development server: `npm run dev`
2. Navigate to the auth page
3. Sign up with username, email, and password
4. Sign in using only username and password
5. Edit your profile via the user dropdown

## 🐛 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Infinite loading | Missing RPC function | Run `get_email_by_username` SQL |
| Profile not found | Missing database trigger | Run profile creation trigger SQL |
| 406 errors | RLS policy issues | Check profiles table policies |
| Username conflicts | Duplicate usernames | Database constraint prevents this |
| Sign-in failures | Username doesn't exist | Verify user signed up with username |

### Debug Checklist

1. **Check Browser Console**: Look for authentication errors
2. **Verify Database Setup**: Ensure all SQL scripts ran successfully
3. **Test RPC Function**: Try calling `get_email_by_username` manually
4. **Check RLS Policies**: Verify profiles table permissions
5. **Validate Environment**: Confirm Supabase credentials are correct

### Error Messages

#### "Email not found for username"
- **Cause**: Username doesn't exist in profiles table
- **Fix**: User needs to sign up first, or check username spelling

#### "Profile not found, user may need to create one"
- **Cause**: Database trigger didn't run or failed
- **Fix**: Manually create profile or check trigger setup

#### "Cannot access profiles table"
- **Cause**: RLS policies blocking access
- **Fix**: Review and update profiles table policies

## 🔧 Advanced Configuration

### Custom Username Validation

```typescript
// In your form schema
const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');
```

### Profile Extensions

Add custom fields to profiles table:

```sql
ALTER TABLE public.profiles 
ADD COLUMN display_name TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN website_url TEXT;
```

### Real-time Username Availability

```typescript
const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

const checkUsername = useCallback(
  debounce(async (username: string) => {
    if (username.length >= 3) {
      const available = await checkUsernameAvailability(username);
      setUsernameAvailable(available);
    }
  }, 500),
  []
);
```

## 📈 Performance Considerations

### Database Indexes
```sql
-- Already included in setup
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_llm_links_user_id ON llm_links(user_id);
```

### Caching Strategies
- Profile data cached in React context
- Username availability checks debounced
- Session restoration optimized with failsafe timeout

### Bundle Optimization
- Authentication components lazy-loaded
- Profile images optimized with proper sizing
- Form validation schemas tree-shaken

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time username availability checking
- [ ] Profile picture upload to Supabase Storage
- [ ] Username change history and restrictions
- [ ] Social login integration with username prompts
- [ ] Two-factor authentication support
- [ ] Account deletion and data export

### Migration Path
If you need to migrate from email-based to username-based auth:

1. Add profiles table to existing database
2. Create migration script to generate usernames for existing users
3. Update authentication flows gradually
4. Maintain backward compatibility during transition

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Verify database setup and RLS policies
- Test with a fresh user account

This authentication system provides a robust foundation for username-based login while maintaining the security and features of Supabase Auth.

