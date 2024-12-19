-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read impact_profile_tests" ON impact_profile_tests;
DROP POLICY IF EXISTS "Allow authenticated users to insert impact_profile_tests" ON impact_profile_tests;
DROP POLICY IF EXISTS "Allow authenticated users to update impact_profile_tests" ON impact_profile_tests;

-- Create new policies that allow public access
CREATE POLICY "Allow public read access to impact_profile_tests"
ON impact_profile_tests FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access to impact_profile_tests"
ON impact_profile_tests FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access to impact_profile_tests"
ON impact_profile_tests FOR UPDATE
TO public
USING (true)
WITH CHECK (true);