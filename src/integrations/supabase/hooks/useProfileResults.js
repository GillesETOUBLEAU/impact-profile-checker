import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  console.log('Starting to fetch profile results...');
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session state:', session ? 'Authenticated' : 'Not authenticated');
    console.log('Session details:', session); // Add more detailed session logging

    if (!session) {
      console.log('No active session found');
      return [];
    }

    // First, test if we can access the table at all
    const { count, error: countError } = await supabase
      .from('impact_profile_tests')
      .select('*', { count: 'exact', head: true });

    console.log('Table access test:', { count, error: countError });

    if (countError) {
      console.error('Error accessing table:', countError);
      toast.error(`Database access error: ${countError.message}`);
      throw countError;
    }

    // Now fetch the actual data
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profile results:', error);
      toast.error(`Failed to load profile results: ${error.message}`);
      throw error;
    }

    console.log('Profile results data:', data);
    return data || [];
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
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
};