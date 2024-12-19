-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON impact_profile_tests;
DROP POLICY IF EXISTS "Enable insert access for all users" ON impact_profile_tests;
DROP POLICY IF EXISTS "Enable update access for all users" ON impact_profile_tests;

-- Create a single, simple policy that allows all operations
CREATE POLICY "Allow all operations for everyone" ON impact_profile_tests
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled but the policy allows access
ALTER TABLE impact_profile_tests ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON impact_profile_tests TO anon;
GRANT ALL ON impact_profile_tests TO authenticated;
GRANT ALL ON impact_profile_tests TO service_role;