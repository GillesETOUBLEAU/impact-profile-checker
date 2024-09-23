import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### impact_profile_tests

| name             | type    | format                 | required |
|------------------|---------|------------------------|----------|
| id               | string  | uuid                   | true     |
| first_name       | string  | text                   | true     |
| last_name        | string  | text                   | true     |
| email            | string  | text                   | true     |
| question_1       | integer | integer                | true     |
| question_2       | integer | integer                | true     |
| question_3       | integer | integer                | true     |
| question_4       | integer | integer                | true     |
| question_5       | integer | integer                | true     |
| question_6       | integer | integer                | true     |
| question_7       | integer | integer                | true     |
| question_8       | integer | integer                | true     |
| question_9       | integer | integer                | true     |
| question_10      | integer | integer                | true     |
| humanist_score   | number  | numeric                | true     |
| innovative_score | number  | numeric                | true     |
| eco_guide_score  | number  | numeric                | true     |
| curious_score    | number  | numeric                | true     |
| profiles         | array   | text[]                 | true     |
| created_at       | string  | timestamp with time zone | false    |
| selected_profile | string  | text                   | false    |

Foreign Key Relationships:
- None identified
*/

export const useImpactProfileTest = (id) => useQuery({
    queryKey: ['impact_profile_tests', id],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').eq('id', id).single()),
});

export const useImpactProfileTests = () => useQuery({
    queryKey: ['impact_profile_tests'],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*')),
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
