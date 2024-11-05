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
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Current session:', session); // Debug log

        if (!session) {
          console.log('No session found, redirecting to login'); // Debug log
          toast.error("Please log in first");
          navigate('/admin/login');
          return;
        }
        
        const adminStatus = await checkAdminRole();
        console.log('Admin status check result:', adminStatus); // Debug log
        
        if (!adminStatus) {
          console.log('User is not admin, redirecting'); // Debug log
          toast.error("You don't have admin privileges");
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error("Authentication error occurred");
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [session, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="flex justify-center items-center min-h-screen">
      Access denied. Please log in with an admin account.
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <div className="space-y-8">
        <ProfileResultsDisplay />
      </div>
    </div>
  );
};

export default AdminPage;