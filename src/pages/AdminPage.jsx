import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';
import AdminConfigForm from '../components/AdminConfigForm';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Auth from '../components/Auth';
import { checkAdminRole } from '../utils/auth';

const AdminPage = () => {
  const navigate = useNavigate();
  const { session, logout } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const clearSessionAndCheck = async () => {
      // Clear any existing session
      await logout();
      setIsLoading(false);
    };
    clearSessionAndCheck();
  }, [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      if (session) {
        const adminStatus = await checkAdminRole();
        setIsAdmin(adminStatus);
        if (!adminStatus) {
          toast.error("You don't have admin privileges.");
          await logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [session, logout]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Admin Page</h1>
      {!session && <Auth />}
      {session && !isAdmin && (
        <div>
          <p>You are logged in, but you don't have admin privileges.</p>
          <Button onClick={handleLogout} className="mt-4">Logout</Button>
        </div>
      )}
      {session && isAdmin && (
        <>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Admin Configuration</h2>
            <AdminConfigForm />
          </div>
          <Button onClick={handleLogout} className="mt-4">Logout</Button>
        </>
      )}
    </div>
  );
};

export default AdminPage;
