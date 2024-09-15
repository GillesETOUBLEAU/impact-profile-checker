-- Enable Row Level Security (RLS) on the site_config table
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to select from the site_config table
CREATE POLICY "Allow authenticated users to read site_config" ON site_config
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a policy that allows only authenticated users with the 'admin' role to insert, update, or delete from the site_config table
CREATE POLICY "Allow admins to modify site_config" ON site_config
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Grant usage on the site_config table to the authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON site_config TO authenticated;

-- Create an admin role if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin;
  END IF;
END
$$;

-- Grant the admin role to the 'authenticated' role
GRANT admin TO authenticated;