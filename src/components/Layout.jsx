import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase';
import { toast } from 'sonner';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { session, isAdmin, logout } = useSupabaseAuth();

  const handleLogout = async () => {
    try {
      console.log('Attempting logout...'); // Debug log
      await logout();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Impact Profile Checker</h1>
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">
                Accueil
              </Button>
            </Link>
            {session && isAdmin ? (
              <>
                <Link to="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline">
                  Déconnexion
                </Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button variant="ghost">Admin Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-secondary text-secondary-foreground p-4 mt-8">
        <div className="container mx-auto text-center">
          © 2024 Impact Profile Checker
        </div>
      </footer>
    </div>
  );
};

export default Layout;