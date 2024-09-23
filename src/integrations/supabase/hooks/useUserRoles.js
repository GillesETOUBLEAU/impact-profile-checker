import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### user_roles

| name       | type   | format                 | required |
|------------|--------|------------------------|----------|
| id         | string | uuid                   | true     |
| user_id    | string | uuid                   | true     |
| role       | string | text                   | true     |
| created_at | string | timestamp with time zone | false    |

Foreign Key Relationships:
- None identified
*/

export const useUserRole = (id) => useQuery({
    queryKey: ['user_roles', id],
    queryFn: () => fromSupabase(supabase.from('user_roles').select('*').eq('id', id).single()),
});

export const useUserRoles = () => useQuery({
    queryKey: ['user_roles'],
    queryFn: () => fromSupabase(supabase.from('user_roles').select('*')),
});

export const useAddUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUserRole) => fromSupabase(supabase.from('user_roles').insert([newUserRole])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_roles');
        },
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_roles').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_roles');
        },
    });
};

export const useDeleteUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_roles').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_roles');
        },
    });
};