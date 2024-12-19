import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';
import { useSupabaseAuth } from '../auth';

const fetchProfileResults = async () => {
  console.log('Starting to fetch profile results...'); // Debug log
  
  try {
    const { data: session } = await supabase.auth.getSession();
    console.log('Current session:', session); // Debug log
    
    if (!session?.user) {
      console.log('No active session found');
      return [];
    }

    // Fetch all results
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profile results:', error);
      throw error;
    }

    console.log('Successfully fetched profile results:', data);
    return data || [];
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
    enabled: !!session?.user,
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