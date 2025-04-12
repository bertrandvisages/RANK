/*
  # Configure profiles table security policies

  1. Security
    - Enable RLS on profiles table if not already enabled
    - Drop all existing policies to avoid conflicts
    - Create new policies for:
      - Insert: Allow authenticated users to create profiles
      - Select: Make profiles publicly readable
      - Update: Allow users to update their own profile
      - Delete: Allow users to delete their own profile

  Note: This migration ensures clean policy setup by removing existing policies first
*/

-- Enable RLS if not already enabled
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop ALL existing policies to ensure clean slate
DO $$ 
DECLARE 
  policy_name text;
BEGIN
  FOR policy_name IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', policy_name);
  END LOOP;
END $$;

-- Create fresh policies
CREATE POLICY "profiles_insert_policy"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "profiles_select_policy"
ON profiles
FOR SELECT
TO public
USING (true);

CREATE POLICY "profiles_update_policy"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_policy"
ON profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);