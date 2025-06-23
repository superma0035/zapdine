
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, profile, loading, refreshProfile, setUser, setSession, setProfile } = useAuthState();

  const signOut = async (): Promise<void> => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const value = {
    user,
    session,
    profile,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signInWithPhone: authService.signInWithPhone,
    signOut,
    resetPassword: authService.resetPassword,
    loading,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
