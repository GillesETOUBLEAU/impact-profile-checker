import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw error;
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
| selected_profile | string  | text                   | false    |
| created_at       | string  | timestamp with time zone | false    |

Foreign Key Relationships:
- None identified
*/

export const useProfileResult = (id) => useQuery({
    queryKey: ['profile_results', id],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').eq('id', id).single()),
    enabled: !!id
});

export const useProfileResults = () => useQuery({
    queryKey: ['profile_results'],
    queryFn: () => fromSupabase(supabase.from('impact_profile_tests').select('*').order('created_at', { ascending: false }))
});

export const useAddProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProfileResult) => fromSupabase(supabase.from('impact_profile_tests').insert([newProfileResult]).select().single()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile_results'] });
        },
    });
};

export const useUpdateProfileResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('impact_profile_tests').update(updateData).eq('id', id).select().single()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile_results'] });
        },
    });
};