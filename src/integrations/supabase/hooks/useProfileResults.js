import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) {
    console.error('Supabase error:', error);
    toast.error(`Error fetching data: ${error.message}`);
    throw error;
  }
  return data;
};

export const useProfileResults = () => useQuery({
  queryKey: ['profile_results'],
  queryFn: async () => {
    console.log('Fetching profile results...');
    return fromSupabase(
      supabase
        .from('impact_profile_tests')
        .select('first_name,selected_profile')
        .order('first_name', { ascending: true })
    );
  }
});