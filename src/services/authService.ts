
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
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  validatePhone(phone: string): boolean {
    // Basic phone validation - should start with + and have at least 10 digits
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  },

  async signUp(email: string, password: string, fullName: string, username: string, phone: string): Promise<AuthResult> {
    try {
      // Validate phone number - Fixed typo: changed vlidatePhone to validatePhone
      if (!phone || !this.validatePhone(phone)) {
        return { error: { message: 'Please enter a valid phone number with country code (e.g., +1234567890)' } };
      }

      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return { error: { message: 'Username already exists. Please choose a different username.' } };
      }

      // Check if phone already exists
      const { data: existingPhone, error: phoneError } = await supabase
        .from('profiles')
        .select('phone')
        .eq('phone', phone)
        .single();

      if (existingPhone) {
        return { error: { message: 'Phone number already registered. Please use a different phone number.' } };
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
            username: username,
            phone: phone
          }
        }
      });
      
      if (error) {
        return { error: { message: error.message } };
      }
      
      return { error: null };
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
      // Validate phone format
      if (!this.validatePhone(phone)) {
        return { error: { message: 'Please enter a valid phone number with country code' } };
      }

      // Look up user by phone number
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('phone', phone)
        .single();
        
      if (profileError || !profileData?.email) {
        return { error: { message: 'No account found with this phone number' } };
      }
      
      // Sign in with the email associated with the phone number
      const { error } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password
      });
      
      if (error) {
        return { error: { message: error.message } };
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
      
      if (error) {
        return { error: { message: error.message } };
      }
      
      return { error: null };
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
