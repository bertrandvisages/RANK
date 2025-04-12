/*
  # Add rankings column to keywords table

  1. Changes
    - Add JSONB column 'rankings' to keywords table to store ranking data
*/

ALTER TABLE keywords ADD COLUMN IF NOT EXISTS rankings JSONB;