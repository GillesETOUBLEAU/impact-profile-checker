import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw error;
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
        mutationFn: (newTest) => fromSupabase(supabase.from('impact_profile_tests').insert([newTest]).select().single()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['impact_profile_tests'] });
        },
    });
};

export const useUpdateImpactProfileTest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('impact_profile_tests').update(updateData).eq('id', id).select().single()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['impact_profile_tests'] });
        },
    });
};