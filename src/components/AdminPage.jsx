import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const AdminPage = () => {
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const queryClient = useQueryClient();

  const { data: siteConfig, isLoading, error } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .limit(1);
      if (error) throw error;
      return data[0] || null; // Return null if no rows are found
    },
    retry: 1, // Retry once in case of network issues
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
      let { data, error } = await supabase
        .from('site_config')
        .upsert(newConfig, { onConflict: 'id' })
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries('siteConfig');
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
    let logoUrl = siteConfig?.logo_url;

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
      id: siteConfig?.id || undefined, // Include the id for upsert if it exists
      header_text: headerText,
      footer_text: footerText,
      logo_url: logoUrl,
    });
  };

  if (isLoading) return <div>Loading...</div>;
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