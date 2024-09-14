import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### impact_profile_tests

| name             | type                    | format                 | required |
|------------------|-------------------------|------------------------|----------|
| id               | uuid                    | uuid                   | true     |
| first_name       | text                    | string                 | true     |
| last_name        | text                    | string                 | true     |
| email            | text                    | string                 | true     |
| question_1       | integer                 | integer                | true     |
| question_2       | integer                 | integer                | true     |
| question_3       | integer                 | integer                | true     |
| question_4       | integer                 | integer                | true     |
| question_5       | integer                 | integer                | true     |
| question_6       | integer                 | integer                | true     |
| question_7       | integer                 | integer                | true     |
| question_8       | integer                 | integer                | true     |
| question_9       | integer                 | integer                | true     |
| question_10      | integer                 | integer                | true     |
| humanist_score   | numeric                 | number                 | true     |
| innovative_score | numeric                 | number                 | true     |
| eco_guide_score  | numeric                 | number                 | true     |
| curious_score    | numeric                 | number                 | true     |
| profiles         | text[]                  | array of strings       | true     |
| created_at       | timestamp with time zone| string                 | false    |

Foreign Key Relationships:
- None identified
*/

export const useImpactProfileTests = () => useQuery({
    queryKey: ['impact_profile_tests'],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*')),
});

export const useImpactProfileTest = (id) => useQuery({
    queryKey: ['impact_profile_tests', id],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').eq('id', id).single()),
});

export const useAddImpactProfileTest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTest) => fromSupabase(supabase.from('impact_profile_tests').insert([newTest])),
        onSuccess: () => {
            queryClient.invalidateQueries('impact_profile_tests');
        },
    });
};

export const useUpdateImpactProfileTest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('impact_profile_tests').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('impact_profile_tests');
        },
    });
};

export const useDeleteImpactProfileTest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('impact_profile_tests').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('impact_profile_tests');
        },
    });
};