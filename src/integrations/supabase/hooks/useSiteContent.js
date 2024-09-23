import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### site_content

| name     | type    | format | required |
|----------|---------|--------|----------|
| id       | integer | bigint | true     |
| header   | string  | text   | false    |
| footer   | string  | text   | false    |
| logo_url | string  | text   | false    |

Foreign Key Relationships:
- None identified
*/

export const useSiteContent = (id) => useQuery({
    queryKey: ['site_content', id],
    queryFn: () => fromSupabase(supabase.from('site_content').select('*').eq('id', id).single()),
});

export const useSiteContents = () => useQuery({
    queryKey: ['site_contents'],
    queryFn: () => fromSupabase(supabase.from('site_content').select('*')),
});

export const useAddSiteContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSiteContent) => fromSupabase(supabase.from('site_content').insert([newSiteContent])),
        onSuccess: () => {
            queryClient.invalidateQueries('site_contents');
        },
    });
};

export const useUpdateSiteContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('site_content').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('site_contents');
        },
    });
};

export const useDeleteSiteContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('site_content').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('site_contents');
        },
    });
};