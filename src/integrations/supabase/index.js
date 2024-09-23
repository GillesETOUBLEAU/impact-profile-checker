// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Import all hooks
import {
  useSiteContent,
  useSiteContents,
  useAddSiteContent,
  useUpdateSiteContent,
  useDeleteSiteContent
} from './hooks/useSiteContent';

import {
  useProfileResult,
  useProfileResults,
  useAddProfileResult,
  useUpdateProfileResult,
  useDeleteProfileResult
} from './hooks/useProfileResults';

import {
  useProfile,
  useProfiles,
  useAddProfile,
  useUpdateProfile,
  useDeleteProfile
} from './hooks/useProfiles';

import {
  useImpactProfileTest,
  useImpactProfileTests,
  useAddImpactProfileTest,
  useUpdateImpactProfileTest,
  useDeleteImpactProfileTest
} from './hooks/useImpactProfileTests';

import {
  useUserRole,
  useUserRoles,
  useAddUserRole,
  useUpdateUserRole,
  useDeleteUserRole
} from './hooks/useUserRoles';

import {
  useUser,
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser
} from './hooks/useUsers';

import {
  useSiteConfig,
  useSiteConfigs,
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
  useSiteContent,
  useSiteContents,
  useAddSiteContent,
  useUpdateSiteContent,
  useDeleteSiteContent,
  useProfileResult,
  useProfileResults,
  useAddProfileResult,
  useUpdateProfileResult,
  useDeleteProfileResult,
  useProfile,
  useProfiles,
  useAddProfile,
  useUpdateProfile,
  useDeleteProfile,
  useImpactProfileTest,
  useImpactProfileTests,
  useAddImpactProfileTest,
  useUpdateImpactProfileTest,
  useDeleteImpactProfileTest,
  useUserRole,
  useUserRoles,
  useAddUserRole,
  useUpdateUserRole,
  useDeleteUserRole,
  useUser,
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
  useSiteConfig,
  useSiteConfigs,
  useAddSiteConfig,
  useUpdateSiteConfig,
  useDeleteSiteConfig
};
