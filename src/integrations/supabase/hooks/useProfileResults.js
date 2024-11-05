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
        console.log('useProfileResults - Fetching data...');
        try {
            const { data, error } = await supabase
                .from('impact_profile_tests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase query error:', error);
                throw error;
            }

            console.log('useProfileResults - Fetched data:', data);
            return data || [];
        } catch (error) {
            console.error('useProfileResults - Error:', error);
            throw error;
        }
    }
});

export const useAddProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newProfileResult) => {
            console.log('Adding profile result:', newProfileResult);
            const data = await fromSupabase(
                supabase.from('impact_profile_tests')
                    .insert([newProfileResult])
                    .select()
                    .single()
            );
            console.log('Added data:', data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile_results'] });
            toast.success('Profil enregistré avec succès');
        },
        onError: (error) => {
            console.error('Error adding profile:', error);
            toast.error('Erreur lors de l\'enregistrement du profil');
        }
    });
};

export const useUpdateProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updateData }) => {
            console.log('Updating profile:', id, updateData);
            const data = await fromSupabase(
                supabase.from('impact_profile_tests')
                    .update(updateData)
                    .eq('id', id)
                    .select()
                    .single()
            );
            console.log('Updated data:', data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile_results'] });
            toast.success('Profil mis à jour avec succès');
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
            toast.error('Erreur lors de la mise à jour du profil');
        }
    });
};