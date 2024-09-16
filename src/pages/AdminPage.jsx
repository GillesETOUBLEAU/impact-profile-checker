import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';
import AdminConfigForm from '../components/AdminConfigForm';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

const AdminPage = () => {
  const navigate = useNavigate();
  const { session, logout } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (error) throw error;
          setIsAdmin(data.role === 'admin');
        } catch (error) {
          console.error('Error checking admin status:', error);
          toast.error('Error verifying admin status');
        }
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [session]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Admin Login Required</h1>
        <Alert>
          <AlertDescription>Please log in to access the admin page.</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/admin/login')} className="mt-4">Go to Login</Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Alert variant="destructive">
          <AlertDescription>You don't have admin privileges. Please contact an administrator for access.</AlertDescription>
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
