import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import { useImpactProfileTest, useImpactProfileTests, useAddImpactProfileTest, useUpdateImpactProfileTest } from './hooks/useImpactProfileTests';
import { useProfileResult, useProfileResults, useAddProfileResult, useUpdateProfileResult } from './hooks/useProfileResults';

export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useImpactProfileTest,
  useImpactProfileTests,
  useAddImpactProfileTest,
  useUpdateImpactProfileTest,
  useProfileResult,
  useProfileResults,
  useAddProfileResult,
  useUpdateProfileResult
};