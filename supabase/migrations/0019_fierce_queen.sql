/*
  # Add SERP URL column to ranking history

  1. Changes
    - Add `serp_url` column to `ranking_history` table for storing SERP result URLs
  
  2. Notes
    - The column is nullable since not all rankings will have a SERP URL
    - No data migration needed as this is a new column
*/

ALTER TABLE ranking_history
ADD COLUMN IF NOT EXISTS serp_url text;

-- Create an index to improve query performance when searching by SERP URL
CREATE INDEX IF NOT EXISTS idx_ranking_history_serp_url 
ON ranking_history(serp_url);