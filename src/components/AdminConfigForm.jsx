import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAddSiteConfig, useUpdateSiteConfig, useSiteConfig } from '../integrations/supabase/hooks/useSiteConfig';

const AdminConfigForm = () => {
  const { data: siteConfig, isLoading: configLoading, refetch } = useSiteConfig();
  const addSiteConfig = useAddSiteConfig();
  const updateSiteConfig = useUpdateSiteConfig();

  const [formData, setFormData] = useState({
    headerText: '',
    footerText: '',
    logoFile: null
  });
  const [previewLogo, setPreviewLogo] = useState('');

  useEffect(() => {
    if (siteConfig) {
      setFormData({
        headerText: siteConfig.header_text || '',
        footerText: siteConfig.footer_text || '',
        logoFile: null
      });
      setPreviewLogo(siteConfig.logo_url || '');
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
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let logoUrl = siteConfig?.logo_url;

    if (formData.logoFile) {
      try {
        logoUrl = await uploadLogo(formData.logoFile);
      } catch (error) {
        toast.error(`Error uploading logo: ${error.message}`);
        return;
      }
    }

    const configData = {
      header_text: formData.headerText,
      footer_text: formData.footerText,
      logo_url: logoUrl
    };

    if (siteConfig?.id) {
      updateSiteConfig.mutate({ id: siteConfig.id, ...configData }, {
        onSuccess: () => {
          toast.success('Configuration updated successfully');
          refetch();
        },
        onError: (error) => {
          toast.error(`Error updating configuration: ${error.message}`);
        }
      });
    } else {
      addSiteConfig.mutate(configData, {
        onSuccess: () => {
          toast.success('Configuration added successfully');
          refetch();
        },
        onError: (error) => {
          toast.error(`Error adding configuration: ${error.message}`);
        }
      });
    }
  };

  if (configLoading) return <div>Loading configuration...</div>;

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
