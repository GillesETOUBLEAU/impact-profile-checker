import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';
import { checkAdminRole } from '../utils/auth';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ProfileResultsDisplay from '../components/ProfileResultsDisplay';

const AdminPage = () => {
  const navigate = useNavigate();
  const { session, logout } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!session) {
        navigate('/admin/login');
        return;
      }
      const adminStatus = await checkAdminRole();
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        toast.error("You don't have admin privileges.");
        navigate('/');
      }
    };
    checkAuth();
  }, [session, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <ProfileResultsDisplay />
    </div>
  );
};

export default AdminPage;