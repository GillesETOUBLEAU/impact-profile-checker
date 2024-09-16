import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Layout = ({ children }) => {
  const { data: siteConfig, isLoading, error } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching site configuration:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const { session, logout } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          {siteConfig?.logo_url && (
            <img src={siteConfig.logo_url} alt="Logo" className="h-10" />
          )}
          <h1 className="text-2xl font-bold">{siteConfig?.header_text || 'Impact Profile Checker'}</h1>
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
              <Link to="/admin/login" className="hover:underline">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              An error occurred while loading the site configuration. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}
        {children}
      </main>
      <footer className="bg-secondary text-secondary-foreground p-4 mt-8">
        <div className="container mx-auto text-center">
          {siteConfig?.footer_text || '© 2024 Impact Profile Checker'}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
