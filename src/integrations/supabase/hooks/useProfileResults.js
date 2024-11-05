import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    return data;
};

export const useProfileResult = (id) => useQuery({
    queryKey: ['profile_results', id],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').eq('id', id).single()),
    enabled: !!id
});

export const useProfileResults = () => useQuery({
    queryKey: ['profile_results'],
    queryFn: async () => {
        try {
            const { data, error } = await supabase
                .from('impact_profile_tests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching profile results:', error);
            throw error;
        }
    }
});

export const useAddProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newProfileResult) => {
            const data = await fromSupabase(
                supabase.from('impact_profile_tests')
                    .insert([newProfileResult])
                    .select()
                    .single()
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile_results'] });
            toast.success('Profile saved successfully');
        },
        onError: (error) => {
            console.error('Error adding profile:', error);
            toast.error('Error saving profile');
        }
    });
};

export const useUpdateProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updateData }) => {
            const data = await fromSupabase(
                supabase.from('impact_profile_tests')
                    .update(updateData)
                    .eq('id', id)
                    .select()
                    .single()
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile_results'] });
            toast.success('Profile updated successfully');
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        }
    });
};