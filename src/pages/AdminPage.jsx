import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { checkAdminRole } from '../utils/supabaseUtils';
import Auth from '../components/Auth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminConfigForm from '../components/AdminConfigForm';
import CreateAdminForm from '../components/CreateAdminForm';
import UserList from '../components/UserList';
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState('checking');

  const { data: adminCount } = useQuery({
    queryKey: ['adminCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');
      if (error) throw error;
      return count;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const adminStatus = await checkAdminRole();
        console.log('Admin status:', adminStatus);
        setIsAdmin(adminStatus);
        setAuthState(adminStatus ? 'admin' : 'authenticated');
      } else {
        setAuthState('unauthenticated');
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setAuthState('unauthenticated');
      setIsAdmin(false);
    }
  };

  const handleAuthStateChange = async (event, session) => {
    console.log('Auth state change in AdminPage:', event, session);
    if (event === 'SIGNED_IN') {
      setAuthState('checking');
      const adminStatus = await checkAdminRole();
      console.log('Admin status after sign in:', adminStatus);
      setIsAdmin(adminStatus);
      setAuthState(adminStatus ? 'admin' : 'authenticated');
    } else if (event === 'SIGNED_OUT') {
      setAuthState('unauthenticated');
      setIsAdmin(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (authState === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <Auth onAuthStateChange={handleAuthStateChange} />
      </div>
    );
  }

  if (authState === 'authenticated' && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertDescription>You are logged in, but you don't have admin privileges. Please contact an administrator to grant you access.</AlertDescription>
        </Alert>
        <Button onClick={handleLogout} className="mt-4">Logout</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Admin Configuration</h1>
      {adminCount === 0 ? (
        <CreateAdminForm />
      ) : (
        <>
          <AdminConfigForm />
          <UserList />
        </>
      )}
      <Button onClick={handleLogout} className="mt-8">Logout</Button>
    </div>
  );
};

export default AdminPage;
