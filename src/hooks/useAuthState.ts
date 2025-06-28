
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { authService } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      const profileData = await authService.fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    let subscription: any;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get current session first
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        // Set initial state
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            const profileData = await authService.fetchProfile(currentSession.user.id);
            setProfile(profileData);
          }
          
          setLoading(false);
        }

        // Set up auth state listener
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email || 'No session');
            
            if (!mounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user && event !== 'TOKEN_REFRESHED') {
              // Use setTimeout to avoid blocking the auth state change
              setTimeout(async () => {
                if (mounted) {
                  const profileData = await authService.fetchProfile(session.user.id);
                  setProfile(profileData);
                }
              }, 0);
            } else if (!session) {
              setProfile(null);
            }
          }
        );

        subscription = authSubscription;
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
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

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
