CREATE TABLE impact_profile_tests (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the email column for faster lookups
CREATE INDEX impact_profile_tests_email_idx ON impact_profile_tests (email);