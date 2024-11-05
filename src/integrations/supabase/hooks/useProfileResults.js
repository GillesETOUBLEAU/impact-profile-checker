import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useProfileResult = (id) => useQuery({
    queryKey: ['profile_results', id],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').eq('id', id).single()),
});

export const useProfileResults = () => useQuery({
    queryKey: ['profile_results'],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').order('created_at', { ascending: false })),
});

export const useAddProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProfileResult) => fromSupabase(supabase.from('impact_profile_tests').insert([newProfileResult])),
        onSuccess: () => {
            queryClient.invalidateQueries('profile_results');
        },
    });
};

export const useUpdateProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('impact_profile_tests').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profile_results');
        },
    });
};

export const useDeleteProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('impact_profile_tests').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profile_results');
        },
    });
};