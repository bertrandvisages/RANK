/*
  # Add default values for profiles

  1. Changes
    - Set default country to 'FR' (France)
    - Set default language to 'fr' (French)
    - Set default device preference to 'desktop'
    - Add NOT NULL constraints to ensure these values are always set

  Note: This migration ensures all new profiles have proper default values
*/

-- First update any existing NULL values
UPDATE profiles 
SET 
  country = 'FR',
  language = 'fr',
  device_preference = 'desktop'
WHERE 
  country IS NULL 
  OR language IS NULL 
  OR device_preference IS NULL;

-- Then add default values and NOT NULL constraints
ALTER TABLE profiles 
  ALTER COLUMN country SET DEFAULT 'FR',
  ALTER COLUMN country SET NOT NULL;

ALTER TABLE profiles 
  ALTER COLUMN language SET DEFAULT 'fr',
  ALTER COLUMN language SET NOT NULL;

ALTER TABLE profiles 
  ALTER COLUMN device_preference SET DEFAULT 'desktop',
  ALTER COLUMN device_preference SET NOT NULL;