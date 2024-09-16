import React from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import { useSupabaseAuth } from '../integrations/supabase';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();

  React.useEffect(() => {
    if (session) {
      navigate('/admin');
    }
  }, [session, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
      <Auth />
    </div>
  );
};

export default AdminLoginPage;