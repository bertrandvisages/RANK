/*
  # Remove favorites functionality
  
  1. Changes
    - Remove `is_favorite` column from `domains` table
    - Remove `is_favorite` column from `keywords` table
  
  2. Notes
    - This is a non-destructive change that only removes columns
    - Existing data is preserved
*/

-- Remove is_favorite column from domains table
ALTER TABLE domains 
DROP COLUMN IF EXISTS is_favorite;

-- Remove is_favorite column from keywords table
ALTER TABLE keywords 
DROP COLUMN IF EXISTS is_favorite;