-- Enable RLS on question_papers table
ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert their own uploads
CREATE POLICY "Allow authenticated users to insert their own uploads" 
ON question_papers 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = uploader_id);

-- Policy: Allow users to view approved papers and their own uploads
CREATE POLICY "Allow users to view approved papers and their own uploads" 
ON question_papers 
FOR SELECT 
TO authenticated 
USING (approved = true OR auth.uid() = uploader_id);

-- Policy: Allow users to update only their own uploads (optional)
CREATE POLICY "Allow users to update their own uploads" 
ON question_papers 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = uploader_id) 
WITH CHECK (auth.uid() = uploader_id);

-- Policy: Allow users to delete only their own uploads (optional)
CREATE POLICY "Allow users to delete their own uploads" 
ON question_papers 
FOR DELETE 
TO authenticated 
USING (auth.uid() = uploader_id);
