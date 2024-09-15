// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Import hooks from the hooks directory
import {
  useImpactProfileTests,
  useImpactProfileTest,
  useAddImpactProfileTest,
  useUpdateImpactProfileTest,
  useDeleteImpactProfileTest
} from './hooks/useImpactProfileTests';

import {
  useSiteConfig,
  useSiteConfigById,
  useAddSiteConfig,
  useUpdateSiteConfig,
  useDeleteSiteConfig
} from './hooks/useSiteConfig';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useImpactProfileTests,
  useImpactProfileTest,
  useAddImpactProfileTest,
  useUpdateImpactProfileTest,
  useDeleteImpactProfileTest,
  useSiteConfig,
  useSiteConfigById,
  useAddSiteConfig,
  useUpdateSiteConfig,
  useDeleteSiteConfig
};
