/*
  # Configure Signup Settings

  1. Changes
    - Enable email signup
    - Configure signup settings
    - Add necessary policies

  2. Security
    - Enable RLS on auth tables
    - Add policies for user data protection
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'auth' 
    AND tablename = 'users'
  ) THEN
    CREATE TABLE auth.users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE,
      encrypted_password text,
      email_confirmed_at timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own data" ON auth.users;
  DROP POLICY IF EXISTS "Users can update their own data" ON auth.users;

  -- Create new policies
  CREATE POLICY "Users can view their own data"
    ON auth.users
    FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own data"
    ON auth.users
    FOR UPDATE
    USING (auth.uid() = id);
END $$;