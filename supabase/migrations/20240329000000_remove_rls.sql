-- Disable RLS on impact_profile_tests table
ALTER TABLE impact_profile_tests DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON impact_profile_tests;
DROP POLICY IF EXISTS "Enable insert access for all users" ON impact_profile_tests;
DROP POLICY IF EXISTS "Enable update access for all users" ON impact_profile_tests;
DROP POLICY IF EXISTS "Allow public read access to impact_profile_tests" ON impact_profile_tests;
DROP POLICY IF EXISTS "Allow anyone to read impact_profile_tests" ON impact_profile_tests;
DROP POLICY IF EXISTS "Allow anyone to insert impact_profile_tests" ON impact_profile_tests;
DROP POLICY IF EXISTS "Allow anyone to update their own impact_profile_tests" ON impact_profile_tests;

-- Grant full access to public role
GRANT ALL ON impact_profile_tests TO anon;
GRANT ALL ON impact_profile_tests TO authenticated;
GRANT ALL ON impact_profile_tests TO service_role;

-- Ensure sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;