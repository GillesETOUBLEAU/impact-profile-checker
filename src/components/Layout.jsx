import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase';
import { toast } from 'sonner';

const Layout = ({ children }) => {
  const { session, logout } = useSupabaseAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Impact Profile Checker</h1>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            {session ? (
              <>
                <Link to="/admin" className="hover:underline">Admin</Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin" className="hover:underline">Admin Login</Link>
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
