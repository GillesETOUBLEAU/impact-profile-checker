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
    const checkAuth = async () => {
      if (session) {
        const adminStatus = await checkAdminRole();
        setIsAdmin(adminStatus);
        if (!adminStatus) {
          toast.error("Vous n'avez pas les privilèges d'administrateur.");
          navigate('/');
        }
      } else {
        navigate('/admin/login');
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [session, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      navigate('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Page d'administration</h1>
      {!session && <Auth />}
      {session && !isAdmin && (
        <div>
          <p>Vous êtes connecté, mais vous n'avez pas les privilèges d'administrateur.</p>
          <Button onClick={handleLogout} className="mt-4">Déconnexion</Button>
        </div>
      )}
      {session && isAdmin && (
        <>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Configuration d'administration</h2>
            <AdminConfigForm />
          </div>
          <Button onClick={handleLogout} className="mt-4">Déconnexion</Button>
        </>
      )}
    </div>
  );
};

export default AdminPage;
