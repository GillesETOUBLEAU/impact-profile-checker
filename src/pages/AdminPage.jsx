import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';
import Auth from '../components/Auth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminConfigForm from '../components/AdminConfigForm';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const { session, isAdmin, logout } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (!session) {
        setLoading(false);
        return;
      }
      setLoading(false);
    };
    checkAuth();
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
