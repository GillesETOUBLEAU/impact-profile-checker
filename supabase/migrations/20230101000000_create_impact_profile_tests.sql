-- Create the impact_profile_tests table
CREATE TABLE IF NOT EXISTS impact_profile_tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  question_1 INTEGER NOT NULL,
  question_2 INTEGER NOT NULL,
  question_3 INTEGER NOT NULL,
  question_4 INTEGER NOT NULL,
  question_5 INTEGER NOT NULL,
  question_6 INTEGER NOT NULL,
  question_7 INTEGER NOT NULL,
  question_8 INTEGER NOT NULL,
  question_9 INTEGER NOT NULL,
  question_10 INTEGER NOT NULL,
  humanist_score NUMERIC(3,2) NOT NULL,
  innovative_score NUMERIC(3,2) NOT NULL,
  eco_guide_score NUMERIC(3,2) NOT NULL,
  curious_score NUMERIC(3,2) NOT NULL,
  profiles TEXT[] NOT NULL,
  selected_profile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the email column for faster lookups
CREATE INDEX IF NOT EXISTS impact_profile_tests_email_idx ON impact_profile_tests (email);

-- Add a comment to the selected_profile column
COMMENT ON COLUMN impact_profile_tests.selected_profile IS 'The profile chosen by the user from the available profiles';

-- Enable Row Level Security (RLS) on the impact_profile_tests table
ALTER TABLE impact_profile_tests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to insert records
CREATE POLICY "Allow authenticated users to insert impact_profile_tests" ON impact_profile_tests
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create a policy that allows authenticated users to select all records
CREATE POLICY "Allow authenticated users to read impact_profile_tests" ON impact_profile_tests
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a policy that allows authenticated users to update records
CREATE POLICY "Allow authenticated users to update impact_profile_tests" ON impact_profile_tests
    FOR UPDATE
    TO authenticated
    USING (true);

-- Grant usage on the impact_profile_tests table to the authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON impact_profile_tests TO authenticated;
