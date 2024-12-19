import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import { useSupabaseAuth } from '../integrations/supabase';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { session, isAdmin } = useSupabaseAuth();

  useEffect(() => {
    console.log('Session state:', { session, isAdmin }); // Debug log
    if (session && isAdmin) {
      navigate('/admin');
    }
  }, [session, isAdmin, navigate]);

  const handleLogin = async (email, password) => {
    try {
      console.log('Login successful, redirecting...'); // Debug log
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Connexion Admin</h1>
      <Auth onLogin={handleLogin} />
    </div>
  );
};

export default AdminLoginPage;