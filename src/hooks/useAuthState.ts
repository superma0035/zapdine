
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { authService } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      const profileData = await authService.fetchProfile(user.id);
      setProfile(profileData);
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
              const profileData = await authService.fetchProfile(session.user.id);
              setProfile(profileData);
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
  }, [user]);

  return {
    user,
    session,
    profile,
    loading,
    refreshProfile,
    setUser,
    setSession,
    setProfile
  };
};
