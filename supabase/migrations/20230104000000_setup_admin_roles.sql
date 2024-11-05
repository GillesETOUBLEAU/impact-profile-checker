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

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow users to read their own role" ON user_roles;
DROP POLICY IF EXISTS "Allow superusers to read all roles" ON user_roles;

-- Create a simplified policy that allows authenticated users to read roles
CREATE POLICY "Allow authenticated to read roles"
ON user_roles FOR SELECT
TO authenticated
USING (true);

-- Create a policy that allows only service_role to modify roles
CREATE POLICY "Allow service_role to modify roles"
ON user_roles FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

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

-- Drop existing function before recreating
DROP FUNCTION IF EXISTS assign_admin_role(UUID);

-- Function to assign admin role to a user
CREATE OR REPLACE FUNCTION assign_admin_role(user_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM assign_user_role(user_id, 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION assign_admin_role TO authenticated;

-- Drop existing function before recreating
DROP FUNCTION IF EXISTS is_admin(UUID);

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_roles.user_id = $1 AND role = 'admin'
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