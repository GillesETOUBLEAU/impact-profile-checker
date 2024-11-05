-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create the users table
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role)
);

-- Create the site_config table
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  header_text TEXT,
  footer_text TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the impact_profile_tests table
CREATE TABLE IF NOT EXISTS public.impact_profile_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create the profile_results table
CREATE TABLE IF NOT EXISTS public.profile_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_profile_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles table
CREATE POLICY "Users can read their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow admins to manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create policies for site_config table
CREATE POLICY "Allow public read access to site_config"
ON public.site_config FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admins to manage site_config"
ON public.site_config FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create policies for impact_profile_tests table
CREATE POLICY "Allow authenticated users to insert impact_profile_tests"
ON public.impact_profile_tests FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read impact_profile_tests"
ON public.impact_profile_tests FOR SELECT
TO authenticated
USING (true);

-- Create policies for profile_results table
CREATE POLICY "Users can read their own results"
ON public.profile_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own results"
ON public.profile_results FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create admin functions
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign admin role
CREATE OR REPLACE FUNCTION public.assign_admin_role(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Insert default site config if none exists
INSERT INTO site_config (header_text, footer_text, logo_url)
SELECT 
  'Welcome to Impact Profile Checker', 
  'Copyright © 2024 Impact Profile Checker',
  'https://tqvrsvdphejiwmtgxdvg.supabase.co/storage/v1/object/public/site-assets/default-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM site_config);