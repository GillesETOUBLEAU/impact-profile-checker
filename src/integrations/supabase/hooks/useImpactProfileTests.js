import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) {
        console.error('Supabase error:', error);
        toast.error(`Database error: ${error.message}`);
        throw error;
    }
    return data;
};

export const useImpactProfileTest = (id) => useQuery({
    queryKey: ['impact_profile_tests', id],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').eq('id', id).single()),
    enabled: !!id
});

export const useImpactProfileTests = () => useQuery({
    queryKey: ['impact_profile_tests'],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').order('created_at', { ascending: false }))
});

export const useAddImpactProfileTest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTest) => {
            console.log('Saving test data:', newTest);
            const result = await fromSupabase(
                supabase.from('impact_profile_tests')
                .insert([newTest])
                .select()
                .single()
            );
            toast.success('Test results saved successfully!');
            return result;
        },
        onError: (error) => {
            console.error('Error saving test:', error);
            toast.error('Failed to save test results');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['impact_profile_tests'] });
            queryClient.invalidateQueries({ queryKey: ['profile_results'] });
        },
    });
};

export const useUpdateImpactProfileTest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updateData }) => {
            console.log('Updating test data:', { id, ...updateData });
            const result = await fromSupabase(
                supabase.from('impact_profile_tests')
                .update(updateData)
                .eq('id', id)
                .select()
                .single()
            );
            toast.success('Profile selection saved!');
            return result;
        },
        onError: (error) => {
            console.error('Error updating test:', error);
            toast.error('Failed to update test');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['impact_profile_tests'] });
            queryClient.invalidateQueries({ queryKey: ['profile_results'] });
        },
    });
};