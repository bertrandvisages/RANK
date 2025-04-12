/*
  # Add user settings to profiles table
  
  1. Changes
    - Add country column (text)
    - Add language column (text)
    - Add device_preference column (text)
    - Add default values for new columns
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS country text DEFAULT 'FR',
ADD COLUMN IF NOT EXISTS language text DEFAULT 'fr',
ADD COLUMN IF NOT EXISTS device_preference text DEFAULT 'desktop';