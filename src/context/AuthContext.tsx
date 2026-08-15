import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Ações de autenticação
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthError | null>;

  // Modal de logout
  isLogoutModalOpen: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildProfile(user: User): UserProfile {
  const name =
    (user.user_metadata?.name as string) ||
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Usuário';

  return {
    id: user.id,
    name,
    email: user.email ?? '',
    avatarUrl: user.user_metadata?.avatar_url as string | undefined,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Sincroniza sessão ao montar e observa mudanças de autenticação
  useEffect(() => {
    // Carrega sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? buildProfile(session.user) : null);
      setIsLoading(false);
    });

    // Listener para mudanças (login, logout, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ? buildProfile(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Ações ──────────────────────────────────────────────────────────────────

  const signIn = async (email: string, password: string): Promise<AuthError | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error: AuthError | null; needsConfirmation: boolean }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    // needsConfirmation = true quando o usuário ainda não foi confirmado por e-mail
    const needsConfirmation = !error && !!data.user && !data.session;
    return { error, needsConfirmation };
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setIsLogoutModalOpen(false);
  };

  const resetPassword = async (email: string): Promise<AuthError | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error;
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        signIn,
        signUp,
        signOut,
        logout: signOut,
        resetPassword,
        isLogoutModalOpen,
        openLogoutModal,
        closeLogoutModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
