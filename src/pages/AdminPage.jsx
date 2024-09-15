import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { checkAdminRole } from '../utils/auth';
import Auth from '../components/Auth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAddSiteConfig, useUpdateSiteConfig, useSiteConfig } from '../integrations/supabase/hooks/useSiteConfig';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const { data: siteConfig, isLoading: configLoading } = useSiteConfig();
  const addSiteConfig = useAddSiteConfig();
  const updateSiteConfig = useUpdateSiteConfig();

  const [formData, setFormData] = useState({
    headerText: '',
    footerText: '',
    logoUrl: ''
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await checkAdminRole();
      setIsAdmin(adminStatus);
      setLoading(false);
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    if (siteConfig) {
      setFormData({
        headerText: siteConfig.header_text || '',
        footerText: siteConfig.footer_text || '',
        logoUrl: siteConfig.logo_url || ''
      });
    }
  }, [siteConfig]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const configData = {
      header_text: formData.headerText,
      footer_text: formData.footerText,
      logo_url: formData.logoUrl
    };

    if (siteConfig?.id) {
      updateSiteConfig.mutate({ id: siteConfig.id, ...configData });
    } else {
      addSiteConfig.mutate(configData);
    }
  };

  const createAdminUser = useMutation({
    mutationFn: async (email) => {
      // First, create a new user
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8), // Generate a random password
      });

      if (userError) throw userError;

      // Then, assign the admin role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userData.user.id, role: 'admin' });

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      toast.success('Admin user created successfully. Check email for verification.');
      setNewAdminEmail('');
    },
    onError: (error) => {
      toast.error(`Error creating admin user: ${error.message}`);
    }
  });

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    createAdminUser.mutate(newAdminEmail);
  };

  if (loading) return <div>Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <Auth />
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>You need admin privileges to access this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Admin Configuration</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="headerText">Header Text</Label>
          <Input
            id="headerText"
            name="headerText"
            value={formData.headerText}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="footerText">Footer Text</Label>
          <Input
            id="footerText"
            name="footerText"
            value={formData.footerText}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit">Save Configuration</Button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Create Admin User</h2>
      <form onSubmit={handleCreateAdmin} className="space-y-4">
        <div>
          <Label htmlFor="newAdminEmail">New Admin Email</Label>
          <Input
            id="newAdminEmail"
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Create Admin User</Button>
      </form>
    </div>
  );
};

export default AdminPage;
