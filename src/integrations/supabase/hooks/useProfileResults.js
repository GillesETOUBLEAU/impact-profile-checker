import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';
import { useSupabaseAuth } from '../auth';

const fetchProfileResults = async () => {
  console.log('Fetching profile results...'); // Debug log
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session found');
      return [];
    }

    console.log('Fetching with session:', session.user.id); // Debug log
    
    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      toast.error(`Error fetching data: ${error.message}`);
      throw error;
    }

    console.log('Fetched data:', data); // Debug log

    if (!data) {
      console.log('No data returned from Supabase');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    toast.error('Failed to fetch results');
    throw error;
  }
};

export const useProfileResults = () => {
  const { session } = useSupabaseAuth();

  return useQuery({
    queryKey: ['profile_results', session?.user?.id],
    queryFn: fetchProfileResults,
    enabled: !!session?.user?.id,
    initialData: [],
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Query error:', error);
      toast.error('Error loading results');
    }
  });
};