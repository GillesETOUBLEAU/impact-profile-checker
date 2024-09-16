import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase.js';
import { useQueryClient } from '@tanstack/react-query';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { toast } from 'sonner';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  return (
    <SupabaseAuthProviderInner>
      {children}
    </SupabaseAuthProviderInner>
  );
}

export const SupabaseAuthProviderInner = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        toast.error('Erreur lors de la récupération de la session.');
      } else {
        setSession(session);
      }
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      queryClient.invalidateQueries('user');
      if (event === 'SIGNED_OUT') {
        // Clear any application-specific stored data
        localStorage.removeItem('supabase.auth.token');
      }
    });

    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Erreur lors de la déconnexion: ' + error.message);
      } else {
        setSession(null);
        queryClient.invalidateQueries('user');
        toast.success('Déconnexion réussie.');
        // Clear any application-specific stored data
        localStorage.removeItem('supabase.auth.token');
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      toast.error('Une erreur inattendue est survenue lors de la déconnexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, loading, signIn, signUp, logout }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};

export const SupabaseAuthUI = ({ onError }) => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    theme="default"
    providers={[]}
    onError={(error) => {
      console.error('Auth error:', error);
      toast.error(`Erreur d'authentification: ${error.message}`);
      if (onError) onError(error);
    }}
  />
);
