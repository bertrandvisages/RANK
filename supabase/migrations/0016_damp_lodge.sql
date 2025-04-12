/*
  # Fix keyword deletion with cascade delete

  1. Changes
    - Modify foreign key constraint on ranking_history table to add ON DELETE CASCADE
    - This ensures that when a keyword is deleted, its ranking history is automatically deleted

  2. Security
    - No changes to RLS policies
*/

-- Drop the existing foreign key constraint
ALTER TABLE ranking_history
DROP CONSTRAINT IF EXISTS ranking_history_keyword_id_fkey;

-- Re-create the constraint with ON DELETE CASCADE
ALTER TABLE ranking_history
ADD CONSTRAINT ranking_history_keyword_id_fkey
FOREIGN KEY (keyword_id)
REFERENCES keywords(id)
ON DELETE CASCADE;