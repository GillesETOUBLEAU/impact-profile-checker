import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';
import { Button } from "@/components/ui/button";

const Layout = ({ children }) => {
  const { data: siteConfig } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { session, logout } = useSupabaseAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          {siteConfig?.logo_url && (
            <img src={siteConfig.logo_url} alt="Logo" className="h-10" />
          )}
          <h1 className="text-2xl font-bold">{siteConfig?.header_text || 'Impact Profile Checker'}</h1>
          <nav className="flex items-center">
            <Link to="/" className="mr-4">Home</Link>
            {session ? (
              <>
                <Link to="/admin" className="mr-4">Admin</Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-secondary text-secondary-foreground p-4 mt-8">
        <div className="container mx-auto text-center">
          {siteConfig?.footer_text || '© 2023 Impact Profile Checker'}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
