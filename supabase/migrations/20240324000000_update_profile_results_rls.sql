-- Drop existing policies for profile_results if any exist
DROP POLICY IF EXISTS "Users can create their own results" ON public.profile_results;
DROP POLICY IF EXISTS "Users can read their own results" ON public.profile_results;

-- Enable RLS on profile_results table if not already enabled
ALTER TABLE public.profile_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert their own results
CREATE POLICY "Users can insert their own results"
ON public.profile_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create policy to allow authenticated users to read their own results
CREATE POLICY "Users can read their own results"
ON public.profile_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policy to allow public read access to anonymous results
CREATE POLICY "Allow public read access to anonymous results"
ON public.profile_results
FOR SELECT
TO anon
USING (user_id IS NULL);