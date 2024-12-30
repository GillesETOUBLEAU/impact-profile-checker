import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  console.log('Starting to fetch profile results...'); 
  
  try {
    // First verify table access
    const { error: tableError } = await supabase
      .from('impact_profile_tests')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('Table access error:', tableError);
      toast.error('Unable to access profile results table');
      throw tableError;
    }

    // Fetch actual data
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profile results:', error);
      toast.error(`Failed to load profile results: ${error.message}`);
      throw error;
    }

    console.log('Raw profile results:', data);
    
    if (!data || !Array.isArray(data)) {
      console.log('No valid data returned from query');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch profile results:', error);
    toast.error('Failed to load profile results');
    throw error;
  }
};

export const useProfileResults = () => {
  return useQuery({
    queryKey: ['profile_results'],
    queryFn: fetchProfileResults,
    initialData: [],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 10000
  });
};