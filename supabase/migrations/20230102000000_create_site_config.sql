-- Create the site_config table
CREATE TABLE site_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  header_text TEXT,
  footer_text TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default row
INSERT INTO site_config (header_text, footer_text) 
VALUES ('Welcome to Impact Profile Checker', 'Copyright © 2023 Impact Profile Checker');

-- Create the storage bucket for site assets
-- Note: This part is commented out because it's not standard SQL.
-- You'll need to create this bucket manually in the Supabase dashboard or using their API.
-- CREATE BUCKET site_assets;

-- Set up storage permissions (this is also not standard SQL and would be done in the Supabase dashboard)
-- GRANT READ ON BUCKET site_assets TO public;
-- GRANT ALL ON BUCKET site_assets TO authenticated;