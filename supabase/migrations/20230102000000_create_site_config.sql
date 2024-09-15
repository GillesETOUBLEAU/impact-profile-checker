-- Create the site_config table
create table if not exists
  site_config (
    id uuid default uuid_generate_v4 () primary key,
    header_text text,
    footer_text text,
    logo_url text,
    updated_at timestamp with time zone default current_timestamp
  );

-- Enable Row Level Security (RLS) on the site_config table
alter table site_config enable row level security;

-- Check if the policy already exists before creating it
do $$
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
do $$
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
grant usage on schema public to authenticated;

grant all on site_config to authenticated;

-- Create an admin role if it doesn't exist
do $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin;
  END IF;
END
$$;

-- Insert a default row if the table is empty
insert into
  site_config (header_text, footer_text, logo_url)
select
  'Welcome to Impact Profile Checker',
  'Copyright © 2023 Impact Profile Checker',
  'https://tqvrsvdphejiwmtgxdvg.supabase.co/storage/v1/object/public/site-assets/default-logo.png'
where
  not exists (
    select
      1
    from
      site_config
  );

-- Create the storage bucket for site assets (this is a placeholder, as it's not standard SQL)
-- You'll need to create this bucket manually in the Supabase dashboard or using their API
-- CREATE BUCKET site_assets;

-- Set up storage permissions (this is also not standard SQL and would be done in the Supabase dashboard)
-- GRANT READ ON BUCKET site_assets TO public;
-- GRANT ALL ON BUCKET site_assets TO authenticated;
