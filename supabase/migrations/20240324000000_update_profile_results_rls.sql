-- Drop existing policies for profile_results if any exist
DROP POLICY IF EXISTS "Users can create their own results" ON public.profile_results;
DROP POLICY IF EXISTS "Users can read their own results" ON public.profile_results;
DROP POLICY IF EXISTS "Allow public read access to anonymous results" ON public.profile_results;
DROP POLICY IF EXISTS "Users can insert their own results" ON public.profile_results;

-- Enable RLS on profile_results table if not already enabled
ALTER TABLE public.profile_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert results
CREATE POLICY "Allow anyone to insert results"
ON public.profile_results
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow anyone to read results
CREATE POLICY "Allow anyone to read results"
ON public.profile_results
FOR SELECT
TO public
USING (true);