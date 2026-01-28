import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isPro: boolean;
  isVerifiedTechnician: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [isVerifiedTechnician, setIsVerifiedTechnician] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = async (userId: string) => {
    console.log('Fixium Auth: Fetching profile and roles for:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) console.error('Fixium Auth: Profile query error:', error);
      if (data) {
        setProfile(data);
        setIsPro(data.is_pro && (!data.subscription_expires_at || new Date(data.subscription_expires_at) > new Date()));
      }

      // Check technician status
      const { data: techData, error: techError } = await supabase
        .from('technician_applications')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle();

      if (techError) console.error('Fixium Auth: Tech status check error:', techError);
      setIsVerifiedTechnician(techData?.status === 'approved');

      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError) console.error('Fixium Auth: Admin role check error:', roleError);
      console.log('Fixium Auth: Role data retrieved:', roleData);
      setIsAdmin(!!roleData);
    } catch (err) {
      console.error('Fixium Auth: Critical error in fetchProfile:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      console.log('Fixium Auth: Initializing...');
      try {
        // 1. Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Fixium Auth: Session retrieval error:', sessionError);
        }

        if (!mounted) return;

        if (initialSession?.user) {
          console.log('Fixium Auth: Found active session for:', initialSession.user.id);
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id);
        } else {
          console.log('Fixium Auth: No active session detected.');
        }
      } catch (err) {
        console.error('Fixium Auth: Unexpected initialization crash:', err);
      } finally {
        if (mounted) {
          console.log('Fixium Auth: Initialization complete. Resolving loader.');
          setIsLoading(false);
        }
      }

      // 2. Set up listener for future changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Fixium Auth: State change detected:', event);
          if (!mounted) return;

          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          try {
            if (currentSession?.user) {
              await fetchProfile(currentSession.user.id);
            } else {
              setProfile(null);
              setIsPro(false);
              setIsVerifiedTechnician(false);
              setIsAdmin(false);
            }
          } catch (err) {
            console.error('Fixium Auth: State change handler error:', err);
          } finally {
            if (mounted) {
              setIsLoading(false);
            }
          }
        }
      );

      return subscription;
    }

    const initPromise = initializeAuth();

    return () => {
      mounted = false;
      initPromise.then(sub => sub?.unsubscribe());
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: displayName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsPro(false);
    setIsVerifiedTechnician(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isPro,
        isVerifiedTechnician,
        isAdmin,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
