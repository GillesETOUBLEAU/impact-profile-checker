import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminConfigForm from '../components/AdminConfigForm';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useSupabaseAuth } from '../integrations/supabase';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const { session, isAdmin, logout } = useSupabaseAuth();
  const navigate = useNavigate();

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
    setLoading(false);
  }, [session, isAdmin]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <Auth />
      </div>
    );
  }

  if (!isAdmin) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Configuration</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <AdminConfigForm />
    </div>
  );
};

export default AdminPage;
