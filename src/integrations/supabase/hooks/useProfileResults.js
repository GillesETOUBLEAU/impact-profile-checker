import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### profile_results

| name         | type   | format | required |
|--------------|--------|--------|----------|
| id           | string | uuid   | true     |
| user_id      | string | uuid   | false    |
| profile_type | string | text   | false    |

Foreign Key Relationships:
- user_id references profiles.id
*/

export const useProfileResult = (id) => useQuery({
    queryKey: ['profile_results', id],
    queryFn: () => fromSupabase(supabase.from('profile_results').select('*').eq('id', id).single()),
});

export const useProfileResults = () => useQuery({
    queryKey: ['profile_results'],
    queryFn: () => fromSupabase(supabase.from('profile_results').select('*')),
});

export const useAddProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProfileResult) => fromSupabase(supabase.from('profile_results').insert([newProfileResult])),
        onSuccess: () => {
            queryClient.invalidateQueries('profile_results');
        },
    });
};

export const useUpdateProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('profile_results').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profile_results');
        },
    });
};

export const useDeleteProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('profile_results').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profile_results');
        },
    });
};