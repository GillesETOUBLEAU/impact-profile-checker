import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from 'sonner';

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
                .select('*');
            
            if (error) {
                console.error('Error fetching site config:', error);
                if (error.code === 'PGRST301') {
                    toast.error('Accès non autorisé à la configuration du site. Veuillez vérifier vos permissions.');
                    return null;
                }
                toast.error('Erreur lors de la récupération de la configuration du site.');
                throw error;
            }

            if (!data || data.length === 0) {
                console.log('No site config found. Using default config...');
                return {
                    header_text: 'Welcome to Impact Profile Checker',
                    footer_text: 'Copyright © 2023 Impact Profile Checker',
                    logo_url: 'https://tqvrsvdphejiwmtgxdvg.supabase.co/storage/v1/object/public/site-assets/default-logo.png'
                };
            }

            console.log('Site config fetched:', data[0]);
            return data[0]; // Return the first config object
        } catch (error) {
            console.error('Unexpected error in useSiteConfig:', error);
            toast.error('Une erreur inattendue est survenue lors de la récupération de la configuration.');
            return null;
        }
    },
    retry: 1,
    retryDelay: 1000,
    onError: (error) => {
        console.error('Error in useSiteConfig query:', error);
        toast.error('Erreur de connexion à la base de données. Veuillez réessayer plus tard.');
    }
});

export const useUpdateSiteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updateData) => {
            const { data, error } = await supabase
                .from('site_config')
                .update(updateData)
                .eq('id', updateData.id)
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST301') {
                    throw new Error('Accès non autorisé pour mettre à jour la configuration du site.');
                }
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries('site_config');
            toast.success('Configuration du site mise à jour avec succès.');
        },
        onError: (error) => {
            console.error('Error updating site config:', error);
            toast.error(`Erreur lors de la mise à jour de la configuration du site: ${error.message}`);
        }
    });
};

export const useDeleteSiteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data, error } = await supabase
                .from('site_config')
                .delete()
                .eq('id', id);

            if (error) {
                if (error.code === 'PGRST301') {
                    throw new Error('Accès non autorisé pour supprimer la configuration du site.');
                }
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries('site_config');
            toast.success('Configuration du site supprimée avec succès.');
        },
        onError: (error) => {
            console.error('Error deleting site config:', error);
            toast.error(`Erreur lors de la suppression de la configuration du site: ${error.message}`);
        }
    });
};
