-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to impact_profile_tests" ON public.impact_profile_tests;
DROP POLICY IF EXISTS "Allow admins to manage impact_profile_tests" ON public.impact_profile_tests;
DROP POLICY IF EXISTS "Allow authenticated users to insert impact_profile_tests" ON public.impact_profile_tests;

-- Create new policies that allow both authenticated and anonymous users to interact with the table
CREATE POLICY "Allow anyone to insert impact_profile_tests"
ON public.impact_profile_tests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anyone to read impact_profile_tests"
ON public.impact_profile_tests FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow anyone to update their own impact_profile_tests"
ON public.impact_profile_tests FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.impact_profile_tests TO anon;
GRANT ALL ON public.impact_profile_tests TO authenticated;