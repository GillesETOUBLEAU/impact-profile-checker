-- Create the user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role)
);

-- Enable Row Level Security (RLS) on the user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read their own role
CREATE POLICY "Allow users to read their own role" ON user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create a policy that allows superusers to read all roles
CREATE POLICY "Allow superusers to read all roles" ON user_roles
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant usage on the user_roles table to the authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_roles TO authenticated;

-- Function to assign a role to a user
CREATE OR REPLACE FUNCTION assign_user_role(user_id UUID, role_name TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (user_id, role_name)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION assign_user_role TO authenticated;

-- Function to assign admin role to a user
CREATE OR REPLACE FUNCTION assign_admin_role(user_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM assign_user_role(user_id, 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION assign_admin_role TO authenticated;

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- Trigger function to automatically assign a default role to new users
CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM assign_user_role(NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to assign the default role when a new user is created
DROP TRIGGER IF EXISTS assign_default_role_trigger ON auth.users;
CREATE TRIGGER assign_default_role_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION assign_default_role();

-- Update RLS policy for site_config table to allow admin access
DROP POLICY IF EXISTS "Allow admins to update site_config" ON site_config;
CREATE POLICY "Allow admins to update site_config" ON site_config
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
      )
    );

-- Assign roles to existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    PERFORM assign_user_role(user_record.id, 'user');
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Example: Assign admin role to a specific user (replace 'USER_ID_HERE' with actual UUID)
-- SELECT assign_admin_role('USER_ID_HERE');
