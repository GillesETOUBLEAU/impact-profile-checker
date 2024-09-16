-- Enable Row Level Security (RLS) for the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a policy to allow admins to insert objects into the site-assets bucket
CREATE POLICY "Allow admins to upload to site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-assets' AND
  public.is_admin()
);

-- Create a policy to allow authenticated users to select objects from the site-assets bucket
CREATE POLICY "Allow authenticated users to view site-assets"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'site-assets');

-- Create a policy to allow admins to update objects in the site-assets bucket
CREATE POLICY "Allow admins to update site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets' AND public.is_admin());

-- Create a policy to allow admins to delete objects from the site-assets bucket
CREATE POLICY "Allow admins to delete from site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets' AND public.is_admin());

-- Grant usage on the storage schema to authenticated users
GRANT USAGE ON SCHEMA storage TO authenticated;

-- Grant all privileges on the site-assets bucket to authenticated users
GRANT ALL ON storage.objects TO authenticated;
