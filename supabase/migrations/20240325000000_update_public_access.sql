-- Drop existing policies
DROP POLICY IF EXISTS "Allow anyone to read impact_profile_tests" ON public.impact_profile_tests;
DROP POLICY IF EXISTS "Allow anyone to insert impact_profile_tests" ON public.impact_profile_tests;

-- Enable RLS
ALTER TABLE public.impact_profile_tests ENABLE ROW LEVEL SECURITY;

-- Create new public access policies
CREATE POLICY "Allow anyone to read impact_profile_tests"
ON public.impact_profile_tests
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow anyone to insert impact_profile_tests"
ON public.impact_profile_tests
FOR INSERT
TO public
WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.impact_profile_tests TO anon;