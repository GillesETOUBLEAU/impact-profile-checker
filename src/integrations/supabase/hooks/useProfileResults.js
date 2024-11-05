import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) {
    console.error('Supabase error:', error);
    toast.error(`Error fetching data: ${error.message}`);
    throw error;
  }
  return data;
};

export const useProfileResults = () => useQuery({
  queryKey: ['profile_results'],
  queryFn: async () => {
    console.log('Fetching profile results...');
    return fromSupabase(
      supabase
        .from('impact_profile_tests')
        .select('first_name,selected_profile')
        .order('first_name', { ascending: true })
    );
  }
});

export const useProfileResult = (id) => useQuery({
  queryKey: ['profile_result', id],
  queryFn: () => fromSupabase(
    supabase
      .from('impact_profile_tests')
      .select('first_name,selected_profile')
      .eq('id', id)
      .single()
  ),
  enabled: !!id
});

export const useAddProfileResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newResult) => {
      const { data, error } = await supabase
        .from('impact_profile_tests')
        .insert([newResult])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_results'] });
      toast.success('Profile result saved successfully');
    },
    onError: (error) => {
      console.error('Error saving profile result:', error);
      toast.error('Failed to save profile result');
    }
  });
};

export const useUpdateProfileResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase
        .from('impact_profile_tests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_results'] });
      toast.success('Profile result updated successfully');
    },
    onError: (error) => {
      console.error('Error updating profile result:', error);
      toast.error('Failed to update profile result');
    }
  });
};