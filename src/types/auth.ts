
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  has_restaurant: boolean | null;
  phone: string; // Made required, not optional
}

export interface AuthError {
  message: string;
}

export interface AuthResult {
  error: AuthError | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  signUp: (email: string, password: string, fullName: string, username: string, phone: string) => Promise<AuthResult>;
  signIn: (identifier: string, password: string) => Promise<AuthResult>;
  signInWithPhone: (phone: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}
