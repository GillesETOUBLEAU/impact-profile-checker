import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  console.log('Starting to fetch profile results...');
  
  try {
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