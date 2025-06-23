import { supabase } from '@/integrations/supabase/client';
import { AuthResult, Profile } from '@/types/auth';

export const authService = {
  async fetchProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched:', data);
      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async signUp(email: string, password: string, fullName: string, username: string, phone?: string): Promise<AuthResult> {
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
  },

  async signIn(identifier: string, password: string): Promise<AuthResult> {
    try {
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
      return { error: { message: emailResult.error.message } };
      
    } catch (error: any) {
      console.error('Signin error:', error);
      return { error: { message: error.message || 'An error occurred during signin' } };
    }
  },

  async signInWithPhone(phone: string, password: string): Promise<AuthResult> {
    try {
      // Use raw SQL-like approach to avoid TypeScript inference issues
      const { data: profilesData, error: profilesError } = await supabase.rpc('get_user_email_by_phone', { phone_number: phone });
      
      if (profilesError || !profilesData) {
        // Fallback to direct table query with explicit typing
        const response = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', phone)
          .limit(1);
        
        if (response.error || !response.data || response.data.length === 0) {
          return { error: { message: 'Phone number not found' } };
        }
        
        const userEmail = response.data[0]?.email;
        
        if (!userEmail) {
          return { error: { message: 'Phone number not found' } };
        }
        
        // Sign in with the found email
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password
        });
        
        if (authError) {
          return { error: { message: authError.message } };
        }
        
        return { error: null };
      }
      
      // If RPC worked, use that result
      const userEmail = profilesData;
      
      if (!userEmail) {
        return { error: { message: 'Phone number not found' } };
      }
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password
      });
      
      if (authError) {
        return { error: { message: authError.message } };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Phone signin error:', error);
      return { error: { message: error.message || 'An error occurred during phone signin' } };
    }
  },

  async resetPassword(email: string): Promise<AuthResult> {
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
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
};
