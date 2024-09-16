-- Enable Row Level Security (RLS) for the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to insert objects into the site-assets bucket
CREATE POLICY "Allow authenticated users to upload to site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-assets' AND
  auth.role() = 'authenticated'
);

-- Create a policy to allow authenticated users to select objects from the site-assets bucket
CREATE POLICY "Allow authenticated users to view site-assets"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'site-assets');

-- Create a policy to allow authenticated users to update objects in the site-assets bucket
CREATE POLICY "Allow authenticated users to update site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets');

-- Create a policy to allow authenticated users to delete objects from the site-assets bucket
CREATE POLICY "Allow authenticated users to delete from site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets');