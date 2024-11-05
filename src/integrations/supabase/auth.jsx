import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase.js';
import { useQueryClient } from '@tanstack/react-query';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { toast } from 'sonner';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
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
        toast.error('Session error: ' + error.message);
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
      toast.error('Error checking admin status: ' + error.message);
      setIsAdmin(false);
      return false;
    }
  };

  const signIn = async ({ email, password, options }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options
      });
      
      if (error) throw error;
      
      if (data.user) {
        const isAdminUser = await checkAdminStatus(data.user.id);
        if (!isAdminUser) {
          throw new Error("You don't have admin access.");
        }
      }
      
      return { data };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL
      }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setIsAdmin(false);
      queryClient.invalidateQueries('user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out: ' + error.message);
      throw error;
    }
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, loading, signIn, signUp, logout, isAdmin }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export const SupabaseAuthUI = ({ onError }) => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    theme="default"
    providers={[]}
    onError={(error) => {
      console.error('Auth error:', error);
      toast.error(`Authentication error: ${error.message}`);
      if (onError) onError(error);
    }}
  />
);