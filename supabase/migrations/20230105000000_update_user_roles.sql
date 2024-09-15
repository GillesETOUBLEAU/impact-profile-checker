-- Add a unique constraint to the user_id column in the user_roles table
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);

-- Function to assign a default role to a user
CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'admin')  -- Changed from 'user' to 'admin'
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to assign the default role when a new user is created
DROP TRIGGER IF EXISTS assign_default_role_trigger ON auth.users;
CREATE TRIGGER assign_default_role_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION assign_default_role();

-- Populate user_roles for existing users
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'  -- Changed from 'user' to 'admin'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT (user_id) DO NOTHING;

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
