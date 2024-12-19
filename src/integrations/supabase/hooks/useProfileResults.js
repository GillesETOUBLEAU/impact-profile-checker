import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  console.log('Fetching profile results...'); // Debug log
  
  try {
    // First, let's check if the table exists and count records
    const { count, error: countError } = await supabase
      .from('impact_profile_tests')
      .select('*', { count: 'exact', head: true });

    console.log('Table count check:', { count, error: countError }); // Debug log

    if (countError) {
      console.error('Count error:', countError);
      toast.error(`Error checking table: ${countError.message}`);
      throw countError;
    }

    // Now fetch the actual data
    const { data, error, status } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Query details:', { 
      status,
      hasData: !!data,
      dataLength: data?.length,
      error,
      sqlQuery: error?.query, // Log the SQL query if there's an error
      hint: error?.hint,
      details: error?.details
    }); // Debug log

    if (error) {
      console.error('Supabase error:', error);
      toast.error(`Error fetching data: ${error.message}`);
      throw error;
    }

    if (!data) {
      console.log('No data returned from Supabase');
      return [];
    }

    console.log('Successfully fetched data:', data); // Debug log
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
    initialData: [],
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Query error:', error);
      toast.error('Error loading results');
    }
  });
};