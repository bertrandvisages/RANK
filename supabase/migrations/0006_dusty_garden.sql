/*
  # Enable Email Authentication

  1. Changes
    - Enable email authentication
    - Add necessary security policies for user profiles
    - Set up RLS for user authentication

  2. Security
    - Add RLS policies for user profile access
    - Ensure proper authentication checks
*/

-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users if it doesn't exist (this is usually created by Supabase, but we'll add a safety check)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'auth' 
    AND tablename = 'users'
  ) THEN
    CREATE TABLE auth.users (
      id uuid PRIMARY KEY,
      email text UNIQUE,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add RLS policies for user profiles
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON auth.users;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON auth.users;
  DROP POLICY IF EXISTS "Users can update own profile" ON auth.users;

  -- Create new policies
  CREATE POLICY "Public profiles are viewable by everyone"
    ON auth.users
    FOR SELECT
    USING (true);

  CREATE POLICY "Users can insert their own profile"
    ON auth.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON auth.users
    FOR UPDATE
    USING (auth.uid() = id);
END $$;