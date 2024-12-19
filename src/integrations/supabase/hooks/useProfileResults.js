import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  console.log('Starting to fetch profile results...'); // Debug log
  
  try {
    // First verify we can access the table
    const { data: testData, error: testError } = await supabase
      .from('impact_profile_tests')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Table access test failed:', testError);
      throw new Error(`Cannot access table: ${testError.message}`);
    }

    console.log('Table access test successful:', testData);

    // Now fetch all results with a timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), 5000)
    );

    const queryPromise = supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('Error fetching profile results:', error);
      throw error;
    }

    if (!data) {
      console.log('No data returned from query');
      return [];
    }

    console.log('Successfully fetched profile results:', data);
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
    retry: 1,
    retryDelay: 1000,
    staleTime: 30000,
    cacheTime: 60000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Query error:', error);
      toast.error('Error loading results');
    }
  });
};