import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### site_config

| name        | type   | format                 | required |
|-------------|--------|------------------------|----------|
| id          | string | uuid                   | true     |
| header_text | string | text                   | false    |
| footer_text | string | text                   | false    |
| logo_url    | string | text                   | false    |
| updated_at  | string | timestamp with time zone | false    |

Foreign Key Relationships:
- None identified
*/

export const useSiteConfig = (id) => useQuery({
    queryKey: ['site_config', id],
    queryFn: () => fromSupabase(supabase.from('site_config').select('*').eq('id', id).single()),
});

export const useSiteConfigs = () => useQuery({
    queryKey: ['site_configs'],
    queryFn: () => fromSupabase(supabase.from('site_config').select('*')),
});

export const useAddSiteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSiteConfig) => fromSupabase(supabase.from('site_config').insert([newSiteConfig])),
        onSuccess: () => {
            queryClient.invalidateQueries('site_configs');
        },
    });
};

export const useUpdateSiteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('site_config').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('site_configs');
        },
    });
};

export const useDeleteSiteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('site_config').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('site_configs');
        },
    });
};
