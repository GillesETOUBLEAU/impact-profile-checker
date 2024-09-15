import { supabase } from '../lib/supabase';

export const assignUserRole = async (userId, role) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role: role }]);

    if (error) throw error;

    console.log('Role assigned successfully:', data);
    return data;
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
};

export const checkAdminRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found');
      return false;
    }

    console.log('Checking admin role for user:', user.id);

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
