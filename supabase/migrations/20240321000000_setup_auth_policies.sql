-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_profile_tests ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles table
CREATE POLICY "Allow users to read their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow admins to manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create policies for site_config table
CREATE POLICY "Allow public read access to site_config"
ON public.site_config
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow admins to manage site_config"
ON public.site_config
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create policies for impact_profile_tests table
CREATE POLICY "Allow public read access to impact_profile_tests"
ON public.impact_profile_tests
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow admins to manage impact_profile_tests"
ON public.impact_profile_tests
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing function before recreating it
DROP FUNCTION IF EXISTS public.assign_admin_role(uuid);

-- Function to assign admin role to a user
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

-- Insert a default admin user directly into user_roles
DO $$
BEGIN
  -- Insert a default admin role
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'
  FROM auth.users
  WHERE email = 'admin@example.com'
  ON CONFLICT (user_id, role) DO NOTHING;
END
$$;