import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { checkAdminRole } from '../utils/auth';
import Auth from './Auth';
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminPage = () => {
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await checkAdminRole();
      setIsAdmin(adminStatus);
      setLoading(false);
    };
    checkAdmin();
  }, []);

  const { data: siteConfig, isLoading, error, refetch } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  useEffect(() => {
    if (siteConfig) {
      setHeaderText(siteConfig.header_text || '');
      setFooterText(siteConfig.footer_text || '');
      setLogoPreview(siteConfig.logo_url || '');
    }
  }, [siteConfig]);

  const updateConfig = useMutation({
    mutationFn: async (newConfig) => {
      const { data, error } = await supabase
        .from('site_config')
        .upsert(newConfig)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      refetch();
      toast.success('Configuration updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating configuration: ${error.message}`);
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let logoUrl = siteConfig ? siteConfig.logo_url : null;

    if (logoFile) {
      try {
        const fileName = `logo_${Date.now()}.${logoFile.name.split('.').pop()}`;
        const { error: uploadError, data } = await supabase.storage
          .from('site-assets')
          .upload(fileName, logoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(fileName);

        logoUrl = publicUrl;
      } catch (error) {
        toast.error(`Error uploading logo: ${error.message}`);
        return;
      }
    }

    updateConfig.mutate({
      id: siteConfig?.id,
      header_text: headerText,
      footer_text: footerText,
      logo_url: logoUrl,
    });
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

  if (isLoading) return <div>Loading configuration...</div>;
  if (error) return <div>Error loading configuration: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Admin Configuration</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="headerText">Header Text</Label>
          <Input
            id="headerText"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="footerText">Footer Text</Label>
          <Input
            id="footerText"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="logo">Logo</Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
          {logoPreview && (
            <img src={logoPreview} alt="Logo preview" className="mt-2 h-20" />
          )}
        </div>
        <Button type="submit">Save Configuration</Button>
      </form>
    </div>
  );
};

export default AdminPage;
