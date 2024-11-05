import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  try {
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')  // Select all columns to ensure we have the data
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      toast.error(`Error fetching data: ${error.message}`);
      throw error;
    }

    console.log('Fetched data:', data); // Debug log to see what data we're getting
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
  staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  retry: 2,
  refetchOnWindowFocus: true
});