import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  try {
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .not('selected_profile', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      toast.error(`Error fetching data: ${error.message}`);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    toast.error('Failed to fetch results');
    throw error;
  }
};

export const useProfileResults = () => useQuery({
  queryKey: ['profile_results'],
  queryFn: fetchProfileResults,
  refetchInterval: 5000,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  retry: 3
});