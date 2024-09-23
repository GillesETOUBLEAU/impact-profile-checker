import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import { useSupabaseAuth } from '../integrations/supabase';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const supabaseAuth = useSupabaseAuth();

  useEffect(() => {
    if (supabaseAuth && supabaseAuth.session) {
      navigate('/admin');
    }
  }, [supabaseAuth, navigate]);

  const handleLogin = async (email, password) => {
    if (supabaseAuth && supabaseAuth.signIn) {
      try {
        const { error } = await supabaseAuth.signIn({ email, password });
        if (error) throw error;
        toast.success('Connexion réussie');
        navigate('/admin');
      } catch (error) {
        console.error('Erreur de connexion:', error);
        toast.error(error.message || 'Erreur de connexion');
      }
    } else {
      console.error('La fonction de connexion n\'est pas disponible');
      toast.error('Erreur de configuration de l\'authentification');
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
