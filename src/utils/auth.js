import { supabase } from '../lib/supabase';

export const checkAdminRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    console.log('User role data:', data);
    return data && data.role === 'admin';
  } catch (error) {
    console.error('Unexpected error checking admin role:', error);
    return false;
  }
};
