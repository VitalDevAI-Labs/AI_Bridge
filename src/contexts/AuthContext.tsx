/**
 * Authentication Context - Username-Based Authentication System
 * 
 * This context provides a complete authentication system with username-based login,
 * user profile management, and secure session handling using Supabase Auth.
 * 
 * Key Features:
 * - Username + Password authentication (no email required for login)
 * - User profile management with customizable usernames and avatars
 * - Automatic profile creation via database triggers
 * - Row Level Security (RLS) for secure data isolation
 * - Real-time session state management
 * - Toast notifications for user feedback
 * 
 * Architecture:
 * - Sign-up: Requires email, password, and username
 * - Sign-in: Only requires username and password (email resolved via RPC)
 * - Profile: Automatically created and synced with auth user metadata
 * - Security: All data is user-scoped via RLS policies
 * 
 * @author VitalDevAILabs
 * @version 1.1.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/config/types';
 

/**
 * Authentication Context Type Definition
 * 
 * Defines the shape of the authentication context, including user state,
 * session management, profile data, and authentication methods.
 */
interface AuthContextType {
  /** Current authenticated user from Supabase Auth */
  user: User | null;
  /** Current session information */
  session: Session | null;
  /** User profile data from profiles table */
  profile: UserProfile | null;
  /** Loading state for authentication operations */
  loading: boolean;
  /** Sign up with email, password, and username */
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
  /** Sign in with username and password only */
  signIn: (username: string, password: string) => Promise<{ error: AuthError | null }>;
  /** Sign out current user */
  signOut: () => Promise<{ error: AuthError | null }>;
}

/**
 * Authentication Context
 * 
 * React context for sharing authentication state across the application.
 * Must be wrapped with AuthProvider to function properly.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * 
 * Provides authentication state and methods to child components.
 * Handles session management, profile fetching, and auth state changes.
 * 
 * Features:
 * - Automatic session restoration on app load
 * - Profile synchronization with auth user
 * - Loading timeout prevention (5s failsafe)
 * - Real-time auth state change handling
 * - Toast notifications for auth events
 * 
 * @param children - Child components to wrap with auth context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false);
  const { toast } = useToast();

  /**
   * Fetch User Profile
   * 
   * Retrieves the user's profile data from the profiles table.
   * Handles cases where profile doesn't exist (new users) gracefully.
   * 
   * @param userId - The user's UUID from auth.users
   */
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile not found, user may need to create one:', error.message);
        // Set profile to null if not found - this is normal for new users
        // The database trigger should create the profile automatically
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
    }
  };

  /**
   * Authentication State Management Effect
   * 
   * Handles initial session restoration and sets up real-time auth state listeners.
   * Includes a failsafe timeout to prevent infinite loading states.
   */
  useEffect(() => {
    // Failsafe timeout to prevent infinite loading (5 seconds)
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout - forcing loading to false');
      setLoading(false);
    }, 5000);

    // Get initial session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'User logged in' : 'No user');
      clearTimeout(loadingTimeout);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch profile if user is authenticated
      if (session?.user) {
        console.log('Fetching profile for user:', session.user.id);
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
      console.log('Auth loading set to false');
    }).catch((error) => {
      console.error('Error getting initial session:', error);
      clearTimeout(loadingTimeout);
      setLoading(false);
    });

    // Listen for auth state changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false); // Set loading to false immediately for auth changes
        
        // Fetch profile asynchronously without blocking UI
        if (session?.user) {
          fetchProfile(session.user.id); // Don't await - non-blocking
        } else {
          setProfile(null);
        }

        // Show toast notifications for auth events
        if (event === 'SIGNED_IN' && !hasShownWelcomeToast) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          setHasShownWelcomeToast(true);
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
          setHasShownWelcomeToast(false); // Reset for next login
        }
      }
    );

    // Cleanup subscription and timeout on unmount
    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [toast]);

  /**
   * Sign Up Function
   * 
   * Creates a new user account with email, password, and username.
   * The username is stored in user metadata and will be automatically
   * copied to the profiles table by the database trigger.
   * 
   * Flow:
   * 1. Create auth user with email/password
   * 2. Store username in user metadata
   * 3. Database trigger creates profile record
   * 4. User receives email confirmation
   * 
   * @param email - User's email address (required for auth)
   * @param password - User's password (min 6 characters)
   * @param username - User's chosen username (3-20 characters)
   * @returns Promise with error state
   */
  const signUp = async (email: string, password: string, username: string) => {
    // Store username in user metadata - the database trigger will create the profile
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // Stored in raw_user_meta_data
      }
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link.",
      });
    }

    return { error };
  };

  /**
   * Sign In Function - Username-Based Authentication
   * 
   * Authenticates users using only username and password.
   * Uses a Supabase RPC function to resolve username to email server-side.
   * 
   * Flow:
   * 1. Call RPC 'get_email_by_username' to resolve username → email
   * 2. Use resolved email with password for Supabase auth
   * 3. Handle authentication result and show appropriate feedback
   * 
   * Security Note:
   * - RPC function runs with SECURITY DEFINER privileges
   * - Client cannot directly access auth.users table
   * - Username resolution is secure and server-side only
   * 
   * @param username - User's username (from profiles table)
   * @param password - User's password
   * @returns Promise with error state
   */
  const signIn = async (username: string, password: string) => {
    try {
      // Username-only login: resolve username to email via secure RPC
      // This RPC function has SECURITY DEFINER privileges to access auth.users
      const { data: emailResult, error: rpcError } = await (supabase as any)
        .rpc('get_email_by_username', { p_username: username });

      if (rpcError || !emailResult) {
        toast({
          title: "Sign in failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        return { error: rpcError ?? new Error('Email not found for username') };
      }

      // Authenticate with resolved email and provided password
      const { error } = await supabase.auth.signInWithPassword({
        email: emailResult as string,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { error: null };
    } catch (err: any) {
      console.error('Sign in error:', err);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error: err };
    }
  };

  /**
   * Sign Out Function
   * 
   * Signs out the current user and clears all auth state.
   * Triggers auth state change listeners to update UI.
   * 
   * @returns Promise with error state
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }

    return { error };
  };

  // Context value object
  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider component tree.
 * 
 * @throws Error if used outside of AuthProvider
 * @returns Authentication context value
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, signIn, signOut } = useAuth();
 *   
 *   if (!user) {
 *     return <SignInForm />;
 *   }
 *   
 *   return <UserDashboard />;
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
