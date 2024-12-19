import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  console.log('Fetching profile results...'); // Debug log
  
  try {
    // First, let's check if we can connect to Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from('impact_profile_tests')
      .select('count')
      .limit(1)
      .single();

    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      throw new Error(`Connection error: ${connectionError.message}`);
    }

    console.log('Connection test successful:', connectionTest);

    // Now fetch the actual data
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Data fetch error:', error);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }

    if (!data) {
      console.log('No data returned');
      return [];
    }

    console.log('Successfully fetched data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    toast.error('Failed to fetch results');
    throw error;
  }
};

export const useProfileResults = () => {
  return useQuery({
    queryKey: ['profile_results'],
    queryFn: fetchProfileResults,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Query error:', error);
      toast.error('Error loading results');
    }
  });
};