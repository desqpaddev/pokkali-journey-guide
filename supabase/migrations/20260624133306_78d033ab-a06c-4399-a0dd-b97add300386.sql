CREATE POLICY "Public read product-media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'product-media');
CREATE POLICY "Auth upload product-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-media');
CREATE POLICY "Auth update product-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-media');
CREATE POLICY "Auth delete product-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-media');