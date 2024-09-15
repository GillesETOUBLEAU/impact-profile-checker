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
    logoUrl: ''
  });

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
  );
};

export default AdminConfigForm;