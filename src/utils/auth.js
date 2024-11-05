import { supabase } from '../lib/supabase';

export const checkAdminRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Auth check - Current user:', user); // Debug log

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
      console.error('Error fetching user role:', error);
      return false;
    }

    console.log('User role data:', data);
    
    // Add more specific logging
    if (!data) {
      console.log('No role found for user');
      return false;
    }

    const isAdmin = data.role === 'admin';
    console.log('Is user admin?', isAdmin);
    
    return isAdmin;
  } catch (error) {
    console.error('Error in checkAdminRole:', error);
    return false;
  }
};