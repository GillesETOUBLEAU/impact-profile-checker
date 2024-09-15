-- Create the user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role)
);

-- Enable Row Level Security (RLS) on the user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows only superusers to insert into the user_roles table
CREATE POLICY "Allow superusers to insert user_roles" ON user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy that allows only superusers to update the user_roles table
CREATE POLICY "Allow superusers to update user_roles" ON user_roles
    FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

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

-- Function to assign admin role to a user
CREATE OR REPLACE FUNCTION assign_admin_role(user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION assign_admin_role TO authenticated;

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

-- Example: Assign admin role to a specific user (replace 'USER_ID_HERE' with actual UUID)
-- SELECT assign_admin_role('USER_ID_HERE');