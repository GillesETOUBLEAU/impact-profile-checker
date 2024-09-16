import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';
import { checkAdminRole } from '../utils/auth';
import AdminConfigForm from '../components/AdminConfigForm';
import Auth from '../components/Auth';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';

const AdminPage = () => {
  const navigate = useNavigate();
  const { session, logout } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      const adminStatus = await checkAdminRole();
      setIsAdmin(adminStatus);
      setLoading(false);
    };
    checkAuth();
  }, [session]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
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
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <Auth />
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
