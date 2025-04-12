/*
  # Fix RLS policies for user preferences

  1. Changes
    - Drop existing policies
    - Create new policies with proper permissions for all operations
    - Ensure authenticated users can perform CRUD operations on their data
  
  2. Security
    - Enable RLS
    - Add policies for all CRUD operations
    - Restrict access to authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_preferences;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON user_preferences;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON user_preferences;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON user_preferences;

-- Create new policies with proper user_id checks
CREATE POLICY "Users can read their own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);