import { supabase } from '../lib/supabase';

export const checkAdminRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    // Check if any row was returned and if the role is 'admin'
    return data && data.length > 0 && data[0].role === 'admin';
  } catch (error) {
    console.error('Unexpected error checking admin role:', error);
    return false;
  }
};
