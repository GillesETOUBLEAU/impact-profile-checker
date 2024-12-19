-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to impact_profile_tests" ON impact_profile_tests;
DROP POLICY IF EXISTS "Allow public insert access to impact_profile_tests" ON impact_profile_tests;
DROP POLICY IF EXISTS "Allow public update access to impact_profile_tests" ON impact_profile_tests;

-- Create new policies with no restrictions
CREATE POLICY "Enable read access for all users"
ON impact_profile_tests FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert access for all users"
ON impact_profile_tests FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON impact_profile_tests FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled but policies allow access
ALTER TABLE impact_profile_tests ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON impact_profile_tests TO anon;
GRANT ALL ON impact_profile_tests TO authenticated;
GRANT ALL ON impact_profile_tests TO service_role;