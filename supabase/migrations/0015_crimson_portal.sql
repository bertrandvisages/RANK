/*
  # Update ranking history schema and policies

  1. Changes
    - Drop existing policies
    - Add valid_position constraint
    - Create indexes for better performance
*/

DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can read their own ranking history" ON ranking_history;
  DROP POLICY IF EXISTS "Users can insert their own ranking history" ON ranking_history;

  -- Add valid_position constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_position' 
    AND table_name = 'ranking_history'
  ) THEN
    ALTER TABLE ranking_history
    ADD CONSTRAINT valid_position CHECK (position > 0 AND position <= 101);
  END IF;
END $$;

-- Recreate policies
CREATE POLICY "Users can read their own ranking history"
  ON ranking_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM keywords
      WHERE keywords.id = ranking_history.keyword_id
      AND keywords.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own ranking history"
  ON ranking_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM keywords
      WHERE keywords.id = ranking_history.keyword_id
      AND keywords.user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ranking_history_keyword_id ON ranking_history(keyword_id);