-- Create the site_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  header_text TEXT,
  footer_text TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on the site_config table
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read site_config" ON site_config;
DROP POLICY IF EXISTS "Allow admins to update site_config" ON site_config;

-- Create a policy that allows all authenticated users to select from the site_config table
CREATE POLICY "Allow authenticated users to read site_config" ON site_config
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a policy that allows only users with the 'admin' role to update the site_config table
CREATE POLICY "Allow admins to update site_config" ON site_config
    FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

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

-- Insert a default row if the table is empty
INSERT INTO site_config (header_text, footer_text, logo_url)
SELECT 
  'Welcome to Impact Profile Checker', 
  'Copyright © 2023 Impact Profile Checker',
  'https://tqvrsvdphejiwmtgxdvg.supabase.co/storage/v1/object/public/site-assets/default-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM site_config);

-- Update the updated_at column to use CURRENT_TIMESTAMP as default
ALTER TABLE site_config ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
