import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  const { data, error } = await supabase
    .from('impact_profile_tests')
    .select('first_name,selected_profile,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    toast.error(`Error fetching data: ${error.message}`);
    throw error;
  }

  return data;
};

export const useProfileResults = () => useQuery({
  queryKey: ['profile_results'],
  queryFn: fetchProfileResults,
  staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  retry: 2
});