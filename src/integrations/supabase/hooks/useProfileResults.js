import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  try {
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      toast.error(`Error fetching data: ${error.message}`);
      throw error;
    }

    console.log('Fetched profile results:', data);
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
  staleTime: 1000,
  refetchInterval: 3000,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  retry: 3
});