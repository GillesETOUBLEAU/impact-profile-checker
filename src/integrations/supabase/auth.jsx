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
  const [isAdmin, setIsAdmin] = useState(false);
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
        if (session) {
          await checkAdminStatus(session.user.id);
        }
      }
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      if (session) {
        await checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      queryClient.invalidateQueries('user');
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('supabase.auth.token');
      }
    });

    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const checkAdminStatus = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      const adminStatus = data.role === 'admin';
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        const isAdminUser = await checkAdminStatus(data.user.id);
        if (!isAdminUser) {
          throw new Error("You don't have admin access.");
        }
      }
      
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear local storage first
      localStorage.removeItem('supabase.auth.token');
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Erreur lors de la déconnexion du serveur, mais la session locale a été fermée.');
      } else {
        toast.success('Déconnexion réussie.');
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      toast.error('Une erreur inattendue est survenue lors de la déconnexion.');
    } finally {
      // Ensure the session is cleared locally even if the server request fails
      setSession(null);
      setIsAdmin(false);
      queryClient.invalidateQueries('user');
      setLoading(false);
    }
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, loading, signIn, signUp, logout, isAdmin }}>
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
