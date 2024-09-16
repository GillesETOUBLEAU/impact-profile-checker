import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';
import AdminConfigForm from '../components/AdminConfigForm';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Auth from '../components/Auth';

const AdminPage = () => {
  const navigate = useNavigate();
  const { session, logout } = useSupabaseAuth();

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

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <Auth />
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
