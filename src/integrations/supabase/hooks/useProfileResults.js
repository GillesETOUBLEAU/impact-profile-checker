import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  console.log('Fetching profile results...'); // Debug log
  
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

    console.log('Raw Supabase response:', { data, error }); // Additional debug log

    if (!data) {
      console.log('No data returned from Supabase');
      return [];
    }

    console.log('Fetched profile results:', data); // Debug log
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
    initialData: [],
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Query error:', error);
      toast.error('Error loading results');
    }
  });
};