
import { supabase } from '@/integrations/supabase/client';
import { AuthResult, Profile } from '@/types/auth';

class AuthService {
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
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async signUp(email: string, password: string, fullName: string, username: string): Promise<AuthResult> {
    try {
      console.log('Starting signup process...');
      
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUser) {
        return { error: { message: 'Username already exists. Please choose a different username.' } };
      }

      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/auth?message=welcome&email=${encodeURIComponent(email)}`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            username: username
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        return { error: { message: error.message } };
      }
      
      console.log('Signup successful');
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error: { message: error.message || 'An error occurred during signup' } };
    }
  }

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
            .maybeSingle();
            
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
  }

  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/auth?message=reset`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      
      if (error) {
        return { error: { message: error.message } };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: { message: error.message || 'An error occurred during password reset' } };
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
}

// Export a single instance to maintain consistent context
export const authService = new AuthService();
