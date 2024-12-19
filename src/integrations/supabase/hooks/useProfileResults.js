import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';
import { useSupabaseAuth } from '../auth';

const fetchProfileResults = async () => {
  console.log('Starting to fetch profile results...'); // Debug log
  
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session found');
      return [];
    }

    // First verify we can access the table
    const { data: testData, error: testError } = await supabase
      .from('impact_profile_tests')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Table access test failed:', testError);
      throw new Error(`Cannot access table: ${testError.message}`);
    }

    console.log('Table access test successful:', testData);

    // Fetch all results
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

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
  const { session } = useSupabaseAuth();

  return useQuery({
    queryKey: ['profile_results', session?.user?.id],
    queryFn: fetchProfileResults,
    enabled: !!session,
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