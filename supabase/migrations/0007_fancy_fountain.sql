/*
  # Configure Authentication Settings

  1. Changes
    - Enable RLS on auth.identities
    - Add RLS policies for user authentication
    - Configure secure access patterns

  2. Security
    - Ensure proper authentication policies
    - Protect user data
*/

-- Enable RLS on auth.identities
ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

-- Create necessary auth policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Can view own identity" ON auth.identities;
  DROP POLICY IF EXISTS "Can insert own identity" ON auth.identities;

  -- Create new policies
  CREATE POLICY "Can view own identity"
    ON auth.identities
    FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Can insert own identity"
    ON auth.identities
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
END $$;