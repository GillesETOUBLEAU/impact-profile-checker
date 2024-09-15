import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useSiteConfig = () => useQuery({
    queryKey: ['site_config'],
    queryFn: async () => {
        console.log('Fetching site config...');
        try {
            const { data, error } = await supabase
                .from('site_config')
                .select('*')
                .limit(1)
                .single();
            
            if (error) {
                console.error('Error fetching site config:', error);
                if (error.code === 'PGRST116') {
                    console.log('No site config found. Creating default config...');
                    const defaultConfig = {
                        header_text: 'Welcome to Impact Profile Checker',
                        footer_text: 'Copyright © 2023 Impact Profile Checker',
                        logo_url: 'https://tqvrsvdphejiwmtgxdvg.supabase.co/storage/v1/object/public/site-assets/default-logo.png'
                    };

                    const { data: newConfig, error: insertError } = await supabase
                        .from('site_config')
                        .insert([defaultConfig])
                        .select()
                        .single();

                    if (insertError) {
                        console.error('Error inserting default config:', insertError);
                        throw new Error(insertError.message);
                    }

                    console.log('Default config created:', newConfig);
                    return newConfig;
                } else {
                    throw new Error(error.message);
                }
            }

            console.log('Site config fetched:', data);
            return data;
        } catch (error) {
            console.error('Unexpected error in useSiteConfig:', error);
            throw error;
        }
    },
});

export const useSiteConfigItem = (id) => useQuery({
    queryKey: ['site_config', id],
    queryFn: () => fromSupabase(supabase.from('site_config').select('*').eq('id', id).single()),
});

export const useAddSiteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newConfig) => fromSupabase(supabase.from('site_config').insert([newConfig])),
        onSuccess: () => {
            queryClient.invalidateQueries('site_config');
        },
    });
};

export const useUpdateSiteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('site_config').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('site_config');
        },
    });
};

export const useDeleteSiteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('site_config').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('site_config');
        },
    });
};
