import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  has_restaurant: boolean | null;
  phone?: string | null;
}

interface AuthError {
  message: string;
}

interface AuthResult {
  error: AuthError | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  signUp: (email: string, password: string, fullName: string, username: string, phone?: string) => Promise<AuthResult>;
  signIn: (identifier: string, password: string) => Promise<AuthResult>;
  signInWithPhone: (phone: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<void> => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email || 'No session');
            
            if (!mounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user && event !== 'TOKEN_REFRESHED') {
              await fetchProfile(session.user.id);
            } else if (!session) {
              setProfile(null);
            }
            
            // Set loading to false after processing auth state
            setLoading(false);
          }
        );

        // Then get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        if (!mounted) return;
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        // If we have a session, the onAuthStateChange will handle it
        if (!session && mounted) {
          setLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, username: string, phone?: string): Promise<AuthResult> => {
    try {
      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/auth?message=welcome&email=${encodeURIComponent(email)}`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            username: username,
            phone: phone
          }
        }
      });
      
      return { error: error ? { message: error.message } : null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error: { message: error.message || 'An error occurred during signup' } };
    }
  };

  const signIn = async (identifier: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // Try email login first
      const emailResult = await supabase.auth.signInWithPassword({
        email: identifier,
        password
      });
      
      // If email login succeeds, return
      if (!emailResult.error) {
        return { error: null };
      }
      
      // If identifier doesn't contain @ and email login failed, try username lookup
      if (!identifier.includes('@')) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', identifier)
            .single();
            
          if (!profileError && profileData?.email) {
            const usernameResult = await supabase.auth.signInWithPassword({
              email: profileData.email,
              password
            });
            
            if (!usernameResult.error) {
              return { error: null };
            }
          }
        } catch (usernameError) {
          console.error('Username lookup error:', usernameError);
        }
      }
      
      // Return the original email login error
      setLoading(false);
      return { error: { message: emailResult.error.message } };
      
    } catch (error: any) {
      console.error('Signin error:', error);
      setLoading(false);
      return { error: { message: error.message || 'An error occurred during signin' } };
    }
  };

  const signInWithPhone = async (phone: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // Look up email by phone number - use simple destructuring
      const profileResponse = await supabase
        .from('profiles')
        .select('email')
        .eq('phone', phone)
        .single();
        
      if (profileResponse.error || !profileResponse.data?.email) {
        setLoading(false);
        return { error: { message: 'Phone number not found' } };
      }
      
      // Sign in with the found email
      const authResponse = await supabase.auth.signInWithPassword({
        email: profileResponse.data.email,
        password
      });
      
      if (authResponse.error) {
        setLoading(false);
        return { error: { message: authResponse.error.message } };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Phone signin error:', error);
      setLoading(false);
      return { error: { message: error.message || 'An error occurred during phone signin' } };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/auth?message=reset`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      
      return { error: error ? { message: error.message } : null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: { message: error.message || 'An error occurred during password reset' } };
    }
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    window.location.href = '/';
  };

  const value = {
    user,
    session,
    profile,
    signUp,
    signIn,
    signInWithPhone,
    signOut,
    resetPassword,
    loading,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
