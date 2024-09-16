import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAddSiteConfig, useUpdateSiteConfig, useSiteConfig } from '../integrations/supabase/hooks/useSiteConfig';
import { useSupabaseAuth } from '../integrations/supabase';
import { supabase } from '../lib/supabase';

const AdminConfigForm = () => {
  const { data: siteConfig, isLoading, error, refetch } = useSiteConfig();
  const addSiteConfig = useAddSiteConfig();
  const updateSiteConfig = useUpdateSiteConfig();
  const { session } = useSupabaseAuth();

  const [formData, setFormData] = useState({
    headerText: '',
    footerText: '',
    logoFile: null
  });
  const [previewLogo, setPreviewLogo] = useState('');

  useEffect(() => {
    if (siteConfig && siteConfig.length > 0) {
      const config = siteConfig[0];
      setFormData({
        headerText: config.header_text || '',
        footerText: config.footer_text || '',
        logoFile: null
      });
      setPreviewLogo(config.logo_url || '');
    }
  }, [siteConfig]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, logoFile: file }));
    setPreviewLogo(URL.createObjectURL(file));
  };

  const uploadLogo = async (file) => {
    const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let logoUrl = siteConfig && siteConfig.length > 0 ? siteConfig[0].logo_url : null;

    if (formData.logoFile) {
      try {
        logoUrl = await uploadLogo(formData.logoFile);
      } catch (error) {
        console.error('Error uploading logo:', error);
        toast.error(`Error uploading logo: ${error.message}`);
        return;
      }
    }

    const configData = {
      header_text: formData.headerText,
      footer_text: formData.footerText,
      logo_url: logoUrl
    };

    try {
      if (siteConfig && siteConfig.length > 0) {
        await updateSiteConfig.mutateAsync({ id: siteConfig[0].id, ...configData });
        toast.success('Configuration updated successfully');
      } else {
        await addSiteConfig.mutateAsync(configData);
        toast.success('Configuration added successfully');
      }
      refetch();
    } catch (error) {
      console.error('Error updating/adding configuration:', error);
      toast.error(`Error updating/adding configuration: ${error.message}`);
    }
  };

  if (isLoading) return <div>Loading configuration...</div>;
  if (error) return <div>Error loading configuration: {error.message}</div>;

  return (
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
        <Label htmlFor="logoFile">Logo</Label>
        <Input
          id="logoFile"
          name="logoFile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {previewLogo && (
          <img src={previewLogo} alt="Logo preview" className="mt-2 max-w-xs" />
        )}
      </div>
      <Button type="submit">Save Configuration</Button>
    </form>
  );
};

export default AdminConfigForm;
