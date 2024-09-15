-- Create the site_config table
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  header_text TEXT,
  footer_text TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on the site_config table
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Check if the policy already exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to read site_config') THEN
    -- Create a policy that allows all authenticated users to select from the site_config table
    CREATE POLICY "Allow authenticated users to read site_config" ON site_config
        FOR SELECT
        TO authenticated
        USING (true);
  END IF;
END
$$;

-- Check if the policy already exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admins to update site_config') THEN
    -- Create a policy that allows only users with the 'admin' role to update the site_config table
    CREATE POLICY "Allow admins to update site_config" ON site_config
        FOR UPDATE
        TO authenticated
        USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END
$$;

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

-- Create the storage bucket for site assets (this is a placeholder, as it's not standard SQL)
-- You'll need to create this bucket manually in the Supabase dashboard or using their API
-- CREATE BUCKET site_assets;

-- Set up storage permissions (this is also not standard SQL and would be done in the Supabase dashboard)
-- GRANT READ ON BUCKET site_assets TO public;
-- GRANT ALL ON BUCKET site_assets TO authenticated;
