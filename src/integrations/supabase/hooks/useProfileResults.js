import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fetchProfileResults = async () => {
  console.log('Fetching profile results...'); // Debug log
  
  try {
    // First, let's check if we can connect to Supabase and get table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('impact_profile_tests')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('Table access error:', tableError);
      throw new Error(`Table access error: ${tableError.message}`);
    }

    console.log('Table access successful:', tableInfo);

    // Now fetch the actual data with detailed logging
    const { data, error, status } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Query execution details:', { 
      status,
      hasData: !!data,
      dataLength: data?.length,
      error
    });

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